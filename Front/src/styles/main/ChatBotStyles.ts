import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f9f9f9;
  position: relative;
`;

export const TopSection = styled.div`
  display: flex;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ChatbotButton = styled.div`
  position: fixed;
  bottom: 100px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ffb9b9;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const ChatIcon = styled.div`
  font-size: 24px;
`;

export const ChatWindow = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 320px;
  height: 400px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
`;

export const ChatHeader = styled.div`
  padding: 15px;
  background-color: #ffb9b9;
  font-weight: bold;
  text-align: center;
`;

export const ChatBody = styled.div`
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
`;

export const TextBox = styled.div<{ messageType: 'bot' | 'user' }>`
  text-align: ${({ messageType }) => (messageType === 'user' ? 'right' : 'left')};
  margin: 8px 0;
  font-size: 14px;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 80%;
  margin-left: ${({ messageType }) => (messageType === 'user' ? 'auto' : '0')};
  margin-right: ${({ messageType }) => (messageType === 'user' ? '0' : 'auto')};
  
  /* 사용자와 봇 메시지 스타일 차별화 */
  background-color: ${({ messageType }) => 
    messageType === 'user' ? '#F5F5F5' : '#ffcece'};
  color: ${({ messageType }) => 
    messageType === 'user' ? '#333333' : '#333333'};
  border: 1px solid ${({ messageType }) => 
    messageType === 'user' ? '#E0E0E0' : '#E0E0E0'};
  
  /* 말풍선 효과 추가 */
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 15px;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    ${({ messageType }) => messageType === 'user' 
      ? `
        right: -5px;
        background-color: #F5F5F5;
        border-right: 1px solid #E0E0E0;
        border-top: 1px solid #E0E0E0;
      ` 
      : `
        left: -5px;
        background-color: #ffcece;
        border-left: 1px solid #ffb9b9;
        border-bottom: 1px solid #ffb9b9;
      `
    }
  }
`;

export const ChatInputArea = styled.div`
  border-top: 1px solid #eee;
  padding: 10px 15px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #4a86e8;
  }
`;

export const SendButton = styled.button`
  padding: 10px 16px;
  background-color: #ffb9b9;
  border: none;
  border-radius: 20px;
  color: #222;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #eea9a9;
  }
`;

export const QuestionOptions = styled.div`
  margin: 8px 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const QuestionButton = styled.button`
  padding: 8px 12px;
  background-color: #ffb9b9;
  border: none;
  color: #000;
  border-radius: 8px;
  text-align: left;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #eea9a9;
  }
`;
