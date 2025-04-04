import { useState, useEffect } from 'react';
import { getPublicProfileUrl, supabase } from '@services/common/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineLike, AiOutlineEye, AiOutlineLeft, AiOutlineRight, AiFillLike } from 'react-icons/ai';
import { ActionButtons, AuthorInfo, Button, Container, ErrorMessage, Footer, FooterItem,
         ImageContainer, LeftArrow, LikeButton, ModalContent, ModalOverlay, PostContainer, PostContent, PostImage, RightArrow, Title
       } from '@styles/community/PostStyles';
import { useMainContext } from '@context/MainContext';
import { FaAngleLeft } from 'react-icons/fa6';
import { timeStamp } from '@components/common/TimeStamp';
import { usePopup } from '@hooks/UsePopup';
import { FaUser } from 'react-icons/fa';
import { ProfileImg, ProfileWrapper } from '@styles/main/ProfileStlyes';
import { getUser } from '@services/auth/AuthService';
import Comments from '@components/community/Comments';

interface Post {
  cid: string;
  title: string;
  uid: string;
  nickName: string;
  comment: string;
  created_at: number;
  updated_at: number;
  likes: number;
  view_count?: number;
  image_urls?: string[];
}
interface LocationState {
  cid: string;
}
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export default function Post() {
  const location = useLocation();
  const state = location.state as LocationState;
  const cid = state?.cid;
  const { userInfo } = useMainContext();
  const { showAlert, showConfirm } = usePopup();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  useEffect(() => {
    if (cid) {
      fetchPost();
    } else {
      setError("게시물 ID를 찾을 수 없습니다.");
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [cid]);

  useEffect(() => {
    if (post && userInfo?.uid) {
      checkLikeStatus();
    }
    // eslint-disable-next-line
  }, [post, userInfo]);

  const checkLikeStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('cid', post?.cid)
        .eq('uid', userInfo?.uid)
        .maybeSingle();
      if (error) {
        console.error('좋아요 상태 조회 오류:', error.message);
      }
      if (data) {
        setHasLiked(true);
      }
    } catch (error) {
      const supabaseError = error as SupabaseError;
      console.error('좋아요 실패:', supabaseError.message);
    }
  };

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('community')
        .select(
          `*, 
           views(count), 
           comments(count)`
        )
        .eq('cid', cid)
        .limit(1);
  
      if (error) {
        throw error;
      }
  
      const singleData = data?.[0];
  
      if (singleData) {
        const normalizedPost: Post = {
          ...singleData,
          view_count: singleData.views?.[0]?.count ?? 0,
        };
        setPost(normalizedPost);
      }
  
      const userData = await getUser(singleData.uid);
      const url = getPublicProfileUrl(userData.info?.profileUrl ?? null);
      setProfileUrl(url);
    } catch (error) {
      const supabaseError = error as SupabaseError;
      console.error('글 불러오기 실패:', supabaseError.message);
      setError('글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    if (hasLiked) {
      await showAlert({ message: "이미 좋아요 하셨습니다." });
      return;
    }
    
    try {
      const likeConfirm = await showConfirm({ message: "좋아요 하시겠어요?" });

      if (!likeConfirm) return;

      const newLikeCount = (post.likes || 0) + 1;
      const { error } = await supabase
        .from('likes')
        .insert([
          {
            cid: post.cid,
            uid: userInfo?.uid,
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      await showAlert({ message: "좋아요했습니다." });
      setPost({ ...post, likes: newLikeCount });
      setHasLiked(true);
    } catch (error) {
      const supabaseError = error as SupabaseError;
      console.error('좋아요 업데이트 실패:', supabaseError.message);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    const confirmDelete = await showConfirm({ message: '삭제하시겠습니까?' });
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('community')
        .delete()
        .eq('cid', post.cid);

      if (error) {
        throw error;
      }
      await showAlert({ message: '삭제되었습니다.' });
      navigate(-1);
    } catch (error) {
      const supabaseError = error as SupabaseError;
      console.error('삭제 실패:', supabaseError.message);
    }
  };

  const handleEditClick = () => {
    navigate('/community/write', { state: { cid } });
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return <Container>로딩 중...</Container>;
  }

  if (error || !cid) {
    return (
      <Container>
        <ErrorMessage>
          {error || "게시물을 찾을 수 없습니다."}
        </ErrorMessage>
        <Button onClick={handleGoBack}>돌아가기</Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <ErrorMessage>게시물을 찾을 수 없습니다.</ErrorMessage>
        <Button onClick={handleGoBack}>돌아가기</Button>
      </Container>
    );
  }

  return (
    <Container>
      <PostContainer>
        <Title>
          <FaAngleLeft onClick={handleGoBack} />
          {post.title}
        </Title>
        <AuthorInfo>
          <ProfileWrapper style={{ width: '40px', height: '40px', marginRight: '5px' }}>
            {profileUrl ? (
              <ProfileImg src={profileUrl} alt="프로필 이미지" />
            ) : (
              <FaUser size={20} color="#aaa" />
            )}
          </ProfileWrapper>
          {post.nickName} ㆍ {timeStamp(post.updated_at)} 전
        </AuthorInfo>
        <PostContent>{post.comment}</PostContent>
        {post.image_urls && post.image_urls.length > 0 && (
          <ImageContainer>
            {post.image_urls.map((url, index) => (
              <PostImage
                key={index}
                src={url}
                alt={`이미지 ${index + 1}`}
                onClick={() => setModalImageIndex(index)}
              />
            ))}
          </ImageContainer>
        )}
        <Footer>
          <FooterItem>
            <AiOutlineEye /> {post.view_count || 0}명이 봤어요
          </FooterItem>
          <FooterItem>
            <LikeButton
              onClick={handleLike}
              hasLiked= {hasLiked}
            >
              {hasLiked ? <AiFillLike /> : <AiOutlineLike/>} {post.likes || 0}명이 좋아해요
            </LikeButton>
          </FooterItem>
        </Footer>
      </PostContainer>

      <ActionButtons>
        {userInfo?.uid === post.uid && (
          <>
            <Button onClick={handleEditClick}>수정</Button>
            <Button onClick={handleDelete}>삭제</Button>
          </>
        )}
      </ActionButtons>
      <Comments cid={post.cid} />

      {modalImageIndex !== null && post.image_urls && (
        <ModalOverlay onClick={() => setModalImageIndex(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {modalImageIndex > 0 && (
              <LeftArrow
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex(modalImageIndex! - 1);
                }}
              >
                <AiOutlineLeft />
              </LeftArrow>
            )}
            <img
              src={post.image_urls[modalImageIndex]}
              alt={`확대된 이미지 ${modalImageIndex + 1}`}
            />
            {modalImageIndex < post.image_urls.length - 1 && (
              <RightArrow
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex(modalImageIndex! + 1);
                }}
              >
                <AiOutlineRight />
              </RightArrow>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
