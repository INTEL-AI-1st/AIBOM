import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import * as CS from '@styles/main/ChatBotStyles';
import Profile from '@components/main/Profile';
import BodyGraph from '@components/main/BodyGraph';
import AbilityGraph from '@components/main/AbilityGraph';
import Banner from '@components/main/Banner';
import { getMsg } from '@services/main/ChatSevice';

export default function Main() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 초기 봇 인삿말 메시지를 배열에 넣어둡니다.
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: '안녕하세요! 궁금한 점이 있으시면 질문해주세요.' }
  ]);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // 창 밖 클릭 시 채팅창 닫기 기능
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-chatbot="button"]')
      ) {
        setChatOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleChat = () => {
    setChatOpen(prev => !prev);
  };

  // 실제 전송 로직을 별도 함수로 분리
  const handleSendMessageWithText = async (message: string) => {
    if (message.trim() === '') return;
    setIsLoading(true);
    setChatMessages(prev => {
      if (
        prev.length === 1 &&
        prev[0].type === 'bot' &&
        prev[0].text === '안녕하세요! 궁금한 점이 있으시면 질문해주세요.'
      ) {
        return [{ type: 'user', text: message }];
      }
      return [...prev, { type: 'user', text: message }];
    });
    setChatInput(''); // 입력창 초기화
    try{
      const data = await getMsg(message);
    
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', text: data.text }
      ]);
    }catch{
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', text: '답변과정에서 에러가 발생했네요. 오류가 지속될 시 문의주세요.' }
      ]);
    }finally{
      setIsLoading(false);
    }
  };

  // 기존 입력창 내용을 전송하는 핸들러
  const handleSendMessage = () => {
    handleSendMessageWithText(chatInput);
  };

  // 질문 버튼 클릭 시 해당 질문을 즉시 전송
  const handleQuestionClick = (question: string) => {
    handleSendMessageWithText(question);
  };

  // 최초 메시지(한 개)이면서 기본 인삿말일 경우 질문 버튼 보임
  const showStaticElements = chatMessages.length === 1 &&
    chatMessages[0].text === '안녕하세요! 궁금한 점이 있으시면 질문해주세요.';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  return (
    <CS.Container>
      <CS.TopSection>
        <Profile />
        <AbilityGraph />
      </CS.TopSection>
      <BodyGraph />
      <Banner />
      
      {/* Chatbot Button */}
      <CS.ChatbotButton onClick={toggleChat} data-chatbot="button">
        <CS.ChatIcon>🤖</CS.ChatIcon>
      </CS.ChatbotButton>
      
      {/* Chat Window */}
      {chatOpen && (
        <CS.ChatWindow ref={chatWindowRef}>
          <CS.ChatHeader>도움이 필요하신가요?</CS.ChatHeader>
          <CS.ChatBody>
            {chatMessages.map((message, index) => (
              <CS.TextBox key={index} messageType={message.type as 'bot' | 'user'}>
              <span>{message.text}</span>
            </CS.TextBox>
            ))}
          </CS.ChatBody>
          {showStaticElements && (
            <CS.QuestionOptions>
              <CS.QuestionButton onClick={() => handleQuestionClick("행동발달그래프가 뭔가요?")}>
                행동발달그래프가 뭔가요?
              </CS.QuestionButton>
              <CS.QuestionButton onClick={() => handleQuestionClick("유아관찰그래프가 뭔가요?")}>
                유아관찰그래프가 뭔가요?
              </CS.QuestionButton>
            </CS.QuestionOptions>
          )}
          <CS.ChatInputArea>
            <CS.ChatInput 
              type="text" 
              placeholder="질문을 입력하세요..."
              value={chatInput}
              onChange={handleInputChange}
              disabled={isLoading}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <CS.SendButton onClick={handleSendMessage}>전송</CS.SendButton>
          </CS.ChatInputArea>
        </CS.ChatWindow>
      )}
    </CS.Container>
  );
}
