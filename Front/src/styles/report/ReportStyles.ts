import styled from "styled-components";

export const Container = styled.div`
  margin: 0 auto;
  height: 100%;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid #ddd; 
`;

export const Title = styled.h1`
  display: flex;
  font-size: 24px;
  align-items: center;
  color: #333;
  
  svg {
    margin-right: 10px;
    cursor: pointer;
    padding-bottom: 5px;
  }
`;

export const SaveButton = styled.button`
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const ReportWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
`;

export const Body = styled.div`
    background: #ffb9b9;
    padding: 20px;
`;

export const MainTitle = styled.h1`
  text-align: center;
  font-size: 28px;
  color: #4a6fa5;
  margin: 20px 0;
  font-weight: bold;
`;

export const Section = styled.section<{ visible?: boolean }>`
  display: ${props => (props.visible ?? true) ? 'block' : 'none'};
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  color: #4a6fa5;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    padding-bottom: 4px;
  }
`;
/////Profile

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 2fr));
  gap: 20px;
  align-items: stretch;
`;

export const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    flex: initial;
  }
`;

export const InfoItem = styled.div`
  margin-bottom: 10px;
  
  strong {
    color: #4a6fa5;
    margin-right: 8px;
  }
`;

export const SummaryText = styled.div`
  line-height: 1.6;
  color: #555;
  background: #f0f4f8;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
  
  &:first-child{
      margin-top: 00px;
  }
`;

////A001

export const SectionContainer = styled.div`
  margin-bottom: 30px;
`;

export const KDSTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

export const TaskCard = styled.div<{ performance: string }>`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => {
    switch(props.performance) {
      case '완벽함': return '#4CAF50';
      case '잘 함': return '#2196F3';
      case '보통': return '#FF9800';
      case '잘 못함': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
`;

export const TaskTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    font-size: 14px;
    padding: 3px 8px;
    border-radius: 4px;
    background: #f0f4f8;
  }
`;

export const TaskDescription = styled.ul`
  padding-left: 20px;
  margin-top: 10px;
  
  li {
    margin-bottom: 5px;
    line-height: 1.5;
  }
`;

export const SummaryBox = styled.div`
  background: #f0f4f8;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  line-height: 1.6;
`;

/////A002
export const KICCELayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartContainer = styled.div`
  height: 350px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const DomainSection = styled.div`
  margin-bottom: 25px;
`;

export const DomainTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
  
  span {
    color: #4a6fa5;
    margin-left: 8px;
  }
`;

export const DomainDescription = styled.p`
  margin-top: 10px;
  line-height: 1.6;
`;

export const DomainTip = styled.div`
  background: #e8f4fe;
  border-left: 3px solid #2196F3;
  padding: 10px 15px;
  margin-top: 10px;
  font-size: 14px;
  
  strong {
    display: block;
    margin-bottom: 5px;
    color: #2196F3;
  }
`;


/////Recommendation
export const AssessmentBox = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  line-height: 1.7;
`;

export const HighlightText = styled.span<{ type: string }>`
  font-weight: 600;
  color: ${props => {
    switch(props.type) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#F44336';
      case 'neutral': return '#2196F3';
      default: return 'inherit';
    }
  }};
`;

export const RecommendationsBox = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

export const RecommendationItem = styled.div`
  margin-bottom: 15px;
  padding-left: 15px;
  border-left: 3px solid #4a6fa5;
`;

export const ChangeIndicator = styled.span<{ change: string }>`
  display: inline-flex;
  align-items: center;
  color: ${props => props.change === 'increase' ? '#4CAF50' : '#F44336'};
  margin-left: 5px;
`;


/////Supoort
export const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const TipCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const TipTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  border-bottom: 2px solid #e8f4fe;
  padding-bottom: 10px;
  color: #4a6fa5;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

export const TipList = styled.ul`
  padding-left: 0;
  list-style-type: none;
`;

export const TipItem = styled.li`
  margin-bottom: 12px;
  position: relative;
  padding-left: 28px;
  line-height: 1.5;
  
  &:before {
    content: "✅";
    position: absolute;
    left: 0;
    color: #4CAF50;
  }
`;

export const AgencyBox = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

export const AgencyTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

export const AgencyNote = styled.p`
  font-style: italic;
  color: #666;
  border-left: 3px solid #4a6fa5;
  padding-left: 15px;
  line-height: 1.6;
`;