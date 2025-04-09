import { FaRunning } from 'react-icons/fa';
import * as RE from '@styles/report/ReportStyles';

export default function A001() {
  // K-DST 분석 결과 데이터
  const kdstData = [
    {
      id: 1,
      task: '굴러오는 공 멈추기 / 공 튀기기',
      performance: '완벽함',
      points: [
        '정확한 타이밍 판단력과 손·눈 협응 발달이 잘 되어 있음',
        '주의 집중력 및 목표 동작에 대한 반응 속도 우수',
        '시각적 자극 → 운동 반응의 전환이 빠름'
      ]
    },
    {
      id: 2,
      task: '밧줄 뛰어넘기',
      performance: '잘 함',
      points: [
        '도약력이나 하체 근력, 밸런스 유지가 양호',
        '약간의 불안정함은 있었으나 수행에는 무리가 없음',
        '과제 이해력과 도전 태도가 긍정적임'
      ]
    },
    {
      id: 3,
      task: '줄넘기',
      performance: '잘 못함',
      points: [
        '반복 동작 조절력 부족 가능성',
        '리듬감, 타이밍 조절 또는 근력/지구력 부족 등 원인 추정',
        '심리적 회피나 도전의 어려움도 함께 고려할 필요 있음'
      ]
    }
  ];

  return (
    <RE.SectionContainer>
      <RE.SectionTitle>
        <FaRunning size={20} />
        행동 발달 분석 (K-DST 기반)
      </RE.SectionTitle>
      
      <RE.KDSTGrid>
        {kdstData.map(item => (
          <RE.TaskCard key={item.id} performance={item.performance}>
            <RE.TaskTitle>
              Task {item.id}: {item.task} <span>{item.performance}</span>
            </RE.TaskTitle>
            <RE.TaskDescription>
              {item.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </RE.TaskDescription>
          </RE.TaskCard>
        ))}
      </RE.KDSTGrid>
      
      <RE.SummaryBox>
        <strong>K-DST 분석 요약: </strong>
        OO이는 공 튀기기 및 멈추기와 같은 손-눈 협응 동작을 매우 안정적으로 수행하여, 시각적 자극에 대한 반응 및 신체 제어 능력이 뛰어난 편입니다. 밧줄을 넘는 활동도 잘 수행하였으며, 도전에 대한 긍정적인 태도를 보였습니다. 다만 줄넘기에서는 동작의 반복성과 리듬 조절에 어려움을 보이며 아직 숙련되지 않은 모습을 보였습니다.
      </RE.SummaryBox>
    </RE.SectionContainer>
  );
};
