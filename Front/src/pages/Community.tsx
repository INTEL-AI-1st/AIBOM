import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from "@services/common/supabaseClient";
interface Post {
  cid: string;
  name: string;
  comment: string;
  created_at: string;
  updated_at: string;
  title: string;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const PageSizeWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const PageSizeSelect = styled.select`
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PostItem = styled.li`
  border: 1px solid #ccc;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 4px;
`;

const PaginationWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.25rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: ${({ active }) => (active ? '#ddd' : '#fff')};
  cursor: pointer;

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

  // 페이지네이션을 위한 전체 페이지 수
  const totalPages = Math.ceil(totalCount / pageSize);

  // Supabase에서 데이터 가져오기
  const fetchData = async () => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // count 옵션을 'exact'로 주면 totalCount를 함께 받아올 수 있습니다.
    const { data, error, count } = await supabase
      .from('community') // 테이블 이름
      .select('*', { count: 'exact' })
      .range(start, end);
    
    console.log(`data ==== ${data}`);
    if (error) {
      console.error('데이터를 가져오는데 실패했습니다:', error.message);
      return;
    }

    if (data) {
      setPosts(data);
    }

    if (count !== null) {
      setTotalCount(count);
    }
  };

  // page, pageSize가 바뀔 때마다 데이터 갱신
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

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

  return (
    <Container>
      <Title>커뮤니티 글 목록</Title>
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
            <strong>{post.title}</strong>
            <div>작성자: {post.name}</div>
            <div>내용: {post.comment}</div>
            <div>작성일: {new Date(post.created_at).toLocaleString()}</div>
          </PostItem>
        ))}
      </PostList>

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
        <PageButton onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
          다음
        </PageButton>
      </PaginationWrapper>
    </Container>
  );
};

export default CommunityPage;
