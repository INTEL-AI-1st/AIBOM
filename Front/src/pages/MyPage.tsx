import MyPage1 from "./MyPage1";
import Modal from "@components/common/Modal";
import UserProfile from "@components/myPage/UserProfile";
import ChildProfiles from "@components/myPage/ChildProfiles";
import { useUserInfo } from "@hooks/UseProfile";
import { ModalProvider } from "@context/ModalContext";

export default function MyPage() {
  const {
    info,
    isOwner,
    ProfileUrl, 
    sortOption,
    showSortOptions,
    sortRef,
    handleSortClick,
    handleSortOptionChange,
    handleAddChild,
    handleDeleteChild,
    handleChildName,
    handleChildBirthday,
    handleGenderChange,
    showMypage,
    setShowMypage,
    childForm, 
  } = useUserInfo();

  return (
    <>
      <UserProfile 
        info={info} 
        isOwner={isOwner} 
        ProfileUrl={ProfileUrl} 
        setShowMypage={setShowMypage} 
      />
      
      <ChildProfiles 
        childForm={childForm}
        isOwner={isOwner}
        sortOption={sortOption as "age" | "gender"}
        showSortOptions={showSortOptions}
        handleAddChild={handleAddChild}
        handleDeleteChild={handleDeleteChild}
        handleChildName={handleChildName}
        handleChildBirthday={handleChildBirthday}
        handleGenderChange={handleGenderChange}
        handleSortClick={handleSortClick}
        handleSortOptionChange={handleSortOptionChange}
        sortRef={sortRef}
      />
      
      <ModalProvider onClose={() => setShowMypage(false)}>
        <Modal isOpen={showMypage} title="마이페이지">
          <MyPage1 />
        </Modal>
      </ModalProvider>
    </>
  );
}
