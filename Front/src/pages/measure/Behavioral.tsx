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

  // 로컬 상태
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [localTime, setLocalTime] = useState(15);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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

  // 타이머 업데이트 (비동기 dispatch 호출로 렌더와 분리)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      setLocalTime(15);
      // 시작 시 남은 시간 업데이트
      setTimeout(() => dispatch(setRemainingTime(15)), 0);
      timer = setInterval(() => {
        setLocalTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              setTimeout(() => mediaRecorder.stop(), 0);
            }
            setTimeout(() => dispatch(setIsRecording(false)), 0);
            clearInterval(timer);
            setTimeout(() => dispatch(setRemainingTime(0)), 0);
            return 0;
          } else {
            setTimeout(() => dispatch(setRemainingTime(newTime)), 0);
            return newTime;
          }
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
        // 카메라와 마이크 권한 확인
        if (navigator.permissions) {
          const cameraPerm = await navigator.permissions.query({ name: 'camera' });
          const micPerm = await navigator.permissions.query({ name: 'microphone' });
          if (cameraPerm.state === 'denied' || micPerm.state === 'denied') {
            alert("카메라 및 마이크 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.");
            return;
          }
        }
        
        // 후면 카메라 우선 설정
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: true,
        });
        
        setStream(userStream);
        chunksRef.current = [];
        setRecordedBlob(null);
        setUploadedFile(null);

        const recorder = new MediaRecorder(userStream);
        setMediaRecorder(recorder);
  
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };
  
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
          setRecordedBlob(blob);
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
      // 업로드한 파일을 상태에 저장
      setUploadedFile(file);
      // 녹화 결과와는 별개로 저장
      setRecordedBlob(null);
    }
  }, [dispatch]);

  const handleSend = useCallback(async () => {
    if (!selectedAbility || !selectedChild) {
      alert('아이 정보 또는 측정 능력이 선택되지 않았습니다.');
      return;
    }
  
    const formData = new FormData();
    // 업로드 파일이 있다면 우선 사용, 없으면 녹화 결과 사용
    if (uploadedFile) {
      formData.append('video', uploadedFile);
    } else if (recordedBlob) {
      formData.append('video', recordedBlob, 'recorded.mp4');
    } else {
      alert('영상 파일을 먼저 업로드 또는 녹화 해주세요.');
      return;
    }
  
    formData.append('uid', `${selectedChild.uid}`);
    formData.append('abilityLabelId', `${selectedAbility.abilityLabelId}`);
    formData.append('data_type', `${selectedAbility.groupId}${selectedAbility.groupNum}`);
  
    try {
      toast.info(
        <>
          파일 측정이 시작되었습니다.
          <br />
          잠시만 기다려주세요.
        </>
      );
      if (!selectedChild?.uid || !selectedAbility?.abilityLabelId) return;
      await insertBeha(selectedChild.uid, selectedAbility.abilityLabelId);
      await dispatch(sendBehavioralData(formData));

      dispatch(setSelectedAbility(selectedAbility));
  
      dispatch(resetPreview(true));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      chunksRef.current = [];
      setRecordedBlob(null);
      setUploadedFile(null);
    } catch (error) {
      console.error('데이터 전송 오류:', error);
    }
  }, [uploadedFile, recordedBlob, selectedAbility, selectedChild, dispatch]);

  const handleReRecord = useCallback(() => {
    dispatch(resetPreview(true));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    chunksRef.current = [];
    setRecordedBlob(null);
    setUploadedFile(null);
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
          {selectedAbility?.isMeas ? (
            <BE.BtnWrapper>
              <BE.Btn onClick={handleReRecord} disabled={isLoading}>
                측정 중입니다..
              </BE.Btn>
            </BE.BtnWrapper>
          ) : (
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
          )}
        </BE.ContentContainer>
        <BE.RecordIndicator>
          촬영 동작 : {selectedAbility?.info}
        </BE.RecordIndicator>
      </BE.SubContainer>
      
      <BE.ToastCon />
    </BE.Container>
  );
}
