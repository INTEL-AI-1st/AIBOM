import styled from 'styled-components';

export const PreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PreviewTitle = styled.h2`
  font-size: 16px;
  color: #4e93e2;
  font-weight: 500;
  margin-bottom: 24px;
`;

export const CharacterImageContainer = styled.div`
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CharacterImage = styled.div`
  width: 120px;
  height: 120px;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SmileIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .eyes {
    display: flex;
    width: 60px;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .eye {
    width: 12px;
    height: 12px;
    background-color: #888;
    border-radius: 50%;
  }
  
  .mouth {
    width: 40px;
    height: 20px;
    border-bottom: 4px solid #888;
    border-radius: 0 0 20px 20px;
  }
`;

export const PreviewInfo = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export const CharacterName = styled.h3`
  font-size: 18px;
  margin-bottom: 6px;
`;

export const CharacterDescription = styled.p`
  font-size: 14px;
  color: #666;
`;