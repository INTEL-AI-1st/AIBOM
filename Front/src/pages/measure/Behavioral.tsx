import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { beha } from '@services/measure/BehavioralService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  margin: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const FileInput = styled.input`
  display: none;
`;

export default function Behavioral() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // const [result, setResult] = useState<string>('');

  // 녹화 시작/정지 핸들러
  const handleRecord = async () => {
    if (!isRecording) {
      // 녹화 시작
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

  return (
    <Container>
      <Button onClick={handleRecord}>{isRecording ? '정지' : '녹화'}</Button>
      <Button onClick={handleUploadClick}>파일업로드</Button>
      <FileInput
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button onClick={handleTest}>검사</Button>
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
    </Container>
  );
}
