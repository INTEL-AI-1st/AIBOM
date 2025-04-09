import * as RE from '@styles/report/ReportStyles';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { FaUsers, FaRunning, FaComments, FaPalette, FaMicroscope } from 'react-icons/fa';

export default function A002() {
  // KICCE 유아관찰척도 데이터
  const kicceData = [
    { domain: '신체운동·건강', score: 4.0, icon: <FaRunning size={16} /> },
    { domain: '의사소통', score: 4.3, icon: <FaComments size={16} /> },
    { domain: '사회관계', score: 4.1, icon: <FaUsers size={16} /> },
    { domain: '예술경험', score: 3.9, icon: <FaPalette size={16} /> },
    { domain: '자연탐구', score: 4.8, icon: <FaMicroscope size={16} /> }
  ];

  // 도메인별 상세 설명
  const domainDetails = [
    {
      domain: '신체운동·건강',
      description: 'OO이는 또래 수준에 맞는 신체 운동 능력을 잘 갖추고 있으며, 대근육과 소근육을 활용한 활동에 안정감 있게 참여합니다. 특히 몸을 움직이며 즐기는 활동에서 긍정적인 태도를 보이며, 기본적인 신체 조절력과 협응력도 적절하게 발달하고 있습니다.',
      tip: '균형 잡힌 놀이 활동(예: 공 던지고 받기, 밸런스 게임)을 통해 더욱 다양한 움직임을 경험해보세요.'
    },
    {
      domain: '의사소통',
      description: '언어 표현과 이해 능력이 또래보다 뛰어난 편이며, 자신의 생각이나 감정을 또박또박 말로 전달하는 능력이 우수합니다. 이야기 나누기나 동화 읽기 활동에서도 주의 깊게 경청하며, 상황에 맞는 적절한 표현을 사용하는 모습이 인상적입니다.',
      tip: '"○○야, 이건 왜 그랬을까?"처럼 질문을 통해 사고 확장 기회를 주면 더욱 풍부한 표현력을 키울 수 있어요.'
    },
    {
      domain: '사회관계',
      description: '또래 친구들과의 상호작용에서 배려와 협력의 태도를 보이며, 관계 형성에 긍정적인 방향으로 참여하고 있습니다. 놀이 상황에서 친구의 입장을 고려하거나 문제 상황에 유연하게 대응하는 등 정서적 공감 능력도 잘 자라고 있어요.',
      tip: '역할놀이 등을 통해 다양한 사회적 상황을 간접적으로 경험해보면 더 많은 관계 경험을 쌓을 수 있어요.'
    },
    {
      domain: '예술경험',
      description: '창의적인 표현 활동에 즐겁게 참여하며, 다양한 색과 재료를 활용해 자신만의 방식으로 표현하는 데 흥미를 보입니다. 다만 때때로 작품에 대한 완성도를 중시하기보다는 경험 자체에 집중하는 경향이 있으며, 감상 활동에서는 조금 더 주의 깊은 관찰이 필요한 모습도 보입니다.',
      tip: '아이가 자유롭게 표현할 수 있도록 격려하고, "왜 그렇게 그렸어?" 같은 질문으로 표현의 의미를 함께 나눠보세요.'
    },
    {
      domain: '자연탐구',
      description: '관찰과 탐구 활동에서 매우 높은 흥미와 집중력을 보이며, 새로운 개념이나 현상에 대한 이해력이 빠릅니다. 호기심이 풍부하고, 실험·관찰 상황에서 왜 그럴까?라는 질문을 자주 던지며, 적극적으로 추론하고 탐색하는 모습이 돋보입니다.',
      tip: '실생활 속에서 아이가 궁금해할 만한 상황(예: 물건이 가라앉는 이유 등)을 함께 탐색해보세요. 아이의 과학적 사고력이 더욱 자라날 수 있어요.'
    }
  ];

  // Recharts 데이터 포맷
  const chartData = kicceData.map(item => ({
    subject: item.domain,
    A: item.score,
    fullMark: 5,
  }));

  const getDomainIcon = (domainName: string) => {
    const domain = kicceData.find(item => item.domain === domainName);
    return domain ? domain.icon : null;
  };

  return (
    <RE.SectionContainer>
      <RE.SectionTitle>
        <FaUsers size={20} />
        KICCE 유아관찰척도
      </RE.SectionTitle>
      
      <RE.KICCELayout>
        <RE.ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar
                name="아이 점수"
                dataKey="A"
                stroke="#4a6fa5"
                fill="#4a6fa5"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => [`${value}/5`, '점수']} />
            </RadarChart>
          </ResponsiveContainer>
        </RE.ChartContainer>
        
        <div>
          <h3>평균 또래 대비 점수</h3>
          {kicceData.map((item, index) => (
            <RE.DomainTitle key={index}>
              {index + 1}. {item.domain} <span>평균 {item.score}/5점</span>
            </RE.DomainTitle>
          ))}
        </div>
      </RE.KICCELayout>
      
      <div style={{ marginTop: '30px' }}>
        <h3>🧒 아이 발달 리포트 요약 (KICCE 기준)</h3>
        
        {domainDetails.map((detail, index) => (
          <RE.DomainSection key={index}>
            <RE.DomainTitle>
              {getDomainIcon(detail.domain)} 
              {detail.domain} <span>({kicceData.find(item => item.domain === detail.domain)?.score}/5.0)</span>
            </RE.DomainTitle>
            <RE.DomainDescription>
              {detail.description}
            </RE.DomainDescription>
            <RE.DomainTip>
              <strong>💡 가정 연계 팁:</strong> {detail.tip}
            </RE.DomainTip>
          </RE.DomainSection>
        ))}
      </div>
    </RE.SectionContainer>
  );
};
