import React, { useRef, useState, useEffect, useCallback } from 'react';
import { beha, selectAbilites } from '@services/measure/BehavioralService';
import * as BE from '@styles/measure/BehavioralStyles';
import { useMainContext } from '@context/MainContext';

export default function Behavioral() {
  const { selectedChild } = useMainContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [result, setResult] = useState<string>('');

  const fetchData = useCallback(async () => {
    if(isLoading) return;
    setIsLoading(true);
    try {;
      if(!selectedChild?.ageMonths) return;
      await selectAbilites(selectedChild.ageMonths);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChild?.ageMonths]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(userStream);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = userStream;
        }
        const recorder = new MediaRecorder(userStream);
        setMediaRecorder(recorder);
        setRecordedChunks([]);

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            setRecordedChunks((prev) => prev.concat(event.data));
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);

          // 사용이 끝난 스트림 중지
          userStream.getTracks().forEach((track) => track.stop());
          setStream(null);
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('녹화 시작 실패:', err);
        alert(`카메라 접근 권한이 없거나 문제가 발생했습니다. ${err}`);
      }
    } else {
      // 녹화 정지
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      setIsRecording(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      console.log('파일 선택됨:', file);
      // 파일 미리보기를 위해 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleTest = async () => {
    const formData = new FormData();
    if (
      fileInputRef.current &&
      fileInputRef.current.files &&
      fileInputRef.current.files[0]
    ) {
      formData.append('video', fileInputRef.current.files[0]);
    } else if (previewUrl) {
      // 녹화된 영상도 업로드 가능하도록 Blob 변환 처리
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      formData.append('video', blob, 'recorded.mp4');
    } else {
      alert('영상 파일을 먼저 업로드 또는 녹화 해주세요.');
      return;
    }

    try {
      console.log(fileInputRef.current);
      for (const [key, value] of formData.entries()) {
        console.log('FormData key:', key, 'FormData value:', value);
      }
      formData.append("data_type", `A\\1`);

      const response = await beha(formData);
      console.log(response);
      // setResult(response);
    } catch (error) {
      console.error(error);
      alert('측정(예측) 실행에 실패했습니다.');
    }
  };

  // 컴포넌트 언마운트 시 URL 객체 해제
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  console.log(selectedChild);
  return (
    <BE.Container>
      <BE.SubContainer>
        <BE.Title>KICCE 유아관찰척도 설문</BE.Title>
        <BE.Nav>
          <BE.NavList>
            {/* {domainList.map((domain) => (
              <BE.NavItem key={domain} onClick={() => scrollToSection(domain)}>
                {domain}
              </BE.NavItem>
            ))} */}
          </BE.NavList>
        </BE.Nav>
        
        <BE.DomainContainer>
          <p>이름: {selectedChild?.name}</p>
          <p>※ 문항을 선택할 때 마다 데이터는 저장됩니다.</p>
      
        </BE.DomainContainer>
      <BE.Btn onClick={handleRecord}>{isRecording ? '정지' : '녹화'}</BE.Btn>
      <BE.Btn onClick={handleUploadClick}>파일업로드</BE.Btn>
      <BE.InFlie
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <BE.Btn onClick={handleTest}>검사</BE.Btn>
      {/* 녹화 중 실시간 미리보기 */}
      <video
        ref={videoPreviewRef}
        width="400"
        autoPlay
        muted
        style={{ display: stream ? 'block' : 'none', marginBottom: '1rem' }}
      />
      {/* 녹화 완료 또는 업로드된 영상 미리보기 */}
      {previewUrl && (
        <video width="400" controls>
          <source src={previewUrl} type="video/mp4" />
          브라우저가 video 태그를 지원하지 않습니다.
        </video>
      )}
      {/* {result && <p>측정 결과: {result}</p>} */}
      </BE.SubContainer>
    </BE.Container>
  );
}
