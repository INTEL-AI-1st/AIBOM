import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@services/common/supabaseClient';
import {
  CommunityContainer, TopSortContainer, SortButton, Container, HeaderWrapper, SearchWrapper, SearchSelect, SearchInput, SearchButton,
  WriteButton, PageSizeWrapper, PageSizeSelect, PostList, PostItem, PostHeader, PostTitle, PostAuthor, PostBody, PostContent,
  ImageWrapper, PostImage, ExtraImageOverlay, PostFooter, PostDate, PostActions, ActionItem, PaginationWrapper, PageButton
} from '@styles/community/CommunityStyles';
import { AiOutlineEye, AiOutlineLike } from 'react-icons/ai';
import { FaPen, FaRegComments } from 'react-icons/fa';
import { timeStamp } from '@components/common/TimeStamp';
import { useMainContext } from '@context/MainContext';

interface Post {
  cid: string;
  title: string;
  uid: string;
  nickName: string;
  comment: string;
  created_at: number;
  updated_at: number;
  likes: number;
  view_count: number;
  comment_count: number;
  image_urls?: string[];
}

export default function Community() {
  const { userInfo } = useMainContext();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<string>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchField, setSearchField] = useState<string>('title');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 실제 검색에 사용될 쿼리와 필드를 저장하는 상태 추가
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [activeSearchField, setActiveSearchField] = useState<string>('title');

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      let query = supabase
        .from('community')
        .select(
          `*, 
            views: views(count), 
            comments: comments(count)`,
          { count: 'exact' }
        )
        .eq('is_draft', false);

      if (activeSearchQuery) {
        query = query.ilike(activeSearchField, `%${activeSearchQuery}%`);
      }
      if (sortOrder === 'feed') {
        query = query.order('created_at', { ascending: false });
      } else if (sortOrder === 'popular') {
        query = query.order('likes', { ascending: false });
      }
      console.log(query);
      const { data: community, error, count } = await query.range(start, end);

      if (error) {
        console.error('데이터를 가져오는데 실패했습니다:', error.message);
        return;
      }

      if (community) {
        const normalizedPosts: Post[] = community.map((post): Post => ({
          ...post,
          view_count: post.views?.[0]?.count ?? 0,
          like_count: post.likes?.[0]?.count ?? 0,
          comment_count: post.comments?.[0]?.count ?? 0,
        }));        
        setPosts(normalizedPosts);
      }

      if (count !== null) {
        setTotalCount(count);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, activeSearchField, activeSearchQuery, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = useCallback((pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
  }, [totalPages]);

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  }, []);

  // 입력 필드 변경 시 검색 실행 없이 로컬 상태만 업데이트
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchFieldChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value);
  }, []);

  // 검색 버튼 클릭 또는 엔터 키 누를 때만 실제 검색 실행
  const handleSearch = useCallback(() => {
    setActiveSearchQuery(searchQuery);
    setActiveSearchField(searchField);
    setPage(1);
  }, [searchQuery, searchField]);

  const handleWrite = useCallback(() => {
    navigate('write');
  }, [navigate]);

  const handlePostClick = useCallback(async (cid: string) => {
    const { data: existingView, error: selectError } = await supabase
      .from('views')
      .select('*')
      .eq('cid', cid)
      .eq('viewer_id', userInfo?.uid)
      .maybeSingle();
  
    if (selectError) {
      console.error('조회 기록 확인 실패:', selectError.message);
      throw selectError;
    }
  
    if (!existingView) {
      const { error } = await supabase
        .from('views')
        .insert([{ cid, viewer_id: userInfo?.uid }]);
  
      if (error) {
        console.error('뷰 등록 실패:', error.message);
        throw error;
      }
    }
  
    navigate('post', { state: { cid } });
  }, [navigate, userInfo]);
  

  const paginationArray = useMemo(() =>
    Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const PostListItem = useCallback(({ post }: { post: Post }) => (
    <PostItem key={post.cid} onClick={() => handlePostClick(post.cid)}>
      <PostHeader>
        <PostTitle>{post.title}</PostTitle>
        <PostAuthor>{post.nickName}</PostAuthor>
      </PostHeader>
      <PostBody>
        <PostContent>{post.comment}</PostContent>
        {post.image_urls && post.image_urls.length > 0 && (
          <ImageWrapper>
            <PostImage src={post.image_urls[0]} alt="Post image" />
            {post.image_urls.length > 1 && (
              <ExtraImageOverlay>
                +{post.image_urls.length - 1}
              </ExtraImageOverlay>
            )}
          </ImageWrapper>
        )}
      </PostBody>
      <PostFooter>
        <PostDate>
          {timeStamp(post.updated_at)} 전
        </PostDate>
        <PostActions>
          <ActionItem>
            <AiOutlineEye />{post.view_count || 0}
          </ActionItem>
          <ActionItem>
            <FaRegComments />{post.comment_count || 0}
          </ActionItem>
          <ActionItem>
            <AiOutlineLike />{post.likes || 0}
          </ActionItem>
        </PostActions>
      </PostFooter>
    </PostItem>
  ), [handlePostClick]);

  return (
    <Container>
      <CommunityContainer>
        <TopSortContainer>
          <SortButton
            active={sortOrder === 'feed'}
            onClick={() => {
              setSortOrder('feed');
              setPage(1);
            }}
          >
            피드순
          </SortButton>
          <SortButton
            active={sortOrder === 'popular'}
            onClick={() => {
              setSortOrder('popular');
              setPage(1);
            }}
          >
            인기순
          </SortButton>
        </TopSortContainer>
        <HeaderWrapper>
          <SearchWrapper>
            <SearchSelect value={searchField} onChange={handleSearchFieldChange}>
              <option value="title">제목</option>
              <option value="nickName">작성자</option>
              <option value="comment">내용</option>
            </SearchSelect>
            <SearchInput
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchButton onClick={handleSearch} disabled={isLoading}>
              {isLoading ? '검색 중...' : '검색'}
            </SearchButton>
          </SearchWrapper>

          <PageSizeWrapper>
            페이지 당 표시 개수:
            <PageSizeSelect value={pageSize} onChange={handlePageSizeChange}>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={50}>50개</option>
            </PageSizeSelect>
          </PageSizeWrapper>
        </HeaderWrapper>

        <PostList>
          {isLoading ? (
            <div>데이터를 불러오는 중...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostListItem key={post.cid} post={post} />
            ))
          ) : (
            <div>게시물이 없습니다.</div>
          )}
        </PostList>

        {totalPages > 1 && (
          <PaginationWrapper>
            <PageButton onClick={() => goToPage(page - 1)} disabled={page <= 1}>
              이전
            </PageButton>
            {paginationArray.map((pageNum) => (
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
        )}
        <WriteButton onClick={handleWrite}>
          <FaPen size={16}/>
        </WriteButton>
      </CommunityContainer>
    </Container>
  );
}