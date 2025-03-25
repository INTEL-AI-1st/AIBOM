import { FaUser } from "react-icons/fa";
import { 
  Header, ProfileImg, ProfileWrapper, UserInfo, InfoContainer, SubInfo, BioWrapper, Button, GrayButton
} from "@styles/ProfileStlyes";

export default function UserProfile({
  info,
  isOwner,
  ProfileUrl,
  setShowMypage,
}: {
  info: { nickName?: string; bio?: string } | null; // null 허용
  isOwner: boolean;
  ProfileUrl?: string | null; // null 허용
  setShowMypage: (show: boolean) => void;
}) {
  return (
    <>
      <Header>
        <UserInfo>
          <ProfileWrapper>
            {ProfileUrl ? (
              <ProfileImg src={ProfileUrl} alt="프로필 이미지" />
            ) : (
              <FaUser size={40} color="#aaa" />
            )}
          </ProfileWrapper>
          <InfoContainer>
            <div>{info?.nickName || '이름 없음'}</div>
            <SubInfo>
              {/* 보호자 추가 버튼에 임시 onClick 핸들러 추가 (추후 실제 로직 구현 필요) */}
              <GrayButton onClick={() => console.log("보호자 추가 클릭")}>보호자 추가</GrayButton>
            </SubInfo>
          </InfoContainer>
        </UserInfo>
        {isOwner && (
          <Button onClick={() => setShowMypage(true)}>수정</Button>
        )}
      </Header>
      <BioWrapper>{info?.bio || '자기소개가 없습니다.'}</BioWrapper>
    </>
  );
}
