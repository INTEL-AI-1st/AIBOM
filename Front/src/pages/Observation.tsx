import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { surveyData } from '@constants/surveyData'; // 데이터 파일 위치에 맞게 수정
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowCircleUp } from 'react-icons/fa';

// Observation 타입 선언
interface Observation {
  play?: string[];
  life?: string[];
  activity?: string[];
}

// SurveyItem 타입 선언
interface SurveyItem {
  id: string;
  domain: string;
  question: string;
  options: string[];
  observation: Observation;
}

// 네비게이션 스타일 (스크롤 시 고정을 위한 fixed prop 추가)
const Nav = styled.nav`
  width: 100%;
  /* height: auto; */
  background: #f5f5f5;
  padding: 12px 0;
  margin-bottom: 30px;
  position: sticky;
  top: 0;
  z-index: 1000;
`;


// 네비게이션 리스트 스타일
const NavList = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  cursor: pointer;
  font-weight: bold;
  margin: 0 15px;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: #0077cc;
  }
`;

// 기본 컨테이너 및 섹션 스타일
const Container = styled.div`
  padding: 10px;
  width: 100%;
  max-height: 100%;
  margin: 0 auto;
  /* margin-top: 70px; */
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  letter-spacing: 0.5px;
`;

const DomainSection = styled.section`
  margin-bottom: 50px;
`;

const DomainTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
`;

const Question = styled.div`
  margin: 25px 0;
  padding: 15px;
  background: #fafafa;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const QuestionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const QuestionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  line-height: 1.4;
`;

const InfoIcon = styled(AiOutlineInfoCircle)`
  margin-left: 10px;
  cursor: pointer;
  color: #0077cc;
  transition: color 0.2s;
  &:hover {
    color: #005fa3;
  }
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const RadioInput = styled.input`
  margin-right: 10px;
`;

// 슬라이드바(관측사례) 관련 스타일
const SidebarContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  max-width: 600px;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  padding: 30px;
  overflow-y: auto;
`;

const Overlay = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

/** 
 * 관측사례 제목, 카테고리, 내용 스타일 
 * 가독성을 높이기 위해 line-height, margin, white-space 등을 조정 
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const ObservationHeader = styled.h2`
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  display: block;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #0077cc;
  cursor: pointer;
  &:hover {
    color: #005fa3;
  }
`;

const ObservationCategory = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

const ObservationList = styled.ul`
  margin: 0 0 20px 20px;
  padding: 0;
  line-height: 1.75;
  list-style-type: decimal;
`;

const ObservationListItem = styled.li`
  margin-bottom: 5px;       
  white-space: pre-line;     
  word-break: keep-all;    
`;

// 하단 가운데 최상단 올리는 버튼 스타일
const ScrollToTop = styled(FaArrowCircleUp)`
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  color: #ffb9b9;
  font-size: 2em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1002;
  transition: background 0.2s;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

export default function Observation() {
  // surveyData를 도메인별로 그룹화 (Record<도메인명, SurveyItem[]>)
  const groupedData = surveyData.reduce((acc: Record<string, SurveyItem[]>, item: SurveyItem) => {
    if (!acc[item.domain]) {
      acc[item.domain] = [];
    }
    acc[item.domain].push(item);
    return acc;
  }, {});

  // 네비게이션에 표시할 도메인 목록
  const domainList = Object.keys(groupedData);

  // 설문 답변 상태 (각 문항은 item.id로 관리)
  const [answers, setAnswers] = useState<{ [key: string]: number | null }>(() => {
    const initial: { [key: string]: number | null } = {};
    surveyData.forEach((item: SurveyItem) => {
      initial[item.id] = null;
    });
    return initial;
  });

  // 활성화된 관측사례(슬라이드바) 상태
  const [activeObservation, setActiveObservation] = useState<{ id: string; observation: Observation } | null>(null);

  // 스크롤에 따른 네비게이션 고정 및 스크롤 탑 버튼 상태
  // const [navFixed, setNavFixed] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 200) {
        // setNavFixed(true);
        setShowScrollToTop(true);
      } else {
        // setNavFixed(false);
        setShowScrollToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnswerChange = (itemId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  };

  // 네비게이션 클릭 시 해당 도메인 섹션으로 스크롤
  const scrollToSection = (domain: string) => {
    const element = document.getElementById(domain);
    if (element) {
      const yOffset = -50; // 원하는 오프셋
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // 최상단 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 슬라이드바 닫기
  const closeSidebar = () => {
    setActiveObservation(null);
  };

  // 1분마다 toastify를 이용해 자동저장 메시지 표시 (우측 상단)
  useEffect(() => {
    const interval = setInterval(() => {
      toast.info('자동저장되었습니다.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Container>
        <Title>KICCE 유아관찰척도 설문</Title>
        <Nav>
          <NavList>
            {domainList.map((domain) => (
              <NavItem key={domain} onClick={() => scrollToSection(domain)}>
                {domain}
              </NavItem>
            ))}
          </NavList>
        </Nav>

        {domainList.map((domain) => (
          <DomainSection key={domain} id={domain}>
            <DomainTitle>{domain}</DomainTitle>
            {groupedData[domain].map((item: SurveyItem) => (
              <Question key={item.id}>
                <QuestionTitleContainer>
                  <QuestionTitle>{item.question}</QuestionTitle>
                  <InfoIcon
                    size={20}
                    onClick={() => setActiveObservation({ id: item.id, observation: item.observation })}
                    title="관측사례 보기"
                  />
                </QuestionTitleContainer>
                <OptionList>
                  {item.options.map((option: string, index: number) => (
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
            ))}
          </DomainSection>
        ))}
      </Container>
      
      {/* 최상단 올리기 버튼 (스크롤이 일정 이상 내려왔을 때만 표시) */}
      {showScrollToTop && <ScrollToTop onClick={scrollToTop} />}
      
      {/* 슬라이드바(관측사례) */}
      <Overlay open={activeObservation !== null} onClick={closeSidebar} />
      <SidebarContainer open={activeObservation !== null}>
        {activeObservation && (
          <>
            <Header>
              <ObservationHeader>관측사례</ObservationHeader>
              <CloseButton onClick={closeSidebar}>닫기 ×</CloseButton>
            </Header>
            {(Object.entries(activeObservation.observation) as [keyof Observation, string[]][]).map(
              ([category, observations]) => (
                <div key={category}>
                  <ObservationCategory>
                    {category === 'play'
                      ? '놀이'
                      : category === 'life'
                      ? '일상생활'
                      : '활동'}
                  </ObservationCategory>
                  <ObservationList>
                    {observations.map((text: string, idx: number) => (
                      <ObservationListItem key={idx}>{text.replace(/\n/g, ' ')}</ObservationListItem>
                    ))}
                  </ObservationList>
                </div>
              )
            )}
          </>
        )}
      </SidebarContainer>

      {/* toastify 컨테이너 */}
      <ToastContainer />
    </Container>
  );
}
