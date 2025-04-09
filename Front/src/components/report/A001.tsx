import { FaRunning } from 'react-icons/fa';
import * as RE from '@styles/report/ReportStyles';
import { useA001Data } from '@hooks/report/UseReport';
import * as RT from 'src/types/ReportTypes';

const performanceMap: Record<number, RT.PerformanceLevel> = {
  0: "잘 못함",
  1: "보통",
  2: "완벽함",
};

interface UseA001Result {
  data: RT.A001Item | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export default function A001() {
  const { data: a001Data, loading, error }: UseA001Result = useA001Data();

  if (error) {
    throw error;
  }
  if (loading) {
    return <div>데이터를 로딩 중입니다...</div>;
  }
  if (!a001Data) {
    return <div>K-DST 데이터가 없습니다.</div>;
  }

  // 아이 데이터가 배열이 아닐 경우를 대비해 배열로 변환
  const a001DataArray = Array.isArray(a001Data) ? a001Data : [a001Data];

  // 각 Task에 대한 분석 포인트 매핑
  const taskDataWithPoints: RT.A001Data[] = a001DataArray.map((item: RT.A001Item, index: number) => {
    const pointsData: string[][] = [
      [
        '계단 오르기 동작에 대한 균형감 발달 진행 중',
        '난간을 잡는 행동으로 안전을 확보하려는 모습 보임',
        '단계별 운동 발달에 따른 계단 이용 능력 향상 중'
      ],
      [
        '계단 내려오기 시 무게중심 조절 발달 진행 중',
        '독립적 동작 수행에 대한 자신감 발달 필요',
        '공간지각능력과 하체 근력 발달 관찰 필요'
      ],
      [
        '상체 움직임과 공 던지기 협응 능력 양호',
        '팔 근육 조절 및 목표 지향적 동작 수행 좋음',
        '운동 계획 능력과 실행 능력이 발달됨'
      ],
      [
        '균형 감각과 한발 지지 능력이 뛰어남',
        '신체 중심 유지 능력과 집중력이 우수함',
        '전정감각 발달 및 자세 제어 능력 좋음'
      ]
    ];

    // 점수를 기반으로 수행 수준 판단
    const score = parseFloat(item.score);
    const performance: RT.PerformanceLevel = performanceMap[score] || "보통";

    return {
      id: item.num,
      task: item.info,
      score: item.score,
      performance: performance,
      points: pointsData[index]
    };
  });

  return (
    <RE.SectionContainer>
      <RE.SectionTitle>
        <FaRunning size={20} />
        행동 발달 분석 (K-DST 기반)
      </RE.SectionTitle>

      <RE.KDSTGrid>
        {taskDataWithPoints.map((item: RT.A001Data) => (
          <RE.TaskCard key={item.id} performance={item.performance}>
            <RE.TaskTitle>
              <RE.TaskTitleItem>Task {item.id} <span>{item.performance}</span></RE.TaskTitleItem>
              <RE.TaskTitleItem>{item.task}</RE.TaskTitleItem>
            </RE.TaskTitle>
            <RE.TaskDescription>
              {item.points.map((point: string, idx: number) => (
                <li key={idx}>{point}</li>
              ))}
            </RE.TaskDescription>
          </RE.TaskCard>
        ))}
      </RE.KDSTGrid>
      
      <RE.SummaryBox>
        <strong>K-DST 분석 요약: </strong>
        아동은 공을 던지는 동작과 한 발로 서기에서 좋은 수행능력을 보였습니다. 특히 한 발로 서기에서 균형 감각이 뛰어난 것으로 나타났습니다. 반면 계단 오르기와 내려가기는 아직 발달 중인 단계로, 신체 균형감과 자신감을 기르는 활동이 도움이 될 것입니다. 전반적으로 대근육 운동 발달이 연령에 맞게 진행되고 있으며, 상체와 하체의 협응력이 점차 발달하는 과정에 있습니다.
      </RE.SummaryBox>
    </RE.SectionContainer>
  );
}
