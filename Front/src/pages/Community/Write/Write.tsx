import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@services/common/supabaseClient';
import { FaAngleLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineCamera } from 'react-icons/ai';
import * as PS from '@styles/community/PostStyles';
import { usePopup } from '@hooks/UsePopup';
import { useMainContext } from '@context/MainContext';

type ImageItem = {
  file?: File;
  preview: string;
  isNew: boolean;
};

interface LocationState {
  cid: string;
}

export default function WritePost() {
  const { userInfo } = useMainContext();
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // originalPost는 수정 모드에서 최초 불러온 데이터를 저장
  const [originalPost, setOriginalPost] = useState<{ title: string, comment: string, images: string[] } | null>(null);
  // 임시 저장된 글 데이터를 저장하는 state 추가
  const [loadedDraftData, setLoadedDraftData] = useState<{ title: string, comment: string, images: string[] } | null>(null);

  const location = useLocation();
  const state = location.state as LocationState;
  const cid = state?.cid;

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showAlert, showConfirm } = usePopup();
  
  // 렌더링 사이에도 이미지 상태를 유지하기 위한 ref 생성
  const imagesRef = useRef<ImageItem[]>([]);
  
  // images 상태가 변경될 때마다 ref도 업데이트
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // 임시저장 데이터 불러오기 (신규 작성 모드)
  useEffect(() => {
    if (!userInfo?.uid || cid) return;

    const fetchDraft = async () => {
      try {
        const { data, error } = await supabase
          .from('community')
          .select('*')
          .eq('uid', userInfo.uid)
          .eq('is_draft', true)
          .limit(1)
          .maybeSingle();
    
        if (error) throw error;
    
        if (data) {
          const shouldLoad = await showConfirm({ 
            message: '불러오기 데이터가 존재합니다. 불러오시겠습니까?' 
          });
          
          setDraftId(data.cid);
          
          if (shouldLoad) {
            setTitle(data.title || '');
            setComment(data.comment || '');
            let draftImages: ImageItem[] = [];
            let originalDraftImages: string[] = [];
            
            if (data.image_urls && Array.isArray(data.image_urls)) {
              draftImages = data.image_urls.map((url: string) => ({
                preview: url,
                isNew: false,
              }));
              originalDraftImages = data.image_urls;
            }
            
            setImages(draftImages);
            // ref도 함께 업데이트
            imagesRef.current = draftImages;
            
            // 임시저장 데이터 원본 저장
            setLoadedDraftData({
              title: data.title || '',
              comment: data.comment || '',
              images: originalDraftImages,
            });
            
            setHasLoadedDraft(true);
          }
        }
      } catch (err) {
        console.error('임시저장 불러오기 에러:', err);
      }
    };
    
    fetchDraft();
    // eslint-disable-next-line
  }, [userInfo, cid]);

  // 게시글 불러오기 (수정 모드)
  useEffect(() => {
    if (!cid) return;

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('community')
          .select('*')
          .eq('cid', cid)
          .single();

        if (error) throw error;

        setTitle(data.title || '');
        setComment(data.comment || '');
        let initialImages: ImageItem[] = [];
        let originalImages: string[] = [];
        if (data.image_urls && Array.isArray(data.image_urls)) {
          initialImages = data.image_urls.map((url: string) => ({
            preview: url,
            isNew: false,
          }));
          originalImages = data.image_urls;
        }
        setImages(initialImages);
        // ref도 함께 업데이트
        imagesRef.current = initialImages;
        // 원본 데이터를 저장해두어 변경 여부를 비교
        setOriginalPost({
          title: data.title || '',
          comment: data.comment || '',
          images: originalImages,
        });
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        showAlert({ message: '게시글을 불러오는데 실패했습니다.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [cid, showAlert]);

  // 이미지 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // ref에서 현재 이미지 상태를 가져옴
    const selectedFiles = Array.from(e.target.files);
    const availableSlots = 4 - imagesRef.current.length;

    if (availableSlots <= 0) {
      showAlert({ message: "이미지는 4개까지만 올릴 수 있습니다." });
      return;
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    const newImages = [...imagesRef.current, ...filesToAdd];
    setImages(newImages);
    // state와 ref 모두 업데이트
    imagesRef.current = newImages;
    
    // 파일 입력 필드 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 삭제 처리
  const handleDeleteImage = (index: number) => {
    // ref에서 현재 이미지 상태를 가져옴
    const newImages = [...imagesRef.current];
    if (newImages[index]?.isNew) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages.splice(index, 1);
    setImages(newImages);
    // state와 ref 모두 업데이트
    imagesRef.current = newImages;
  };

  // 새 이미지 업로드
  const uploadNewImages = async (): Promise<string[]> => {
    // ref에서 현재 이미지 상태를 가져옴
    const newImages = imagesRef.current.filter((img) => img.isNew && img.file);
    if (!newImages.length) return [];
    
    const uploadPromises = newImages.map(async (img) => {
      try {
        const fileExt = img.file!.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('communites')
          .upload(fileName, img.file!);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('communites')
          .getPublicUrl(fileName);

        return data?.publicUrl || '';
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        return '';
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== '');
  };

  // 글 저장 처리 공통 함수
  const savePost = async (isDraft: boolean) => {
    setIsLoading(true);
    try {
      // ref에서 현재 이미지 상태를 가져옴
      const currentImages = imagesRef.current;
      const newImageUrls = await uploadNewImages();
      const imageUrls = [
        ...currentImages.filter((img) => !img.isNew).map((img) => img.preview),
        ...newImageUrls
      ];

      const payload = {
        title,
        comment,
        image_urls: imageUrls,
        is_draft: isDraft,
      };

      let result;
      
      if (cid) {
        // 기존 게시글 수정
        result = await supabase.from('community')
          .update(payload)
          .eq('cid', cid);
      } else if (draftId) {
        // 임시저장된 글 업데이트
        result = await supabase.from('community')
          .update(payload)
          .eq('cid', draftId);
      } else {
        // 새 글 작성
        result = await supabase.from('community')
          .insert([{
            ...payload,
            uid: userInfo?.uid,
            nickName: userInfo?.nickName,
          }]);
      }

      if (result.error) throw result.error;
      
      return true;
    } catch (err) {
      console.error(isDraft ? '임시 저장 실패:' : '글 저장 실패:', err);
      showAlert({ message: '오류가 발생하였습니다.' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 변경 여부를 확인하는 함수 (수정 모드 전용)
  const hasChanges = () => {
    if (!originalPost) return false;
    if (title !== originalPost.title) return true;
    if (comment !== originalPost.comment) return true;
    
    // ref에서 현재 이미지 상태를 가져옴
    const currentImages = imagesRef.current;
    if (currentImages.length !== originalPost.images.length) return true;
    
    for (let i = 0; i < currentImages.length; i++) {
      const img = currentImages[i];
      if (img.isNew) return true;
      if (img.preview !== originalPost.images[i]) return true;
    }
    return false;
  };

  // 임시저장 불러온 글의 변경 여부를 확인하는 함수
  const hasDraftChanges = () => {
    if (!loadedDraftData) return title.trim() || comment.trim() || imagesRef.current.length > 0;
    
    if (title !== loadedDraftData.title) return true;
    if (comment !== loadedDraftData.comment) return true;
    
    // ref에서 현재 이미지 상태를 가져옴
    const currentImages = imagesRef.current;
    if (currentImages.length !== loadedDraftData.images.length) return true;
    
    for (let i = 0; i < currentImages.length; i++) {
      const img = currentImages[i];
      if (img.isNew) return true;
      if (img.preview !== loadedDraftData.images[i]) return true;
    }
    return false;
  };

  // 뒤로 가기 전 확인
  const handleGoBack = async () => {
    if (!cid) {
      // 임시저장 모드에서는 변경사항이 있을 때만 저장 여부 물어봄
      if (hasDraftChanges()) {
        const shouldSave = await showConfirm({
          message: '작성 중인 내용이 있습니다. 임시저장 하시겠습니까?'
        });
        if (shouldSave) {
          await handleTemporarySave({ preventDefault: () => {} } as React.FormEvent);
        }
      }
    } else {
      if (hasChanges()) {
        const shouldLeave = await showConfirm({
          message: '변경사항이 있습니다. 뒤로 가시면 저장하지 않은 변경 내용이 사라집니다. 계속하시겠습니까?'
        });
        if (!shouldLeave) return;
      }
    }
    navigate(-1);
  };

  // 글 작성/수정 완료
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showAlert({ message: '제목을 입력해주세요.' });
      return;
    }
    
    if (!comment.trim()) {
      showAlert({ message: '내용을 입력해주세요.' });
      return;
    }

    const success = await savePost(false);
    if (success) {
      if (cid) {
        if (!hasChanges()) {
          await showAlert({message: '수정된 이력이 없습니다'});
          return;
        }
        navigate(-1);
      } else {
        navigate('/community');
      }
    }
  };

  // 임시 저장
  const handleTemporarySave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 임시저장 데이터를 불러왔는데 변경사항이 없으면 안내
    if (hasLoadedDraft && !hasDraftChanges()) {
      await showAlert({message: '수정된 이력이 없습니다'});
      return;
    }

    if (draftId && !hasLoadedDraft) {
      const confirmOverwrite = await showConfirm({
        message: '임시저장 데이터를 불러오지 않은 상태에서 다시 임시저장하면 이전 데이터가 삭제됩니다. 계속하시겠습니까?'
      });
      if (!confirmOverwrite) return;
    }

    const success = await savePost(true);
    if (success) {
      // 임시저장 성공 후 현재 상태를 loadedDraftData에 저장
      setLoadedDraftData({
        title,
        comment,
        images: imagesRef.current.map(img => img.preview)
      });
      showAlert({ message: '임시저장 되었습니다.' });
      setHasLoadedDraft(true);
    }
  };

  return (
    <PS.Container>
      <PS.Title>
        <FaAngleLeft size={36} onClick={handleGoBack} style={{ cursor: 'pointer', marginRight: '10px' }} />
        {cid ? '글 수정' : '글 작성'}
      </PS.Title>
      <PS.Form onSubmit={handleSubmit}>
        <PS.Input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          required
        />
        <PS.TextArea
          placeholder="내용을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isLoading}
          required
        />
        <PS.ImagePreviewContainer>
          {images.map((img, index) => (
            <PS.ImagePreviewItem key={index} style={{ width: `${100 / Math.min(images.length, 4)}%` }}>
              <PS.PreviewImage src={img.preview} alt="미리보기" />
              <PS.DeleteButton 
                type="button"
                onClick={() => handleDeleteImage(index)}
                disabled={isLoading}
              >
                &times;
              </PS.DeleteButton>
            </PS.ImagePreviewItem>
          ))}
        </PS.ImagePreviewContainer>

        <PS.ButtonRow>
          <PS.FileInputWrapper>
            <AiOutlineCamera size={36} color={isLoading || images.length >= 4 ? "#ccc" : "#868e96"} />
            <PS.HiddenFileInput
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isLoading || images.length >= 4}
            />
          </PS.FileInputWrapper>
          <PS.ButtonForm>
            {!cid && (
              <PS.Button 
                type="button" 
                onClick={handleTemporarySave}
                disabled={isLoading}
              >
                {isLoading ? '저장 중...' : '임시저장'}
              </PS.Button>
            )}
            <PS.Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : (cid ? '수정 완료' : '작성 완료')}
            </PS.Button>
          </PS.ButtonForm>
        </PS.ButtonRow>
      </PS.Form>
    </PS.Container>
  );
}