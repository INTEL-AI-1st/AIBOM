import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlusSquare,
  AiOutlineMinusSquare,
} from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import { getPublicProfileUrl, supabase } from '@services/common/supabaseClient';
import { useMainContext } from '@context/MainContext';
import { usePopup } from '@hooks/UsePopup';
import { getUser } from '@services/auth/AuthService';
import {
  CommentsContainer,
  CommentsSection,
  CommentsHeader,
  HeaderLeft,
  CommentForm,
  CommentInput,
  CommentEdit,
  Button,
  ActionItem,
} from '@styles/community/PostStyles';
import { ProfileImg, ProfileWrapper } from '@styles/main/ProfileStlyes';
import { PostActions } from '@styles/community/CommunityStyles';
import { timeStamp } from '@components/common/TimeStamp';
import { BiSubdirectoryRight } from 'react-icons/bi';

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

interface UserInfo {
  uid: string;
  nickName: string;
}

interface CommentsProps {
  cid: string;
}

// 프로필 이미지 캐시를 상위 컴포넌트에서 분리하여 전역 캐시로 관리
const profileCache: Record<string, string | null> = {};

// 프로필 이미지 컴포넌트 분리
const ProfileImage = memo(({ uid }: { uid: string }) => {
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (profileCache[uid] !== undefined) {
        setProfileUrl(profileCache[uid]);
        return;
      }
      const userData = await getUser(uid);
      const url = getPublicProfileUrl(userData.info?.profileUrl ?? null);
      profileCache[uid] = url; // 전역 캐시에 저장
      setProfileUrl(url);
    };
    fetchProfile();
  }, [uid]);

  return (
    <ProfileWrapper style={{ width: '30px', height: '30px', marginRight: '5px' }}>
      {profileUrl ? (
        <ProfileImg src={profileUrl} alt="프로필 이미지" />
      ) : (
        <FaUser size={20} color="#aaa" />
      )}
    </ProfileWrapper>
  );
});

// 댓글 아이템 컴포넌트 분리 및 메모이제이션
const CommentItem = memo(
  ({
    comment,
    onReply,
    onRefresh,
    userInfo,
    showAlert,
    showConfirm,
    replyTarget,
  }: {
    comment: Comment;
    onReply: (comment: Comment | null) => void;
    onRefresh: () => void;
    userInfo: UserInfo | undefined;
    showAlert: ({ message }: { message: string }) => Promise<void>;
    showConfirm: ({ message }: { message: string }) => Promise<boolean>;
    replyTarget: Comment | null;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.comment);
    const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
    const [hasLiked, setHasLiked] = useState(!!comment.hasLiked);

    // 현재 댓글이 답글 대상인지 확인
    const isReplyTarget = useCallback(() => 
      replyTarget && replyTarget.coid === comment.coid, [replyTarget, comment.coid]);

    // 좋아요 처리
    const handleLike = useCallback(async () => {
      if (!userInfo) {
        await showAlert({ message: '로그인이 필요합니다.' });
        return;
      }
      if (hasLiked) {
        await showAlert({ message: '이미 좋아요 하셨습니다.' });
        return;
      }
      
      try {
        const { error } = await supabase
          .from('comments_like')
          .insert([{ coid: comment.coid, uid: userInfo.uid }]);
        
        if (error) throw error;
        
        setLikeCount(prev => prev + 1);
        setHasLiked(true);
        await showAlert({ message: '댓글에 좋아요를 눌렀습니다.' });
      } catch (error) {
        console.error('댓글 좋아요 실패:', error);
      }
    }, [comment.coid, hasLiked, userInfo, showAlert]);

    // 댓글 삭제 처리
    const handleDelete = useCallback(async () => {
      const confirmResult = await showConfirm({ message: '댓글을 삭제하시겠습니까?' });
      if (!confirmResult) return;
      
      try {
        const { error } = await supabase.from('comments').delete().eq('coid', comment.coid);
        if (error) throw error;
        
        await showAlert({ message: '댓글이 삭제되었습니다.' });
        onRefresh();
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      }
    }, [comment.coid, showConfirm, showAlert, onRefresh]);

    // 댓글 수정 처리
    const handleEdit = useCallback(async () => {
      try {
        const { error } = await supabase
          .from('comments')
          .update({ comment: editedText })
          .eq('coid', comment.coid);
        
        if (error) throw error;
        
        await showAlert({ message: '댓글이 수정되었습니다.' });
        setIsEditing(false);
        onRefresh();
      } catch (error) {
        console.error('댓글 수정 실패:', error);
      }
    }, [comment.coid, editedText, showAlert, onRefresh]);

    // 답글 토글 핸들러
    const handleReplyToggle = useCallback(() => {
      onReply(isReplyTarget() ? null : comment);
    }, [onReply, isReplyTarget, comment]);

    return (
      <CommentsSection>
        <CommentsHeader>
          <HeaderLeft>
            {comment.pcoid && (
              <BiSubdirectoryRight style={{ marginRight: '6px', color: '#888', border: '1px solid #ddd'}}/>
            )}
            <ProfileImage uid={comment.uid} />
            <strong style={{ marginRight: '5px' }}>{comment.nickName}</strong>
            <sub style={{ fontSize: '0.8rem', color: '#888' }}>
              {timeStamp(comment.updated_at)}
            </sub>
          </HeaderLeft>
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
          {userInfo && !comment.pcoid && (
            <ActionItem onClick={handleReplyToggle}>
              {isReplyTarget() ? (
                <>
                  <AiOutlineMinusSquare /> 답글 취소
                </>
              ) : (
                <>
                  <AiOutlinePlusSquare /> 답글
                </>
              )}
            </ActionItem>
          )}
        </div>
      </CommentsSection>
    );
  }
);

const ReplyForm = memo(
  ({
    replyTarget,
    replyText,
    setReplyText,
    onSubmit,
    onCancel,
  }: {
    replyTarget: Comment;
    replyText: string;
    setReplyText: (text: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
  }) => (
    <div style={{ marginTop: '8px' }}>
      <CommentForm onSubmit={onSubmit}>
        <CommentInput
          type="text"
          placeholder={`"${replyTarget.nickName}"님에게 답글을 입력하세요...`}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          style={{ width: '80%' }}
        />
        <Button type="submit">답글 등록</Button>
        <Button type="button" onClick={onCancel}>
          취소
        </Button>
      </CommentForm>
    </div>
  )
);

export default function Comments({ cid }: CommentsProps) {
  const { userInfo } = useMainContext();
  const { showAlert, showConfirm } = usePopup();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');
  const [version, setVersion] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`*, comments_like(count)`)
        .eq('cid', cid)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      let processedComments = (data || []).map((comment) => ({
        ...comment,
        likeCount:
          comment.comments_like && comment.comments_like.length > 0
            ? comment.comments_like[0].count
            : 0,
      }));

      if (userInfo?.uid && processedComments.length > 0) {
        const { data: userLikes, error: likesError } = await supabase
          .from('comments_like')
          .select('*')
          .eq('uid', userInfo.uid)
          .in('coid', processedComments.map((c) => c.coid));
        
        if (likesError) throw likesError;
        
        if (userLikes) {
          const userLikedCoids = new Set(userLikes.map((like) => like.coid));
          processedComments = processedComments.map((comment) => ({
            ...comment,
            hasLiked: userLikedCoids.has(comment.coid),
          }));
        }
      }
      
      setComments(processedComments);
    } catch (error) {
      console.error('댓글 데이터 가져오기 실패:', error);
    }
  }, [cid, userInfo?.uid]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, version]);

  const handleRefresh = useCallback(() => {
    setVersion(prev => prev + 1);
  }, []);

  const handleNewCommentSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !userInfo) return;
    
    try {
      const newComment = {
        cid,
        uid: userInfo.uid,
        comment: newCommentText,
        nickName: userInfo.nickName,
      };
      
      const { error } = await supabase.from('comments').insert([newComment]);
      if (error) throw error;
      
      setNewCommentText('');
      handleRefresh();
    } catch (error) {
      console.error('댓글 등록 실패:', error);
    }
  }, [cid, newCommentText, userInfo, handleRefresh]);

  const handleReplySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !userInfo || !replyTarget) return;
    
    try {
      const replyData = {
        cid: replyTarget.cid,
        uid: userInfo.uid,
        comment: replyText,
        nickName: userInfo.nickName,
        pcoid: replyTarget.coid,
      };
      
      const { error } = await supabase.from('comments').insert([replyData]);
      if (error) throw error;
      
      await showAlert({ message: '답글이 등록되었습니다.' });
      setReplyText('');
      setReplyTarget(null);
      handleRefresh();
    } catch (error) {
      console.error('답글 등록 실패:', error);
    }
  }, [replyText, userInfo, replyTarget, showAlert, handleRefresh]);

  const { topLevelComments, repliesMap } = useMemo(() => {
    const topLevel = comments.filter(c => !c.pcoid);
    const replies = comments.reduce((acc, comment) => {
      if (comment.pcoid) {
        if (!acc[comment.pcoid]) {
          acc[comment.pcoid] = [];
        }
        acc[comment.pcoid].push(comment);
      }
      return acc;
    }, {} as Record<string, Comment[]>);
    
    return { topLevelComments: topLevel, repliesMap: replies };
  }, [comments]);

  return (
    <CommentsContainer>
      <h2>댓글</h2>
      {topLevelComments.length > 0 ? (
        topLevelComments.map((comment) => (
          <div key={comment.coid} style={{ marginBottom: '16px' }}>
            <CommentItem
              comment={comment}
              onReply={setReplyTarget}
              onRefresh={handleRefresh}
              userInfo={userInfo}
              showAlert={showAlert}
              showConfirm={showConfirm}
              replyTarget={replyTarget}
            />
            
            {replyTarget && replyTarget.coid === comment.coid && (
              <ReplyForm
                replyTarget={replyTarget}
                replyText={replyText}
                setReplyText={setReplyText}
                onSubmit={handleReplySubmit}
                onCancel={() => setReplyTarget(null)}
              />
            )}
            
            {repliesMap[comment.coid]?.length > 0 && (
              <div style={{ marginLeft: '20px', marginTop: '8px' }}>
                {repliesMap[comment.coid].map((reply) => (
                  <div key={reply.coid} style={{ marginTop: '8px' }}>
                    <CommentItem
                      comment={reply}
                      onReply={setReplyTarget}
                      onRefresh={handleRefresh}
                      userInfo={userInfo}
                      showAlert={showAlert}
                      showConfirm={showConfirm}
                      replyTarget={replyTarget}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}

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