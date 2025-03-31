import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { surveyData } from '@constants/surveyData';
import { 
  Btn,
  BtnForm,
  CloseButton, Container, DomainSection, DomainTitle, Header, InfoIcon, Nav, NavItem, NavList, 
  ObservationCategory, ObservationHeader, ObservationList, ObservationListItem, OptionLabel, OptionList, 
  Overlay, Question, QuestionTitle, QuestionTitleContainer, RadioInput, ScrollToTop, SidebarContainer, Title, 
  ToastCon
} from '@styles/ObservationStyles';
import { useMainContext } from '@context/MainContext';

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

const AUTO_SAVE_TOAST_ID = 'auto-save-toast';

export default function Observation() {
  const { selectedChild } = useMainContext();
  const [activeObservation, setActiveObservation] = useState<{ id: string; observation: Observation } | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const groupedData = useMemo(() => {
    return surveyData.reduce((acc: Record<string, SurveyItem[]>, item: SurveyItem) => {
      if (!acc[item.domain]) {
        acc[item.domain] = [];
      }
      acc[item.domain].push(item);
      return acc;
    }, {});
  }, []);

  const domainList = useMemo(() => Object.keys(groupedData), [groupedData]);

  // 설문 답변 상태 (각 문항은 item.id로 관리)
  const [answers, setAnswers] = useState<{ [key: string]: number | null }>(() => {
    const initial: { [key: string]: number | null } = {};
    surveyData.forEach((item: SurveyItem) => {
      initial[item.id] = null;
    });
    return initial;
  });

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
  
    const isAtBottom = windowHeight + offset >= documentHeight - 10;
  
    setShowScrollToTop(offset > 200 && !isAtBottom);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleAnswerChange = useCallback((itemId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  const scrollToSection = useCallback((domain: string) => {
    const element = document.getElementById(domain);
    if (element) {
      const yOffset = -50;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  // 특정 문항으로 스크롤 (문항에 id={`question-${item.id}`} 를 부여)
  const scrollToQuestion = useCallback((questionId: string) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      const yOffset = -50;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeSidebar = useCallback(() => {
    setActiveObservation(null);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!toast.isActive(AUTO_SAVE_TOAST_ID)) {
        toast.info('자동저장되었습니다.', {
          toastId: AUTO_SAVE_TOAST_ID,
          position: 'top-right',
          autoClose: 1000,
        });
      }
    }, 60000);
  
    return () => clearInterval(interval);
  }, []);

  const handleSave = useCallback(() => {
    const unanswered = surveyData.filter(item => answers[item.id] === null);
    if (unanswered.length > 0) {
      toast.info('체크하지 않은 문항이 존재합니다.', {
        position: 'top-right',
        autoClose: 1000,
      });
      scrollToQuestion(unanswered[0].id);
    } else {
      alert('저장되었습니다.');
    }
  }, [answers, scrollToQuestion]);

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
        <p>이름: {selectedChild?.name}</p>
        <p>※ 저장되어 있는 문항은 다음 달이 되면 초기화 됩니다.</p>

        {domainList.map((domain) => (
          <DomainSection key={domain} id={domain}>
            <DomainTitle>{domain}</DomainTitle>
            {groupedData[domain].map((item: SurveyItem) => (
              <Question key={item.id} id={`question-${item.id}`}>
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

        {showScrollToTop && <ScrollToTop onClick={scrollToTop} />}

        {/* 슬라이드바(관측사례) */}
        <Overlay open={activeObservation !== null} onClick={closeSidebar} />
        <SidebarContainer open={activeObservation !== null}>
          {activeObservation && (
            <>
              <Header>
                <ObservationHeader>관측사례</ObservationHeader>
                <CloseButton onClick={closeSidebar}>×</CloseButton>
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
                        <ObservationListItem key={idx}>
                          {text.replace(/\n/g, ' ')}
                        </ObservationListItem>
                      ))}
                    </ObservationList>
                  </div>
                )
              )}
            </>
          )}
        </SidebarContainer>

        <BtnForm>
          <Btn onClick={handleSave}>저장</Btn>
          <Btn onClick={handleSave}>측정하기</Btn>
        </BtnForm>

        <ToastCon />
      </Container>
    </Container>
  );
}
