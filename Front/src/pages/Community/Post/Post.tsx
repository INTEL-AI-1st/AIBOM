import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '@services/common/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineLike } from 'react-icons/ai';

interface Post {
  cid: string;
  title: string;
  uid: string;
  nickName: string;
  comment: string;
  created_at: string;
  updated_at: string;
  likeCount?: number;
  imageUrls?: string[]; // 여러 이미지 URL 배열
}

interface Comment {
  id: number;
  postId: string;
  uid: string;
  nickName: string;
  comment: string;
  created_at: string;
}

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const PostContainer = styled.div`
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #343a40;
`;

const AuthorInfo = styled.div`
  font-size: 0.9rem;
  color: #868e96;
  margin-bottom: 1rem;
`;

const PostContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
  margin-bottom: 1rem;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
`;

const PostImage = styled.img`
  width: calc(100% / 3 - 8px);
  max-width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #1c7ed6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1864ab;
  }
`;

const CommentsSection = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
`;

const CommentItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.95rem;
  color: #495057;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

export default function Post() {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (cid) {
      fetchPost();
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  // 글 데이터 가져오기
  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('community')
      .select('*')
      .eq('cid', cid)
      .single();
    if (error) {
      console.error('글 불러오기 실패:', error.message);
    } else {
      setPost(data);
    }
  };

  // 댓글 데이터 가져오기
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('postId', cid)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('댓글 불러오기 실패:', error.message);
    } else {
      setComments(data);
    }
  };

  // 좋아요 클릭 처리 (좋아요 수 1 증가)
  const handleLike = async () => {
    if (!post) return;
    const newLikeCount = (post.likeCount || 0) + 1;
    const { error } = await supabase
      .from('community')
      .update({ likeCount: newLikeCount })
      .eq('cid', post.cid);
    if (error) {
      console.error('좋아요 업데이트 실패:', error.message);
    } else {
      setPost({ ...post, likeCount: newLikeCount });
    }
  };

  // 글 삭제 처리 (작성자만 가능)
  const handleDelete = async () => {
    if (!post) return;
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;
    const { error } = await supabase
      .from('community')
      .delete()
      .eq('cid', post.cid);
    if (error) {
      console.error('삭제 실패:', error.message);
    } else {
      navigate('/');
    }
  };

  // 댓글 등록 처리
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;
    // 현재 사용자 정보에서 uid와 nickName을 사용 (없으면 이메일 사용)
    const commentData = {
      postId: post.cid,
      comment: newComment,
      uid: currentUser?.id,
      nickName: currentUser?.email,
    };
    const { error } = await supabase.from('comments').insert([commentData]);
    if (error) {
      console.error('댓글 등록 실패:', error.message);
    } else {
      setNewComment('');
      fetchComments();
    }
  };

  if (!post) {
    return <Container>로딩 중...</Container>;
  }

  return (
    <Container>
      <PostContainer>
        <Title>{post.title}</Title>
        <AuthorInfo>
          작성자: {post.nickName} | {new Date(post.created_at).toLocaleString()}
        </AuthorInfo>
        <PostContent>{post.comment}</PostContent>
        {post.imageUrls && post.imageUrls.length > 0 && (
          <ImageContainer>
            {post.imageUrls.map((url, index) => (
              <PostImage key={index} src={url} alt={`이미지 ${index + 1}`} />
            ))}
          </ImageContainer>
        )}
        <Footer>
          <LikeButton onClick={handleLike}>
            <AiOutlineLike /> {post.likeCount || 0}
          </LikeButton>
          {/* 현재 사용자가 작성자일 경우 수정/삭제 버튼 표시 */}
          {currentUser && currentUser.id === post.uid && (
            <ActionButtons>
              <Button onClick={() => navigate(`/edit/${post.cid}`)}>
                수정
              </Button>
              <Button onClick={handleDelete}>삭제</Button>
            </ActionButtons>
          )}
        </Footer>
      </PostContainer>
      <CommentsSection>
        <h2>댓글</h2>
        {comments.length > 0 ? (
          comments.map((comm) => (
            <CommentItem key={comm.id}>
              <strong>{comm.nickName}:</strong> {comm.comment}
              <div style={{ fontSize: '0.8rem', color: '#868e96' }}>
                {new Date(comm.created_at).toLocaleString()}
              </div>
            </CommentItem>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
        <CommentForm onSubmit={handleCommentSubmit}>
          <CommentInput
            type="text"
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit">댓글 등록</Button>
        </CommentForm>
      </CommentsSection>
    </Container>
  );
}
