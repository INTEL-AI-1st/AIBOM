import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '@services/common/supabaseClient';
import { AiOutlineLike } from 'react-icons/ai';
import { BiChat } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

interface Post {
  cid: string;
  title: string;
  uid: string;
  nickName: string;
  comment: string;
  created_at: string;
  updated_at: string;
  likeCount?: number;
  chatCount?: number;
  imageUrl?: string; // 선택적 이미지 URL 필드 추가
}

/* 메인 컨테이너 */
const Container = styled.div`
  max-width: 1200px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

/* 제목 */
const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #343a40;
`;

/* 헤더 영역: 검색바와 글작성 버튼 */
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

/* 검색 영역 */
const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

/* 검색 입력창 */
const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

/* 검색 버튼 */
const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background-color: #1c7ed6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1864ab;
  }
`;

/* 글작성 버튼 */
const WriteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #20c997;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #17a2b8;
  }
`;

/* 페이지 사이즈 선택 래퍼 */
const PageSizeWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: #495057;
`;

/* 페이지 사이즈 선택 셀렉트 */
const PageSizeSelect = styled.select`
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  background-color: #fff;

  &:focus {
    outline: none;
    border-color: #868e96;
  }
`;

/* 글 목록(ul) */
const PostList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

/* 글 아이템(li) */
const PostItem = styled.li`
  width: 1000px;
  background-color: #fff;
  border: 1px solid #dee2e6;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  transition: box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

/* 글 헤더 (타이틀과 작성자: 양 끝 배치) */
const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* 글 제목 */
const PostTitle = styled.strong`
  font-size: 1.2rem;
  color: #212529;
`;

/* 작성자 */
const PostAuthor = styled.div`
  font-size: 0.9rem;
  color: #495057;
`;

/* 글 내용과 이미지 영역을 감싸는 컨테이너 */
const PostBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

/* 글 내용: 한 줄만 표시하고 넘치면 ... 처리, 가용 공간 채우기 */
const PostContent = styled.div`
  flex: 1;
  font-size: 1rem;
  line-height: 1.4;
  color: #495057;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* 이미지 래퍼: 우측에 고정 크기로 배치 */
const ImageWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-left: 1rem;
  flex-shrink: 0;
`;

/* 이미지 스타일 */
const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

/* 글 푸터 (날짜와 액션 영역: 좋아요, 채팅) */
const PostFooter = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* 작성일 */
const PostDate = styled.div`
  font-size: 0.8rem;
  color: #868e96;
`;

/* 액션 버튼 래퍼 (좋아요, 채팅 아이콘) */
const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

/* 아이콘과 숫자 높이 맞추기 위한 액션 아이템 */
const ActionItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

/* 페이지네이션 래퍼 */
const PaginationWrapper = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.25rem;
  justify-content: center;
`;

/* 페이지네이션 버튼 */
const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#1c7ed6' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#495057')};
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${({ active }) => (active ? '#1864ab' : '#f1f3f5')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default function Community() {
  const navigate = useNavigate();

  // 글 목록
  const [posts, setPosts] = useState<Post[]>([]);
  // 현재 페이지
  const [page, setPage] = useState<number>(1);
  // 페이지 당 표시 개수
  const [pageSize, setPageSize] = useState<number>(10);
  // 전체 글 수
  const [totalCount, setTotalCount] = useState<number>(0);
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 페이지네이션을 위한 전체 페이지 수
  const totalPages = Math.ceil(totalCount / pageSize);

  // Supabase에서 데이터 가져오기
  const fetchData = async () => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase.from('community').select('*', { count: 'exact' });
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data: community, error, count } = await query.range(start, end);

    if (error) {
      console.error('데이터를 가져오는데 실패했습니다:', error.message);
      return;
    }

    if (community) {
      setPosts(community);
    }

    if (count !== null) {
      setTotalCount(count);
    }
  };

  // page, pageSize, 검색어가 바뀔 때마다 데이터 갱신
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchQuery]);

  // 페이지 이동
  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
  };

  // 페이지 당 표시 개수 변경
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  // 검색어 입력 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  // 글작성 버튼 클릭 시 "/write" 경로로 이동
  const handleWrite = () => {
    navigate('/write');
  };

  // 글 아이템 클릭 시 해당 cid를 가지고 "/post/:cid"로 이동
  const handlePostClick = (cid: string) => {
    navigate(`/post/${cid}`);
  };

  return (
    <Container>
      <Title>커뮤니티 글 목록</Title>
      <HeaderWrapper>
        <SearchWrapper>
          <SearchInput
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchWrapper>
        <WriteButton onClick={handleWrite}>글작성</WriteButton>
      </HeaderWrapper>

      <PageSizeWrapper>
        페이지 당 표시 개수:
        <PageSizeSelect value={pageSize} onChange={handlePageSizeChange}>
          <option value={10}>10개</option>
          <option value={20}>20개</option>
          <option value={50}>50개</option>
        </PageSizeSelect>
      </PageSizeWrapper>

      <PostList>
        {posts.map((post) => (
          <PostItem key={post.cid} onClick={() => handlePostClick(post.cid)}>
            <PostHeader>
              <PostTitle>{post.title}</PostTitle>
              <PostAuthor>{post.nickName}</PostAuthor>
            </PostHeader>
            <PostBody>
              <PostContent>{post.comment}</PostContent>
              {post.imageUrl && (
                <ImageWrapper>
                  <PostImage src={post.imageUrl} alt="Post image" />
                </ImageWrapper>
              )}
            </PostBody>
            <PostFooter>
              <PostDate>{new Date(post.created_at).toLocaleString()}</PostDate>
              <PostActions>
                <ActionItem>
                  <AiOutlineLike /> {post.likeCount || 0}
                </ActionItem>
                <ActionItem>
                  <BiChat /> {post.chatCount || 0}
                </ActionItem>
              </PostActions>
            </PostFooter>
          </PostItem>
        ))}
      </PostList>

      {totalPages > 1 && (
        <PaginationWrapper>
          <PageButton onClick={() => goToPage(page - 1)} disabled={page <= 1}>
            이전
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <PageButton
              key={pageNum}
              active={pageNum === page}
              onClick={() => goToPage(pageNum)}
            >
              {pageNum}
            </PageButton>
          ))}
          <PageButton
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
          >
            다음
          </PageButton>
        </PaginationWrapper>
      )}
    </Container>
  );
}
