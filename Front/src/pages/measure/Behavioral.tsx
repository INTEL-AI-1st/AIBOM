import React, { useRef, useState, useEffect, useCallback } from 'react';
import { beha, selectAbilites } from '@services/measure/BehavioralService';
import * as BE from '@styles/measure/BehavioralStyles';
import { useMainContext } from '@context/MainContext';

// 반환 데이터에 맞춘 인터페이스 정의
interface Behavioral {
  abilityLabel: string;
  abilityLabelId: string;
  groupId: string;
  groupNum: string;
  info: string;
}

export default function Behavioral() {
  const { selectedChild } = useMainContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [abilities, setAbilities] = useState<Behavioral[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<Behavioral | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(15);

  const chunksRef = useRef<Blob[]>([]);

  const fetchData = useCallback(async () => {
    if (isLoading || !selectedChild?.ageMonths) return;
    
    setIsLoading(true);
    try {
      const data = await selectAbilites(selectedChild.ageMonths);
      if (data.info && Array.isArray(data.info)) {
        setAbilities(data.info);
        setSelectedAbility(data.info[0]);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [selectedChild?.ageMonths]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (videoPreviewRef.current && stream) {
      videoPreviewRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (isRecording) {
      setRemainingTime(15);
      
      recordingTimerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
            setIsRecording(false);
            
            if (recordingTimerRef.current) {
              clearInterval(recordingTimerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording, mediaRecorder]);

  const cleanupStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleRecord = useCallback(async () => {
    if (!isRecording) {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(userStream);
        chunksRef.current = [];

        const recorder = new MediaRecorder(userStream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          cleanupStream();
        };

        recorder.start();
        setIsRecording(true);
        
        setTimeout(() => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
            setIsRecording(false);
          }
        }, 15000);
        
      } catch (err) {
        console.error('녹화 시작 실패:', err);
        alert(`카메라 접근 권한이 없거나 문제가 발생했습니다. ${err}`);
      }
    } else {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      setIsRecording(false);
    }
  }, [isRecording, mediaRecorder, cleanupStream]);

  const handleUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!selectedAbility || !selectedChild) {
      alert('아이 정보 또는 측정 능력이 선택되지 않았습니다.');
      return;
    }
    
    const formData = new FormData();

    if (fileInputRef.current?.files?.[0]) {
      formData.append('video', fileInputRef.current.files[0]);
    } else if (previewUrl) {
      try {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        formData.append('video', blob, 'recorded.mp4');
      } catch (error) {
        console.error('비디오 블롭 생성 실패:', error);
        alert('비디오 데이터를 처리하는데 실패했습니다.');
        return;
      }
    } else {
      alert('영상 파일을 먼저 업로드 또는 녹화 해주세요.');
      return;
    }

    formData.append('uid', `${selectedChild.uid}`);
    formData.append('abilityLabelId', `${selectedAbility.abilityLabelId}`);
    formData.append('data_type', `${selectedAbility.groupId}\\${selectedAbility.groupNum}`);

    setIsLoading(true);
    try {
      const response = await beha(formData);
      console.log('분석 결과:', response);
      alert('측정이 완료되었습니다.');
    } catch (error) {
      console.error('측정 실패:', error);
      alert('측정(예측) 실행에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [previewUrl, selectedAbility, selectedChild]);

  const handleReRecord = useCallback(() => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    chunksRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      cleanupStream();
    };
  }, [previewUrl, cleanupStream]);

  return (
    <BE.Container>
      <BE.SubContainer>
        <BE.Title>K-DST 기반 행동발달 분석</BE.Title>
        <BE.Nav>
          <BE.NavList>
            {abilities.map((ability) => (
              <BE.NavItem
                key={ability.abilityLabelId}
                onClick={() => setSelectedAbility(ability)}
              >
                {ability.abilityLabel}
              </BE.NavItem>
            ))}
          </BE.NavList>
        </BE.Nav>
        <BE.DomainContainer>
          <p>이름: {selectedChild?.name}</p>
          <p>측정: {selectedAbility?.abilityLabel}</p>
        </BE.DomainContainer>
        <BE.ContentContainer>
          <BE.InfoBox>
            <p>📹 밝은 곳에서 아이의 전신이 잘 보이도록 촬영해주세요!</p>
            <p>ㆍ촬영은 녹화 버튼 클릭과 동시에 최대 15초간 촬영됩니다.</p>
            <p>ㆍ아이는 앞모습이 보이도록 찍어주세요.</p>
            <p>ㆍ단, 계단을 내려가는 장면은 옆모습이 보이도록 촬영해주세요.</p>
            <p>ㆍ가능하면 단순한 배경에서, 아이 혼자만 영상에 나오도록 해주세요.</p>
            <p>ㆍ모든 촬영은 한 동작씩 진행되고, 총 4개의 지시사항을 따르게 됩니다.</p>
          </BE.InfoBox>
          {!previewUrl ? (
            <BE.BtnWrapper>
              <BE.Btn onClick={handleRecord} disabled={isLoading}>
                {isRecording ? `정지 (${remainingTime}초)` : '녹화'}
              </BE.Btn>
              <BE.Btn onClick={handleUploadClick} disabled={isLoading || isRecording}>
                파일업로드
              </BE.Btn>
              <BE.InFlie
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </BE.BtnWrapper>
          ) : (
            <BE.BtnWrapper>
              <BE.Btn onClick={handleReRecord} disabled={isLoading}>
                재녹화
              </BE.Btn>
              <BE.Btn onClick={handleSend} disabled={isLoading}>
                {isLoading ? '처리 중...' : '파일 전송'}
              </BE.Btn>
            </BE.BtnWrapper>
          )}

          {!previewUrl && stream && (
            <BE.VideoContainer>
              <video
                ref={videoPreviewRef}
                width="400"
                autoPlay
                muted
                playsInline
              />
            </BE.VideoContainer>
          )}

          {previewUrl && (
            <BE.VideoContainer>
              <video width="400" controls>
                <source src={previewUrl} type="video/mp4" />
                브라우저가 video 태그를 지원하지 않습니다.
              </video>
            </BE.VideoContainer>
          )}
        </BE.ContentContainer>
        <BE.RecordIndicator>
          촬영 동작 : {selectedAbility?.info}
        </BE.RecordIndicator>
      </BE.SubContainer>
    </BE.Container>
  );
}