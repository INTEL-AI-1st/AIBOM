import { TbTrash } from "react-icons/tb";
import { FaBaby } from "react-icons/fa";
import { 
  Body, BodyHeader, Button, HeaderLeft, Title, HeaderRight, Sorting, 
  SortOptions, SortButton, ChildContainer, ChildHeader, InfoForm, InfoRow, 
  InfoLabel, InfoInput, RadioGroup, RadioLabel, GenderRadio, GrayButton, 
  ButtonForm, SubInfo, ChildBody, ProfileWrapper, ProfileImg, 
  AvatarContainer
} from "@styles/ProfileStlyes";
import { AvatarInput, AvatarUpload, AvatarWrapper, ButtonWrapper, ImgButton } from "@styles/MyPageStyles";
import { useChildInfo } from "@hooks/myPage/useChildInfo";
import { useUserInfo } from "@hooks/myPage/useUserInfo";

export default function ChildProfiles() {
  const {
    newChild, childForm, sortOption, showSortOptions, sortRef,
    handleSortClick, handleSortOptionChange,
    handleAddChild, handleSaveChild, handleDeleteChild,
    handleChildName, handleChildBirthday, handleGenderChange,
    handleAvatarChange, handleDeleteImg,
  } = useChildInfo();

  const { isOwner } = useUserInfo();
  const sortLabelMapping = {
    age: "나이",
    gender: "성별",
  };

  return (
    <Body>
      <BodyHeader>
        <HeaderLeft>
          <Title>내 아이</Title>
          <SubInfo>아이는 한명씩 저장 가능합니다.</SubInfo>
        </HeaderLeft>
        <HeaderRight>
          {isOwner && (
            <Button 
              onClick={handleAddChild} 
              disabled={newChild.some(child => child.state === "C")}
            >
              아이 추가
            </Button>
          )}
          <Sorting onClick={handleSortClick} showSortOptions={showSortOptions}>
            정렬 : {sortLabelMapping[sortOption]}
          </Sorting>
        </HeaderRight>
      </BodyHeader>

      {showSortOptions && (
        <SortOptions ref={sortRef}>
          <SortButton onClick={() => handleSortOptionChange("age")}>나이</SortButton>
          <SortButton onClick={() => handleSortOptionChange("gender")}>성별</SortButton>
        </SortOptions>
      )}

      {newChild?.map((info, index) => (
        <ChildContainer key={`new-child-${index}`}>
            <ChildHeader>
                <span style={{ fontWeight: '500' }}>아이 정보</span>
                <ButtonForm>
                <Button onClick={() => handleSaveChild(index)}>저장</Button>
                <GrayButton onClick={() => handleDeleteChild(index)}>
                    <TbTrash />
                    삭제
                </GrayButton>
                </ButtonForm>
            </ChildHeader>

            <ChildBody>
                <AvatarContainer>
                    <AvatarWrapper>
                        <AvatarUpload htmlFor="avatar" title="이미지 올리기">
                        <ProfileWrapper style={{margin: 0}}>
                            {info.profileUrl ? <ProfileImg src={info.profileUrl} /> : <FaBaby />}
                        </ProfileWrapper>
                        </AvatarUpload>
                        <AvatarInput onChange={(e) => handleAvatarChange(true, index, e)} id="avatar" type="file" accept="image/*" />
                    </AvatarWrapper>
                    {info.profileUrl && 
                        <ButtonWrapper>
                            <ImgButton onClick={() => handleDeleteImg(true, index)}>삭제</ImgButton>
                        </ButtonWrapper>
                    }
                </AvatarContainer>
                <InfoForm>
                <InfoRow>
                    <InfoLabel>이름</InfoLabel>
                    <InfoInput
                    type="text"
                    value={info.name}
                    onChange={(e) => handleChildName(index, e.target.value)}
                    maxLength={10}
                    required
                    />
                </InfoRow>
                <InfoRow>
                    <InfoLabel>생년월일</InfoLabel>
                    <InfoInput
                    type="text"
                    value={info.birthday}
                    onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                        handleChildBirthday(index, onlyNums);
                    }}
                    placeholder="생년월일 8자리"
                    maxLength={8}
                    required
                    />
                </InfoRow>
                <InfoRow>
                    <InfoLabel>성별</InfoLabel>
                    <RadioGroup>
                        <RadioLabel>
                            <GenderRadio
                            name={`gender-new-${index}`}
                            value="1"
                            checked={info.gender === '1'}
                            onChange={(e) => handleGenderChange(index, e.target.value)}
                            />
                            남자
                        </RadioLabel>
                        <RadioLabel>
                            <GenderRadio
                            name={`gender-new-${index}`}
                            value="2"
                            checked={info.gender === '2'}
                            onChange={(e) => handleGenderChange(index, e.target.value)}
                            />
                            여자
                        </RadioLabel>
                    </RadioGroup>
                </InfoRow>
                </InfoForm>
            </ChildBody>
        </ChildContainer>
      ))}

      {/* 기존 자녀 프로필 */}
      {childForm?.map((info, index) => (
        <ChildContainer key={`child-${index}`}>
          <ChildHeader>
            <span style={{ fontWeight: '500' }}>이름: {info.name}</span>
            <ButtonForm>
              <GrayButton onClick={() => handleDeleteChild(index)}>
                <TbTrash />
                삭제
              </GrayButton>
            </ButtonForm>
          </ChildHeader>
          <div>
            나이: {info.ageYears}세 ({info.ageMonths}개월)
          </div>
          <ChildBody>
            <AvatarWrapper>
              <AvatarUpload htmlFor={`avatar-child-${index}`} title="이미지 올리기">
                <ProfileWrapper style={{ margin: 0 }}>
                  {info.profileUrl ? (
                    <ProfileImg src={info.profileUrl} />
                  ) : (
                    <FaBaby />
                  )}
                </ProfileWrapper>
              </AvatarUpload>
              <AvatarInput
                onChange={(e) => handleAvatarChange(false, index, e)}
                id={`avatar-child-${index}`}
                type="file"
                accept="image/*"
              />
            </AvatarWrapper>
            {info.profileUrl && (
              <ButtonWrapper>
                <ImgButton onClick={() => handleDeleteImg(false, index)}>
                  삭제
                </ImgButton>
              </ButtonWrapper>
            )}
          </ChildBody>
        </ChildContainer>
      ))}
    </Body>
  );
}
