import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { surveyData } from '@constants/surveyData';
import * as OS from '@styles/measure/ObservationStyles';
import { useMainContext } from '@context/MainContext';
import { saveObservation, selectObservation, upsertObservation } from '@services/measure/ObservationService';
import { usePopup } from '@hooks/UsePopup';
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
      const isMobile = window.innerWidth <= 768;
      const yOffset = isMobile ? -80 : -50;
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
        
        const data = await saveObservation(selectedChild.uid);
        await showAlert({ message: data.info[0].msg });
        if(data.info[0].state === '0000')
          navigate("/");
      }
    }
  }, [selectedChild?.uid, answers, scrollToQuestion, showConfirm, showAlert, navigate]);
  

  return (
    <OS.Container>
      <OS.SubContainer>
        <OS.Title>KICCE 유아관찰척도 설문</OS.Title>
        <OS.Nav>
          <OS.NavList>
            {domainList.map((domain) => (
              <OS.NavItem key={domain} onClick={() => scrollToSection(domain)}>
                {domain}
              </OS.NavItem>
            ))}
          </OS.NavList>
        </OS.Nav>
        
        <OS.DomainContainer>
          <p>이름: {selectedChild?.name}</p>
        </OS.DomainContainer>
        <OS.InfoBox>
          <p>※ 문항을 선택할 때 마다 데이터는 저장됩니다.</p>
        </OS.InfoBox>

          <OS.ContentContainer>
          {domainList.map((domain) => (
            <OS.DomainSection key={domain} id={domain}>
              <OS.DomainTitle>{domain}</OS.DomainTitle>
              {groupedData[domain].map((item: SurveyItem) => (
                <OS.Question key={item.questId} id={`question-${item.questId}`}>
                  <OS.QuestionTitleContainer>
                    <OS.QuestionTitle>{item.question}</OS.QuestionTitle>
                    <OS.InfoIcon
                      size={20}
                      onClick={() => setActiveObservation({ id: item.questId, observation: item.observation })}
                      title="관측사례 보기"
                      />
                  </OS.QuestionTitleContainer>
                  <OS.OptionList>
                    {item.options.map((option: string, index: number) => (
                      <OS.OptionLabel key={index}>
                        <OS.RadioInput
                          type="radio"
                          name={item.questId}
                          value={index + 1}
                          checked={answers[item.questId] === index + 1}
                          onChange={() => handleAnswerChange(item.abilityLabelId, item.questId, index + 1)}
                          />
                        <span>{option}</span>
                      </OS.OptionLabel>
                    ))}
                  </OS.OptionList>
                </OS.Question>
              ))}
            </OS.DomainSection>
          ))}

        <OS.BtnForm>
          <OS.Btn onClick={handleSave}>측정하기</OS.Btn>
        </OS.BtnForm>
        </OS.ContentContainer>
        {showScrollToTop && <OS.ScrollToTop onClick={scrollToTop} />}

        {/* 슬라이드바(관측사례) */}
        <OS.Overlay open={activeObservation !== null} onClick={closeSidebar} />
        <OS.SidebarContainer open={activeObservation !== null}>
          {activeObservation && (
            <>
              <OS.Header>
                <OS.ObservationHeader>관측사례</OS.ObservationHeader>
                <OS.CloseButton onClick={closeSidebar}>×</OS.CloseButton>
              </OS.Header>
              {(Object.entries(activeObservation.observation) as [keyof Observation, string[]][]).map(
                ([category, observations]) => (
                  <div key={category}>
                    <OS.ObservationCategory>
                      {category === 'play'
                        ? '놀이'
                        : category === 'life'
                        ? '일상생활'
                        : '활동'}
                    </OS.ObservationCategory>
                    <OS.ObservationList>
                      {observations.map((text: string, idx: number) => (
                        <OS.ObservationListItem key={idx}>
                          {text.replace(/\n/g, ' ')}
                        </OS.ObservationListItem>
                      ))}
                    </OS.ObservationList>
                  </div>
                )
              )}
            </>
          )}
        </OS.SidebarContainer>

        <OS.ToastCon />
      </OS.SubContainer>
    </OS.Container>
  );
}
