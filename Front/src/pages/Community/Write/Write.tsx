import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '@services/common/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

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

// 이미지 상태: 새로 업로드하는 경우 file 값 존재, 기존 이미지는 file 없이 preview 값만 존재하며 isNew는 false
type ImageItem = {
  file?: File;
  preview: string;
  isNew: boolean;
};

export default function WritePost() {
  const { id } = useParams<{ id: string }>(); // id가 있으면 수정 페이지로 판단
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const navigate = useNavigate();

  // 수정 시, 기존 데이터 불러오기
  useEffect(() => {
    if (id) {
      (async () => {
        const { data, error } = await supabase
          .from('community')
          .select('*')
          .eq('cid', id)
          .single();
        if (error) {
          console.error('게시글 불러오기 실패:', error.message);
        } else if (data) {
          setTitle(data.title);
          setComment(data.comment);
          // image_urls가 배열로 저장되어 있다고 가정, 기존 이미지들은 isNew=false
          if (data.image_urls && Array.isArray(data.image_urls)) {
            const existingImages = data.image_urls.map((url: string) => ({
              preview: url,
              isNew: false,
            }));
            setImages(existingImages);
          }
        }
      })();
    }
  }, [id]);

  // 파일 입력 변경 시, 선택된 파일들을 미리보기로 추가
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: ImageItem[] = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      }));
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  // 미리보기 이미지 삭제
  const handleDeleteImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // 새 이미지들만 업로드 후, public URL 배열 반환
  const uploadNewImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const img of images.filter((img) => img.isNew && img.file)) {
      const fileExt = img.file!.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('communites')
        .upload(filePath, img.file!);

      if (uploadError) {
        console.error('이미지 업로드 실패:', uploadError.message);
        continue;
      }

      const { data } = supabase.storage
        .from('communites')
        .getPublicUrl(filePath);
      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 새로 업로드할 이미지의 URL 가져오기
    const newImageUrls = await uploadNewImages();
    // 기존 이미지들 (isNew === false)의 preview는 이미 URL임
    const existingImageUrls = images
      .filter((img) => !img.isNew)
      .map((img) => img.preview);
    const imageUrls = [...existingImageUrls, ...newImageUrls];

    // uid와 nickName은 실제 사용자 정보로 대체 (예시 값 사용)
    if (id) {
      // 수정: community 테이블 update
      const { error } = await supabase
        .from('community')
        .update({
          title,
          comment,
          image_urls: imageUrls,
          // uid, nickName 등 필요한 필드는 그대로 유지하거나 업데이트
        })
        .eq('cid', id);
      if (error) {
        console.error('글 수정 실패:', error.message);
      } else {
        navigate('/');
      }
    } else {
      // 작성: community 테이블 insert
      const { error } = await supabase.from('community').insert([
        {
          title,
          comment,
          image_urls: imageUrls,
          uid: 'example-uid', // 실제 uid 값으로 대체
          nickName: 'example-nickName', // 실제 nickName 값으로 대체
        },
      ]);
      if (error) {
        console.error('글 작성 실패:', error.message);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Container>
      <Title>{id ? '글 수정' : '글 작성'}</Title>
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
        <Button type="submit">{id ? '수정 완료' : '작성 완료'}</Button>
      </Form>
    </Container>
  );
}
