import React from 'react';
import { TbTrash } from "react-icons/tb";
import {
  Body, BodyHeader, Button, HeaderLeft, Title, HeaderRight, Sorting, SortOptions, SortButton, ChildContainer, ChildHeader, 
  InfoForm, InfoRow, InfoLabel, InfoInput, RadioGroup, RadioLabel, GenderRadio, GrayButton, ButtonForm
} from "@styles/ProfileStlyes";

export type ChildInfo = {
  name: string;
  birthday: string;
  gender: string;
};

type ChildProfilesProps = {
  childForm: ChildInfo[];
  isOwner: boolean;
  sortOption: "age" | "gender";
  showSortOptions: boolean;
  handleAddChild: () => void;
  handleDeleteChild: (index: number) => void;
  handleChildName: (index: number, name: string) => void;
  handleChildBirthday: (index: number, birthday: string) => void;
  handleGenderChange: (index: number, gender: string) => void;
  handleSortClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleSortOptionChange: (option: "age" | "gender") => void;
  sortRef: React.RefObject<HTMLDivElement | null>;
};

export default function ChildProfiles({
  childForm,
  isOwner,
  sortOption,
  showSortOptions,
  handleAddChild,
  handleDeleteChild,
  handleChildName,
  handleChildBirthday,
  handleGenderChange,
  handleSortClick,
  handleSortOptionChange,
  sortRef,
}: ChildProfilesProps) {
  const sortLabelMapping = {
    age: "나이",
    gender: "성별",
  };

  return (
    <Body>
      <BodyHeader>
        <HeaderLeft>
          <Title>내 아이</Title>
        </HeaderLeft>
        <HeaderRight>
          {isOwner && <Button onClick={handleAddChild}>아이 추가</Button>}
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

      {childForm.map((info, index) => (
        <ChildContainer key={index}>
          <ChildHeader>
            <span style={{ fontWeight: '500' }}>{info.name || `예시 ${index + 1}`}</span>
            <ButtonForm>
                <Button>저장</Button>
                <GrayButton onClick={() => handleDeleteChild(index)}>
                    <TbTrash />
                    삭제
                </GrayButton>
            </ButtonForm>
          </ChildHeader>

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
                    name={`gender-${index}`}
                    value="male"
                    checked={info.gender === 'male'}
                    onChange={(e) => handleGenderChange(index, e.target.value)}
                  />
                  남자
                </RadioLabel>
                <RadioLabel>
                  <GenderRadio
                    name={`gender-${index}`}
                    value="female"
                    checked={info.gender === 'female'}
                    onChange={(e) => handleGenderChange(index, e.target.value)}
                  />
                  여자
                </RadioLabel>
              </RadioGroup>
            </InfoRow>
          </InfoForm>
        </ChildContainer>
      ))}
    </Body>
  );
}
