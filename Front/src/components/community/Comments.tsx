import React, { useState, useEffect } from 'react';
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlusSquare,
} from 'react-icons/ai';
import { getPublicProfileUrl, supabase } from '@services/common/supabaseClient';
import { useMainContext } from '@context/MainContext';
import { usePopup } from '@hooks/UsePopup';
import { ProfileImg, ProfileWrapper } from '@styles/main/ProfileStlyes';
import { getUser } from '@services/auth/AuthService';
import {
  ActionItem,
  Button,
  CommentEdit,
  CommentForm,
  CommentInput,
  CommentsContainer,
  CommentsHeader,
  CommentsSection,
  HeaderLeft,
} from '@styles/community/PostStyles';
import { FaUser } from 'react-icons/fa';
import { timeStamp } from '@components/common/TimeStamp';
import { PostActions } from '@styles/community/CommunityStyles';

interface Comment {
  coid: string;
  cid: string;
  uid: string;
  nickName: string;
  comment: string;
  pcoid?: string | null;
  created_at: number;
  updated_at: number;
  image_urls?: string[];
  likeCount?: number;
  hasLiked?: boolean;
}

interface CommentsProps {
  cid: string;
}

export default function Comments({ cid }: CommentsProps) {
  const { userInfo } = useMainContext();
  const { showAlert, showConfirm } = usePopup();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [profileCache, setProfileCache] = useState<{ [uid: string]: string | null }>({});

  useEffect(() => {
    fetchComments();
  }, [cid, refresh]);

  // 댓글 목록과 함께 likeCount를 가져오고,
  // 로그인 상태라면 현재 유저가 좋아요 누른 댓글을 일괄 조회합니다.
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`*, comments_like(count)`)
      .eq('cid', cid)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('댓글 불러오기 실패:', error);
      return;
    }

    let processedComments = (data || []).map((comment) => ({
      ...comment,
      likeCount:
        comment.comments_like && comment.comments_like.length > 0
          ? comment.comments_like[0].count
          : 0,
    }));

    // 현재 로그인한 사용자가 좋아요를 누른 댓글 목록을 한 번만 조회
    if (userInfo?.uid && processedComments.length > 0) {
      const { data: userLikes, error: likesError } = await supabase
        .from('comments_like')
        .select('*')
        .eq('uid', userInfo.uid)
        .in('coid', processedComments.map((c) => c.coid));

      if (likesError) {
        console.error('사용자 좋아요 정보 불러오기 실패:', likesError);
      } else if (userLikes) {
        const userLikedCoids = new Set(userLikes.map((like) => like.coid));
        processedComments = processedComments.map((comment) => ({
          ...comment,
          hasLiked: userLikedCoids.has(comment.coid),
        }));
      }
    }

    setComments(processedComments);
  };

  const getProfileImage = async (uid: string): Promise<string | null> => {
    if (profileCache[uid] !== undefined) {
      return profileCache[uid];
    }
    const userData = await getUser(uid);
    const url = getPublicProfileUrl(userData.info?.profileUrl ?? null);
    setProfileCache((prev) => ({ ...prev, [uid]: url }));
    return url;
  };

  const handleNewCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !userInfo) return;
    const newComment = {
      cid,
      uid: userInfo.uid,
      comment: newCommentText,
      nickName: userInfo.nickName,
    };
    const { error } = await supabase.from('comments').insert([newComment]);
    if (error) {
      console.error('댓글 등록 실패:', error);
      return;
    }
    setNewCommentText('');
    setRefresh((r) => r + 1);
  };

  // top-level 댓글과 답글을 구분합니다.
  const topLevelComments = comments.filter((c) => !c.pcoid);
  const getReplies = (coid: string) => comments.filter((c) => c.pcoid === coid);

  const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [editedText, setEditedText] = useState(comment.comment);
    const [replyText, setReplyText] = useState('');
    const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
    const [hasLiked, setHasLiked] = useState(!!comment.hasLiked);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);

    useEffect(() => {
      const fetchProfile = async () => {
        const url = await getProfileImage(comment.uid);
        setProfileUrl(url);
      };
      fetchProfile();
    }, [comment.uid]);

    const handleLike = async () => {
      if (!userInfo) {
        await showAlert({ message: '로그인이 필요합니다.' });
        return;
      }
      if (hasLiked) {
        await showAlert({ message: '이미 좋아요 하셨습니다.' });
        return;
      }
      const { error } = await supabase
        .from('comments_like')
        .insert([{ coid: comment.coid, uid: userInfo.uid }]);
      if (error) {
        console.error('댓글 좋아요 실패:', error);
        return;
      }
      setLikeCount(likeCount + 1);
      setHasLiked(true);
      await showAlert({ message: '댓글에 좋아요를 눌렀습니다.' });
    };

    const handleDelete = async () => {
      const confirmResult = await showConfirm({ message: '댓글을 삭제하시겠습니까?' });
      if (!confirmResult) return;
      const { error } = await supabase.from('comments').delete().eq('coid', comment.coid);
      if (error) {
        console.error('댓글 삭제 실패:', error);
        return;
      }
      await showAlert({ message: '댓글이 삭제되었습니다.' });
      setRefresh((r) => r + 1);
    };

    const handleEdit = async () => {
      const { error } = await supabase
        .from('comments')
        .update({ comment: editedText })
        .eq('coid', comment.coid);
      if (error) {
        console.error('댓글 수정 실패:', error);
        return;
      }
      await showAlert({ message: '댓글이 수정되었습니다.' });
      setIsEditing(false);
      setRefresh((r) => r + 1);
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim() || !userInfo) return;
      const replyData = {
        cid: comment.cid,
        uid: userInfo.uid,
        comment: replyText,
        nickName: userInfo.nickName,
        pcoid: comment.coid,
      };
      const { error } = await supabase.from('comments').insert([replyData]);
      if (error) {
        console.error('답글 등록 실패:', error);
        return;
      }
      await showAlert({ message: '답글이 등록되었습니다.' });
      setReplyText('');
      setIsReplying(false);
      setRefresh((r) => r + 1);
    };

    return (
      <CommentsSection>
        <CommentsHeader>
          <HeaderLeft>
            <ProfileWrapper style={{ width: '30px', height: '30px', marginRight: '5px' }}>
              {profileUrl ? (
                <ProfileImg src={profileUrl} alt="프로필 이미지" />
              ) : (
                <FaUser size={20} color="#aaa" />
              )}
            </ProfileWrapper>
            <strong style={{ marginRight: '5px' }}>{comment.nickName}</strong>
            <sub style={{ fontSize: '0.8rem', color: '#888' }}>
              {timeStamp(comment.updated_at)}
            </sub>
          </HeaderLeft>
          <div>
            {userInfo?.uid === comment.uid && (
              <PostActions>
                <ActionItem onClick={() => setIsEditing(true)}>
                  <AiOutlineEdit /> 수정
                </ActionItem>
                <ActionItem onClick={handleDelete}>
                  <AiOutlineDelete /> 삭제
                </ActionItem>
              </PostActions>
            )}
          </div>
        </CommentsHeader>
        {isEditing ? (
          <CommentEdit>
            <CommentInput
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              style={{ width: '100%' }}
            />
            <Button onClick={handleEdit}>수정</Button>
            <Button onClick={() => setIsEditing(false)}>취소</Button>
          </CommentEdit>
        ) : (
          <p>{comment.comment}</p>
        )}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <ActionItem onClick={handleLike}>
            {hasLiked ? <AiFillLike /> : <AiOutlineLike />} {likeCount}
          </ActionItem>
          {/* 상위 댓글(top-level)일 때만 답글 버튼 노출 */}
          {userInfo && !comment.pcoid && (
            <ActionItem onClick={() => setIsReplying(!isReplying)}>
              <AiOutlinePlusSquare /> 답글
            </ActionItem>
          )}
        </div>

        {/* 답글 작성 폼 */}
        {isReplying && (
          <CommentForm onSubmit={handleReplySubmit} style={{ marginTop: '8px' }}>
            <CommentInput
              type="text"
              placeholder="답글을 입력하세요..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button type="submit" style={{ paddingBlock: '6px' }}>
              등록
            </Button>
          </CommentForm>
        )}

        {/* 답글 목록 */}
        {getReplies(comment.coid).length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {getReplies(comment.coid).map((reply) => (
              <div
                key={reply.coid}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginTop: '10px',
                  // 아이콘과 댓글 내용을 가로로 배치
                }}
              >
                {/* ㄴ 아이콘 */}
                <span style={{ marginRight: '8px', color: '#ccc', userSelect: 'none' }}>
                  ㄴ
                </span>
                {/* 실제 답글 내용 */}
                <div style={{ flex: 1 }}>
                  <CommentItem comment={reply} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CommentsSection>
    );
  };

  return (
    <CommentsContainer>
      <h2>댓글</h2>
      {topLevelComments.length > 0 ? (
        topLevelComments.map((comment) => (
          <CommentItem key={comment.coid} comment={comment} />
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}

      {/* 새 댓글 작성 영역 */}
      {userInfo ? (
        <CommentForm onSubmit={handleNewCommentSubmit} style={{ marginTop: '16px' }}>
          <CommentInput
            type="text"
            placeholder="댓글을 입력하세요..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            style={{ width: '80%' }}
          />
          <Button type="submit">댓글 등록</Button>
        </CommentForm>
      ) : (
        <p>댓글을 작성하려면 로그인이 필요합니다.</p>
      )}
    </CommentsContainer>
  );
}
