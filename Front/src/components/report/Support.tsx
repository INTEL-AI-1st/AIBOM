import * as RE from '@styles/report/ReportStyles';
import { FaHome, FaHandsHelping, FaBuilding } from 'react-icons/fa';

export default function Support() {
  // 발달 지원 팁 데이터
  const homeTips = [
    {
      title: '1. 의사소통 발달 지원',
      tips: [
        '하루 중 아이와 1:1로 대화하는 시간을 10분 이상 가져보세요.',
        '그림책을 읽은 뒤 "이 다음엔 무슨 일이 일어날까?" 같은 열린 질문을 해보세요.'
      ]
    },
    {
      title: '2. 사회관계 능력 향상',
      tips: [
        '역할놀이(마트놀이, 병원놀이 등)를 통해 다양한 사회적 상황을 경험하게 해보세요.',
        '또래 친구들과 함께 놀 수 있는 기회를 자주 만들어주세요 (소규모 모임, 가족 모임 등).'
      ]
    },
    {
      title: '3. 예술경험 확장',
      tips: [
        '미술도구(색연필, 클레이 등)를 자유롭게 사용할 수 있는 창의 놀이 상자를 구성해보세요.',
        '주말마다 가족이 함께 노래를 부르거나 춤추는 시간도 좋아요.'
      ]
    },
    {
      title: '4. 자연탐구 호기심 강화',
      tips: [
        '산책 중 자연 현상에 대해 "왜?" 질문을 함께 탐구해보세요.',
        '집에서 간단한 과학 실험 키트를 활용한 놀이(예: 화산 만들기, 무지개 만들기 등)도 효과적입니다.'
      ]
    }
  ];

  return (
    <RE.SectionContainer>
      <RE.SectionTitle>
        <FaHandsHelping size={20} />
        발달 지원 팁
      </RE.SectionTitle>
      
      <RE.TipTitle>
        <FaHome size={20} />
        🏡 가정에서의 발달 지원 팁
      </RE.TipTitle>
      
      <RE.TipsGrid>
        {homeTips.map((tipGroup, index) => (
          <RE.TipCard key={index}>
            <h4>{tipGroup.title}</h4>
            <RE.TipList>
              {tipGroup.tips.map((tip, idx) => (
                <RE.TipItem key={idx}>{tip}</RE.TipItem>
              ))}
            </RE.TipList>
          </RE.TipCard>
        ))}
      </RE.TipsGrid>
      
      <RE.AgencyBox>
        <RE.AgencyTitle>
          <FaBuilding size={20} />
          🏢 유관기관 추천
        </RE.AgencyTitle>
        
        <RE.AgencyNote>
          💬 ※ 부모님이 걱정되는 영역이 있다면, 위 기관들의 무료 상담 또는 발달 선별검사 프로그램을 이용해보는 것도 좋습니다.
        </RE.AgencyNote>
      </RE.AgencyBox>
    </RE.SectionContainer>
  );
};
