import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '@services/common/supabaseClient';

interface Post {
  cid: string;
  name: string;
  comment: string;
  created_at: string;
  updated_at: string;
  title: string;
}

/* 메인 컨테이너 */
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
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
  background-color: #fff;
  border: 1px solid #dee2e6;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
`;

/* 글 제목 */
const PostTitle = styled.strong`
  font-size: 1.2rem;
  color: #212529;
`;

/* 작성자 */
const PostAuthor = styled.div`
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: #495057;
`;

/* 글 내용 */
const PostContent = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
  color: #495057;
`;

/* 작성일 */
const PostDate = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #868e96;
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

const CommunityPage: React.FC = () => {
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

    // 검색어가 있을 경우, 제목(title) 또는 작성자(name) 등에서 검색하는 예시
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
    setPage(1); // 페이지 사이즈를 바꾸면 첫 페이지로 이동
  };

  // 검색어 입력 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 검색 버튼 클릭 (검색어 상태에 따라 fetchData가 실행됨)
  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  // 글작성 버튼 클릭 (작성 페이지로 이동하는 로직을 추가하세요)
  const handleWrite = () => {
    // 예시: '/write' 라우트로 이동 (react-router-dom 사용 시)
    // history.push('/write');
    console.log('글작성 버튼 클릭');
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
          <PostItem key={post.cid}>
            <PostTitle>{post.title}</PostTitle>
            <PostAuthor>작성자: {post.name}</PostAuthor>
            <PostContent>내용: {post.comment}</PostContent>
            <PostDate>
              작성일: {new Date(post.created_at).toLocaleString()}
            </PostDate>
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
};

export default CommunityPage;
