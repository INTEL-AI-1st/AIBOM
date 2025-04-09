import { FaRunning } from 'react-icons/fa';
import * as RE from '@styles/report/ReportStyles';
import * as RT from 'src/types/ReportTypes';

interface A001Props {
  data: RT.A001Item | RT.A001Item[] | undefined;
  a001Summary: string | undefined;
}

const performanceMap: Record<number, RT.PerformanceLevel> = {
  0: "잘 못함",
  1: "보통",
  2: "완벽함",
};

export default function A001({ data, a001Summary }: A001Props) {
  if (!data) {
    return <div>K-DST 데이터가 없습니다.</div>;
  }
  
  // data가 배열이 아닐 경우 배열로 변환합니다.
  const a001DataArray = Array.isArray(data) ? data : [data];
  
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
              <RE.TaskTitleItem>
                Task {item.id} <span>{item.performance}</span>
              </RE.TaskTitleItem>
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
        아동은 공을 던지는 동작과 한 발로 서기에서 좋은 수행능력을 보였습니다.
        반면, 계단 오르기와 내려가기는 아직 발달 중으로 신체 균형과 자신감을 기르는 활동이 필요합니다.
      </RE.SummaryBox>

      <RE.SummaryBox style={{ marginTop: "20px", backgroundColor: "#f7f7f7", padding: "15px" }}>
        <strong>GPT 요약 결과:</strong>
         <p>{a001Summary}</p>
      </RE.SummaryBox>
    </RE.SectionContainer>
  );
}
