import { FaUser } from "react-icons/fa";
import { Header, ProfileImg, ProfileWrapper, UserInfo, InfoContainer, SubInfo, BioWrapper, Button, GrayButton} from "@styles/main/ProfileStlyes";
import { useUserInfo } from "@hooks/myPage/useUserInfo";
import Modal from "@components/common/Modal";
import { ModalProvider } from "@context/ModalContext";
import MyPage1 from "@pages/MyPage1";

export default function UserProfile() {
  const { info, isOwner, ProfileUrl, showMypage, setShowMypage } = useUserInfo();

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
              <GrayButton onClick={() => console.log("보호자 추가 클릭")}>
                보호자 추가
              </GrayButton>
            </SubInfo>
          </InfoContainer>
        </UserInfo>
        {isOwner && (
          <Button onClick={() => setShowMypage(true)}>수정</Button>
        )}
      </Header>
      <BioWrapper>{info?.bio || '자기소개가 없습니다.'}</BioWrapper>
      
      <ModalProvider onClose={() => setShowMypage(false)}>
        <Modal isOpen={showMypage} title="마이페이지">
          <MyPage1 />
        </Modal>
      </ModalProvider>
    </>
  );
}
