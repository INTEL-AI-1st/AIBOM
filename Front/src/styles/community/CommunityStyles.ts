import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  background-color: #f8f9fa;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 768px) {
    padding: 0;
    flex-direction: column;
    align-items: center;
  }
`;

export const CommunityContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  position: relative;
`;

export const TopSortContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const SortButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  width: 200px;
  border: none;
  background-color: ${({ active }) => (active ? '#ffb9b9' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#495057')};
  border-radius: 4px;
  &:hover {
    background-color: ${({ active }) => (active ? '#eea9a9' : '#f1f3f5')};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  margin-right: 0.5rem;

  @media (max-width: 768px) {
    margin-right: 0.25rem;
  }
`;

export const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

export const SearchButton = styled.button`
  padding: 0.6rem 1rem;
  margin-left: 0.5rem;
  background-color: #ffb9b9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #eea9a9;
  }

  @media (max-width: 768px) {
    margin-left: 0.25rem;
  }
`;

export const PageSizeWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #495057;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

export const PageSizeSelect = styled.select`
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

export const PostList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const PostItem = styled.li`
  width: 100%;
  background-color: #fff;
  border: 1px solid #dee2e6;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PostTitle = styled.strong`
  font-size: 1.2rem;
  color: #212529;
`;

export const PostAuthor = styled.div`
  font-size: 0.9rem;
  color: #495057;
`;

export const PostBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-top: 0.5rem;

  /* --- 작은 화면에서는 세로 배치 --- */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const PostContent = styled.div`
  flex: 1;
  font-size: 1rem;
  line-height: 1.4;
  color: #495057;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ImageWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-left: 1rem;
  flex-shrink: 0;
  position: relative;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    height: auto;
  }
`;

export const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    height: auto;
  }
`;

export const ExtraImageOverlay = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    bottom: 10px;
  }
`;

export const PostFooter = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PostDate = styled.div`
  font-size: 0.8rem;
  color: #868e96;
`;

export const PostActions = styled.div`
  display: flex;
  color: #666;
  align-items: center;
  gap: 1rem;
  font-size: 0.9em;
`;

export const ActionItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const PaginationWrapper = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.25rem;
  justify-content: center;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#ffb9b9' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#495057')};
  cursor: pointer;
  &:hover:not(:disabled) {
    background-color: ${({ active }) => (active ? '#eea9a9' : '#f1f3f5')};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

export const WriteButton = styled.button`
  position: fixed;
  bottom: 7rem;
  right: 10rem;
  transform: translateX(500px - 3rem);

  padding: 1rem 1.2rem;
  background-color: #ffb9b9;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;

  &:hover {
    background-color: #eea9a9;
  }

  @media (max-width: 768px) {
    right: 2rem;
    bottom: 6rem;
    transform: none;
  }
`;
