import { ApiContainer, ButtonDiv, AvatarWrapper, AvatarUpload, AvatarInput,
          InfoInput, InfoTextArea, InfoItem, InfoButton, ImgButton,
          ButtonWrapper, } 
  from "@styles/MyPageStyles";
import { useMyInfo } from "@hooks/UseMyPage";
import PasswordInput, { PasswordForm } from "../common/Password";
import { FaUser } from "react-icons/fa";
import { ProfileImg, ProfileWrapper } from "@styles/ProfileStlyes";
import { getPublicProfileUrl } from "@services/supabaseClient";

export default function MyInfo() {
  const { info, setInfo,
          isCfPw, isValPw, showPwInput,
          password, setPassword, showPassword, setShowPassword,
          rePassword, setRePassword, showRePassword, setShowRePassword,
          handleAvatarChange, handlePasswordChange, handleSave, handleDeleteImg
        } = useMyInfo() ?? {};

  if (!info) {
    return <ApiContainer>정보를 불러올 수 없습니다.</ApiContainer>;
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const ProfileUrl = getPublicProfileUrl(info.profile);
  
  return (
    <ApiContainer>
      <AvatarWrapper>
        <AvatarUpload htmlFor="avatar" title="이미지 올리기">
          <ProfileWrapper style={{margin: 0}}>
            {ProfileUrl ? <ProfileImg src={ProfileUrl} /> : <FaUser />}
          </ProfileWrapper>
        </AvatarUpload>
        <AvatarInput onChange={handleAvatarChange} id="avatar" type="file" accept="image/*" />
      </AvatarWrapper>
      {ProfileUrl && 
      <ButtonWrapper>
        <ImgButton onClick={handleDeleteImg}>삭제</ImgButton>
      </ButtonWrapper>
      }
      <div><strong>닉네임</strong></div> 
      <InfoItem onKeyDown={handleKeyDown}>
        <InfoInput 
          type="text" 
          value={info.nickName}
          onChange={(e) =>
            setInfo((prev) => (prev ? { ...prev, nickName: e.target.value } : prev))
          }
          required
          maxLength={10}
        />
      </InfoItem>
      <div><strong>자기소개</strong></div> 
      <InfoItem>
        <InfoTextArea 
          value={info.bio}
          onChange={(e) =>
            setInfo((prev) => (prev ? { ...prev, bio: e.target.value } : prev))
          }
          required
          maxLength={100}
        />
      </InfoItem>
      {showPwInput ? (
        <>
          <div><strong>비밀번호 변경</strong></div> 
          <InfoItem onKeyDown={handleKeyDown}>
            <PasswordInput 
              password={password ?? ""} 
              setPassword={setPassword ?? (() => {})} 
              showPassword={showPassword ?? false} 
              setShowPassword={setShowPassword ?? (() => {})} 
              placeholder="비밀번호"
            />
          </InfoItem>
          <InfoItem onKeyDown={handleKeyDown}>
            <PasswordInput 
              password={rePassword ?? ""} 
              setPassword={setRePassword ?? (() => {})} 
              showPassword={showRePassword ?? false} 
              setShowPassword={setShowRePassword ?? (() => {})} 
              placeholder="비밀번호 확인"
            />
          </InfoItem>
          <PasswordForm
            password={password}
            isValPw={isValPw}
            isCfPw={isCfPw}
          />
        </>
      ) : null}
      <ButtonDiv>
        {info.agent === 'local' &&
          <InfoButton onClick={handlePasswordChange}>
            {showPwInput ? '취소' : '비밀번호 변경'}
          </InfoButton>
        }
        <InfoButton onClick={handleSave}>저장</InfoButton>
      </ButtonDiv>
    </ApiContainer>
  );
}
