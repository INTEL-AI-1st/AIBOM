import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '@services/common/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #343a40;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  min-height: 150px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #20c997;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #17a2b8;
  }
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 1rem;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  height: 100px;
  overflow: hidden;
  border-radius: 4px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteButton = styled.button`
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

export default function WritePost() {
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  // images: 배열로 { file, preview } 저장
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const navigate = useNavigate();

  // 파일 입력 변경 시, 선택된 파일들을 미리보기로 추가
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  // 미리보기 이미지 삭제
  const handleDeleteImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      // 메모리 누수 방지를 위해 생성한 URL 해제
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // 모든 이미지를 업로드 후, public URL 배열 반환
  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const img of images) {
      const fileExt = img.file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, img.file);

      if (uploadError) {
        console.error('이미지 업로드 실패:', uploadError.message);
        continue;
      }

      const { publicURL } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);
      if (publicURL) {
        uploadedUrls.push(publicURL);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls = await uploadImages();

    // 커뮤니티 테이블에 글 작성 내용 저장
    // imageUrls 필드는 여러 이미지 URL을 저장하도록 JSON 배열로 처리
    const { error } = await supabase.from('community').insert([
      {
        title,
        comment,
        imageUrls, // 다수 이미지 URL 배열
        // uid, nickName 등 추가 필드가 필요하면 함께 추가하세요.
      },
    ]);

    if (error) {
      console.error('글 작성 실패:', error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <Container>
      <Title>글 작성</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="내용을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        {/* 업로드된 이미지 미리보기 영역 */}
        {images.length > 0 && (
          <ImagePreviewContainer>
            {images.map((img, index) => (
              <ImagePreviewItem
                key={index}
                // 업로드된 이미지 수에 따라 width를 동적으로 계산하여 모두 보이도록 함
                style={{ width: `${100 / images.length}%` }}
              >
                <PreviewImage src={img.preview} alt="미리보기" />
                <DeleteButton onClick={() => handleDeleteImage(index)}>
                  &times;
                </DeleteButton>
              </ImagePreviewItem>
            ))}
          </ImagePreviewContainer>
        )}
        <Button type="submit">작성 완료</Button>
      </Form>
    </Container>
  );
}
