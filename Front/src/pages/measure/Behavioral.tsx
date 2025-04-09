import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as BE from '@styles/measure/BehavioralStyles';
import { useMainContext } from '@context/MainContext';
import { RootState, AppDispatch } from '@redux/store';
import {
  setSelectedAbility,
  setPreviewUrl,
  setIsRecording,
  setRemainingTime,
  resetPreview
} from '@redux/actions/behavioral.actions';
import { fetchAbilities, sendBehavioralData } from '@redux/thunks/behavioral.thunks';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaAngleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { insertBeha } from '@services/measure/BehavioralService';

interface Ability {
  abilityLabelId: string;
  abilityLabel: string;
  info: string;
  groupId: string;
  groupNum: string;
  score: number;
  isMeas: boolean;
}

export default function Behavioral() {
  const { selectedChild } = useMainContext();
  const navigate = useNavigate();
  // 타입이 지정된 dispatch 사용 (thunk 액션도 지원)
  const dispatch = useDispatch<AppDispatch>();

  // Redux 상태
  const {
    abilities,
    selectedAbility,
    previewUrl,
    isLoading,
    isRecording,
  } = useSelector((state: RootState) => state.behavioral);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 로컬 상태: 타이머 카운트다운
  const [localTime, setLocalTime] = useState(15);

  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (selectedChild?.uid && selectedChild?.ageMonths && !isLoading && abilities.length === 0) {
      dispatch(fetchAbilities(selectedChild.uid, selectedChild.ageMonths));
    }
  }, [selectedChild?.uid, selectedChild?.ageMonths, dispatch, isLoading, abilities.length]);

  useEffect(() => {
    if (videoPreviewRef.current && stream) {
      videoPreviewRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      setLocalTime(15);
      dispatch(setRemainingTime(15));
      timer = setInterval(() => {
        setLocalTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
            dispatch(setIsRecording(false));
            clearInterval(timer);
            dispatch(setRemainingTime(0));
            return 0;
          }
          dispatch(setRemainingTime(newTime));
          return newTime;
        });
      }, 1000);
      recordingTimerRef.current = timer;
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRecording, mediaRecorder, dispatch]);

  const cleanupStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleRecord = useCallback(async () => {
    if (!isRecording) {
      try {
        // Permissions API를 통해 카메라와 마이크 권한 상태 확인
        if (navigator.permissions) {
          const cameraPerm = await navigator.permissions.query({ name: 'camera' });
          const micPerm = await navigator.permissions.query({ name: 'microphone' });
          if (cameraPerm.state === 'denied' || micPerm.state === 'denied') {
            alert("카메라 및 마이크 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.");
            return;
          }
        }
        
        // 권한이 prompt 상태라면 getUserMedia가 자동으로 권한 요청을 수행함
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
          dispatch(setPreviewUrl(url));
          cleanupStream();
        };
  
        recorder.start();
        dispatch(setIsRecording(true));
        
        // 15초 후 자동 종료
        setTimeout(() => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
            dispatch(setIsRecording(false));
          }
        }, 15000);
  
      } catch (err: unknown) {
        console.error('녹화 시작 실패:', err);
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            alert("카메라 및 마이크 권한이 필요합니다. 브라우저 설정에서 접근 권한을 확인해주세요.");
          } else {
            alert(`녹화를 시작하는 중 문제가 발생했습니다. ${err.message}`);
          }
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
      }
    } else {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      dispatch(setIsRecording(false));
    }
  }, [isRecording, mediaRecorder, cleanupStream, dispatch]);

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
      dispatch(setPreviewUrl(url));
    }
  }, [dispatch]);

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
  
    try {
      toast.info(
        <>
          파일 측정이 시작되었습니다.
          <br />
          잠시만 기다려주세요.
        </>
      );
      if(!selectedChild?.uid || !selectedAbility?.abilityLabelId) return;
      await insertBeha(selectedChild?.uid, selectedAbility?.abilityLabelId);
      await dispatch(sendBehavioralData(formData));
      // abilities 배열에서 현재 선택된 selectedAbility의 인덱스를 찾아 다음 아이템으로 업데이트
      const currentIndex = abilities.findIndex(
        (ability: Ability) => ability.abilityLabelId === selectedAbility.abilityLabelId
      );
      if (currentIndex !== -1 && currentIndex < abilities.length - 1) {
        dispatch(setSelectedAbility(abilities[currentIndex + 1]));
      }

      dispatch(resetPreview(true));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      chunksRef.current = [];
    } catch (error) {
      console.error('데이터 전송 오류:', error);
    }
  }, [previewUrl, selectedAbility, selectedChild, abilities, dispatch]);  

  const handleReRecord = useCallback(() => {
    dispatch(resetPreview(true));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    chunksRef.current = [];
  }, [dispatch]);

  const handleSelectAbility = useCallback((ability: Ability) => {
    dispatch(setSelectedAbility(ability));
  }, [dispatch]);

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
        <BE.Title>
          <BE.BackIconWrapper onClick={() => navigate(-1)}>
            <FaAngleLeft size={40} />
          </BE.BackIconWrapper>
          K-DST 기반 행동발달 분석
        </BE.Title>
        <BE.Nav>
          <BE.NavList>
            {abilities.map((ability: Ability) => (
              <BE.NavItem
                key={ability.abilityLabelId}
                onClick={() => handleSelectAbility(ability)}
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
          {selectedAbility?.score &&
            <p>저장된 데이터가 존재합니다. 재측정은 가능하지만 기존 데이터가 삭제됩니다.</p>
          }
          {selectedAbility?.isMeas ?
            <BE.BtnWrapper>
              <BE.Btn onClick={handleReRecord} disabled={isLoading}>
                측정 중입니다..
              </BE.Btn>
            </BE.BtnWrapper> 
            :
            <>
              {!previewUrl ? (
                <BE.BtnWrapper>
                  <BE.Btn onClick={handleRecord} disabled={isLoading}>
                    {isRecording ? `정지 (${localTime}초)` : '녹화'}
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
                  <BE.Btn onClick={handleSend}>
                    파일 전송
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
        </> 
       }
        </BE.ContentContainer>
        <BE.RecordIndicator>
          촬영 동작 : {selectedAbility?.info}
        </BE.RecordIndicator>
      </BE.SubContainer>
      
      <BE.ToastCon />
      </BE.Container>
  );
}
