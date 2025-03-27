import React, { useState } from 'react';
import styled from 'styled-components';

// 네비게이션 스타일
const Nav = styled.nav`
  background: #f5f5f5;
  padding: 10px 0;
  margin-bottom: 20px;
`;

const NavList = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: #0077cc;
  }
`;

// 컨테이너 및 섹션 스타일
const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 10px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
`;

const Question = styled.div`
  margin: 20px 0;
`;

const QuestionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const OptionList = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 600px;
`;

const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const RadioInput = styled.input`
  margin-bottom: 5px;
`;

// 도메인별 설문 문항 데이터 (PDF 내용 참고 예시)
const surveyData = [
  {
    id: 'physical',
    domain: '신체운동·건강',
    question: '신체 각 부분의 이름을 안다.',
    options: [
      '1. 신체 각 부분의 이름을 알지 못한다.',
      '2. 도움을 받아 신체 각 부분의 이름을 안다.',
      '3. 신체 각 부분의 이름을 일부 알 수 있다.',
      '4. 세부적인 신체 각 부분의 모든 이름을 안다.',
    ],
  },
  {
    id: 'communication',
    domain: '의사소통',
    question: '말이나 이야기를 관심 있게 듣는다.',
    options: [
      '1. 교사나 또래의 말이나 이야기를 주의 깊게 듣지 않는다.',
      '2. 교사의 제안이나 시범이 있으면 타인의 말이나 이야기에 관심을 갖는다.',
      '3. 교사나 또래의 말을 관심 있게 듣지만 중간에 생각이 떠오르면 곧바로 말한다.',
      '4. 타인의 말을 끝까지 관심 있게 들으며 적절히 표현한다.',
    ],
  },
  {
    id: 'social',
    domain: '사회관계',
    question: '가족을 소중히 여기는 마음을 나타낸다.',
    options: [
      '1. 가족의 일상과 아끼는 마음이 나타나지 않는다.',
      '2. 도움이 있으면 가족의 일상과 아끼는 마음을 나타낸다.',
      '3. 가족의 일상과 아끼는 마음이 어느 정도 나타난다.',
      '4. 스스로 가족의 일상과 아끼는 마음을 나타낸다.',
    ],
  },
  {
    id: 'art',
    domain: '예술경험',
    question: '노래를 즐겨 부른다.',
    options: [
      '1. 노래 부르기에 관심을 가지지 않는다.',
      '2. 교사와 또래가 함께 노래할 때 흥얼거리며 따라 부른다.',
      '3. 친숙한 노래는 부분적으로 부른다.',
      '4. 일상생활에서 노래를 즐겨 부른다.',
    ],
  },
  {
    id: 'nature',
    domain: '자연탐구',
    question: '주변 세계와 자연에 대해 지속적으로 호기심을 가진다.',
    options: [
      '1. 주변 세계와 자연에 대해 관심을 가지지 않는다.',
      '2. 도움이 있으면 주변 세계와 자연에 대해 궁금해 한다.',
      '3. 관심은 있으나 지속되지는 않는다.',
      '4. 주변 세계와 자연에 대한 호기심을 지속적으로 표현한다.',
    ],
  },
];

const Observation: React.FC = () => {
  // 각 문항의 선택값을 상태로 관리 (각 도메인별로)
  const [answers, setAnswers] = useState<{ [key: string]: number | null }>(() => {
    const initial: { [key: string]: number | null } = {};
    surveyData.forEach(item => {
      initial[item.id] = null;
    });
    return initial;
  });

  const handleAnswerChange = (domainId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [domainId]: value }));
  };

  // 네비게이션 클릭 시 해당 섹션으로 스크롤
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container>
      <Title>KICCE 유아관찰척도 설문</Title>
      <Nav>
        <NavList>
          {surveyData.map(item => (
            <NavItem key={item.id} onClick={() => scrollToSection(item.id)}>
              {item.domain}
            </NavItem>
          ))}
        </NavList>
      </Nav>

      {surveyData.map(item => (
        <Section key={item.id} id={item.id}>
          <SectionTitle>{item.domain}</SectionTitle>
          <Question>
            <QuestionTitle>{item.question}</QuestionTitle>
            <OptionList>
              {item.options.map((option, index) => (
                <OptionLabel key={index}>
                  <RadioInput
                    type="radio"
                    name={item.id}
                    value={index + 1}
                    checked={answers[item.id] === index + 1}
                    onChange={() => handleAnswerChange(item.id, index + 1)}
                  />
                  <span>{option}</span>
                </OptionLabel>
              ))}
            </OptionList>
          </Question>
        </Section>
      ))}
    </Container>
  );
};

export default Observation;
