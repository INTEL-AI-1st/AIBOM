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
} from '@styles/measure/ObservationStyles';
import { useMainContext } from '@context/MainContext';
import { saveObservation, selectObservation, upsertObservation } from '@services/measure/ObservationService';
import { usePopup } from '@hooks/UsePopup';

interface Observation {
  play?: string[];
  life?: string[];
  activity?: string[];
}

interface SurveyItem {
  questId: string;
  domain: string;
  abilityLabelId: string;
  question: string;
  options: string[];
  observation: Observation;
}

export default function Observation() {
  const { selectedChild } = useMainContext();
  const { showConfirm, showAlert } = usePopup();
  const [activeObservation, setActiveObservation] = useState<{ id: string; observation: Observation } | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const fetchObservation = async () => {
      if (!selectedChild?.uid) return;
      try {
        const savedData = await selectObservation(selectedChild.uid);
        if (savedData && savedData.info && Array.isArray(savedData.info)) {
          const newAnswers = savedData.info.reduce((acc, observation) => {
            acc[observation.questId] = observation.score;
            return acc;
          }, {});
          setAnswers(prev => ({ ...prev, ...newAnswers }));
        }
      } catch (error) {
        console.error('Error fetching observation:', error);
      }
    };
  
    fetchObservation();
  }, [selectedChild?.uid]);
  

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

  const [answers, setAnswers] = useState<{ [key: string]: number | null }>(() => {
    const initial: { [key: string]: number | null } = {};
    surveyData.forEach((item: SurveyItem) => {
      initial[item.questId] = null;
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

  const handleAnswerChange = useCallback(
    async (abilityLabelId: string, itemId: string, value: number) => {
      setAnswers((prev) => ({ ...prev, [itemId]: value }));
      if (!selectedChild?.uid) return;
  
      await upsertObservation(selectedChild.uid, abilityLabelId, itemId, value);
    },
    [selectedChild?.uid]
  );

  const scrollToSection = useCallback((domain: string) => {
    const element = document.getElementById(domain);
    if (element) {
      const yOffset = -50;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

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

  const handleSave = useCallback(async () => {
    const unanswered = surveyData.filter(item => answers[item.questId] === null);
    if (unanswered.length > 0) {
      toast.info('체크하지 않은 문항이 존재합니다.', {
        position: 'top-right',
        autoClose: 1000,
      });
      scrollToQuestion(unanswered[0].questId);
    } else {
      const confirm = await showConfirm({ message: "측정하면 체크한 항목들이 전부 사라집니다. 진행하시겠습니까?" });
      if (confirm) {
        if (!selectedChild?.uid) return;
        
        const msg = await saveObservation(selectedChild.uid);
        console.log(msg);
        showAlert({ message: msg.msg });
      }
    }
  }, [selectedChild?.uid, answers, scrollToQuestion, showConfirm, showAlert]);
  

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
        <p>※ 문항을 선택할 때 마다 데이터는 저장됩니다.</p>

        {domainList.map((domain) => (
          <DomainSection key={domain} id={domain}>
            <DomainTitle>{domain}</DomainTitle>
            {groupedData[domain].map((item: SurveyItem) => (
              <Question key={item.questId} id={`question-${item.questId}`}>
                <QuestionTitleContainer>
                  <QuestionTitle>{item.question}</QuestionTitle>
                  <InfoIcon
                    size={20}
                    onClick={() => setActiveObservation({ id: item.questId, observation: item.observation })}
                    title="관측사례 보기"
                    />
                </QuestionTitleContainer>
                <OptionList>
                  {item.options.map((option: string, index: number) => (
                    <OptionLabel key={index}>
                      <RadioInput
                        type="radio"
                        name={item.questId}
                        value={index + 1}
                        checked={answers[item.questId] === index + 1}
                        onChange={() => handleAnswerChange(item.abilityLabelId, item.questId, index + 1)}
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
          <Btn onClick={handleSave}>측정하기</Btn>
        </BtnForm>

        <ToastCon />
      </Container>
    </Container>
  );
}
