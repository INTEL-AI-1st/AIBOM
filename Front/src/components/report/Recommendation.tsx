import * as RE from '@styles/report/ReportStyles';
import { FaComments, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function Recommendation() {
  return (
    <RE.SectionContainer>
      <RE.SectionTitle>
        <FaComments size={20} />
        전문가 총평
      </RE.SectionTitle>
      
      <RE.AssessmentBox>
        <p>
          OO이는 전반적인 발달이 안정적으로 이루어지고 있으며, 특히 <RE.HighlightText type="positive">자연탐구(4.8)</RE.HighlightText>와 <RE.HighlightText type="positive">의사소통(4.3)</RE.HighlightText> 영역에서 또래보다 높은 수준의 흥미와 탐색 역량을 보이고 있습니다.
        </p>
        
        <p>
          <RE.HighlightText type="positive">예술경험(▲0.3)</RE.HighlightText>
          <RE.ChangeIndicator change="increase">
            <FaArrowUp size={12} style={{ marginRight: '3px' }} /> 0.3
          </RE.ChangeIndicator>과 
          <RE.HighlightText type="positive">사회관계(▲0.1)</RE.HighlightText>
          <RE.ChangeIndicator change="increase">
            <FaArrowUp size={12} style={{ marginRight: '3px' }} /> 0.1
          </RE.ChangeIndicator>는 개선되었으며, 반면 
          <RE.HighlightText type="negative">신체운동·건강(▼0.2)</RE.HighlightText>
          <RE.ChangeIndicator change="decrease">
            <FaArrowDown size={12} style={{ marginRight: '3px' }} /> 0.2
          </RE.ChangeIndicator>은 소폭 감소하여 일부 신체 활동에서의 집중도나 수행력이 낮아진 모습이 관찰됩니다.
        </p>
        
        <p>
          유치원의 놀이 중심 통합 수업은 OO이의 주도성과 호기심을 잘 끌어내고 있으며, 관찰 및 표현 활동에서는 몰입도가 매우 높습니다.
        </p>
        
        <p>
          또한, K-DST 신체 과제 평가에 따르면 OO이는 '굴러오는 공 멈추기' 및 '공 튀기기' 등에서 손-눈 협응 및 반응 조절 능력이 뛰어난 수준을 보였습니다. '밧줄 뛰어넘기'에서도 기초 체력과 균형감각이 잘 발달된 모습이지만, '줄넘기' 수행에서는 반복 동작의 조절과 리듬감 형성에 어려움이 있어, 도전적 과제에 대한 자신감 회복이 필요한 시점입니다.
        </p>
      </RE.AssessmentBox>
      
      <RE.RecommendationsBox>
        <RE.SectionTitle>🔎 추천 사항</RE.SectionTitle>
        
        <RE.RecommendationItem>
          <p>
            줄넘기처럼 리듬감과 지속적인 신체 움직임이 필요한 활동은 <strong>부담 없는 놀이 형태(예: 음악에 맞춰 뛰기, 짧은 줄넘기 게임)</strong>로 접근해 자신감을 길러주세요.
          </p>
        </RE.RecommendationItem>
        
        <RE.RecommendationItem>
          <p>
            성공 경험을 자주 제공하고, 격려 중심의 피드백을 통해 신체활동에 대한 긍정적 태도를 유지하는 것이 중요합니다.
          </p>
        </RE.RecommendationItem>
      </RE.RecommendationsBox>
    </RE.SectionContainer>
  );
};