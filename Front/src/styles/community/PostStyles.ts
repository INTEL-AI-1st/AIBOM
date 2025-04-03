import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #343a40;

  svg{
    size: 2rem;
    cursor: pointer;
    margin-right: 10px;
    padding-bottom: 8px;
  }

  @media (max-width: 600px) {
    font-size: 1.5rem;

    svg{
        size: 1.5rem;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-bottom: none;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  resize: none;
  min-height: 300px;
`;

export const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 150px;
  width: 100%;
  overflow-x: auto;
`;

export const ImagePreviewItem = styled.div`
  position: relative;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FileInputWrapper = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #ffb9b9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #eea9a9;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  align-items: center;

`;

export const ButtonForm = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;


////
export const PostContainer = styled.div`
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #868e96;
  height: 10px;
  margin-bottom: 1rem;
`;

export const PostContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
  margin-bottom: 1rem;
`;

export const ImageContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
`;

export const PostImage = styled.img`
  width: calc(100% / 3 - 8px);
  max-width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.2rem;

  svg{
    padding-bottom: 2px;
  }
`;

export const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #868e96;
`;

export const LikeButton = styled.div<{hasLiked : boolean}>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 5px;
  background-color: ${({ hasLiked }) => (hasLiked ? '#ffb9b9' : 'transparent')};
  color: ${({ hasLiked }) => (hasLiked ? '#fff' : '#666')};
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: end;
  gap: 1rem;
  height: 3rem;
`;

export const ErrorMessage = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;


const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: initial;
  border: none;
  color: #fff;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 2rem;
  z-index: 1001;
`;

export const LeftArrow = styled(ArrowButton)`
  left: -100px;

  @media (max-width: 480px) {
    left: -50px;
  }
`;

export const RightArrow = styled(ArrowButton)`
  right: -100px;

  @media (max-width: 480px) {
    right: -50px;
  }
`;

//

export const CommentsContainer = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
`;

export const CommentsSection = styled.div`
  border: 1px solid #dee2e6;
  padding: 1rem;
  border-radius: 8px;
`;

export const CommentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  `;

export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
`;

export const ActionItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;

  svg{
    margin-bottom: 5px;
  }
`;

export const CommentItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.95rem;
  color: #495057;
`;

export const CommentForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const CommentInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

export const CommentEdit = styled.div`
  display: flex;
  gap: 2px;
  button{
    padding: 5px 10px;
    font-size: 1rem;
  }
`;