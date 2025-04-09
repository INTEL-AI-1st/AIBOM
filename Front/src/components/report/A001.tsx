import { FaRunning } from 'react-icons/fa';
import * as RE from '@styles/report/ReportStyles';
import * as RT from 'src/types/ReportTypes';

interface A001Props {
  data: RT.A001Item | RT.A001Item[] | undefined;
  a001Summary: string | undefined;
}

// 성과 매핑 (score에 따른 텍스트)
const performanceMap: Record<number, RT.PerformanceLevel> = {
  0: "잘 못함",
  1: "보통",
  2: "완벽함",
};

// a001Summary 문자열을 파싱하는 헬퍼 함수
function parseA001Summary(summary: string) {
  const taskPoints: string[][] = [];
  // 각 항목(1~4)의 텍스트를 추출합니다.
  for (let i = 1; i <= 4; i++) {
    // 다음 항목 혹은 K-DST 분석 요약 이전까지의 텍스트를 캡쳐 (정규표현식, s 플래그로 줄바꿈 포함)
    const regex = new RegExp(`항목\\s*${i}:(.*?)(?=(항목\\s*${i+1}:|K-DST\\s*분석\\s*요약:))`, 's');
    const match = summary.match(regex);
    if (match) {
      const text = match[1].trim();
      // 우선 줄바꿈(\n) 기준으로 분리
      let bullets = text.split(/\r?\n/);
      // 만약 줄바꿈으로 분리된 배열 길이가 1이면 다른 구분자로 재분리 시도
      if (bullets.length === 1) {
        bullets = text.split(/\s{2,}/);
        if (bullets.length === 1) {
          bullets = text.split(/,|、/);
        }
      }
      bullets = bullets.map(b => b.trim()).filter(b => b);
      taskPoints.push(bullets);
    } else {
      taskPoints.push([]);
    }
  }
  // "K-DST 분석 요약:" 이후의 텍스트를 캡쳐합니다.
  const summaryRegex = /K-DST\s*분석\s*요약:\s*(.*)/s;
  const summaryMatch = summary.match(summaryRegex);
  const kdstSummary = summaryMatch ? summaryMatch[1].trim() : '';
  return { taskPoints, kdstSummary };
}

export default function A001({ data, a001Summary }: A001Props) {
  if (!data) {
    return <div>K-DST 데이터가 없습니다.</div>;
  }
  
  // data가 배열이 아닐 경우 배열로 변환합니다.
  const a001DataArray = Array.isArray(data) ? data : [data];

  // a001Summary에서 각 task의 points와 최종 요약을 파싱합니다.
  const { taskPoints: parsedTaskPoints, kdstSummary: parsedKdstSummary } = a001Summary 
    ? parseA001Summary(a001Summary) 
    : { taskPoints: [], kdstSummary: '' }

  const taskDataWithPoints: RT.A001Data[] = a001DataArray.map((item: RT.A001Item, index: number) => {
    const score = parseFloat(item.score);
    const performance: RT.PerformanceLevel = performanceMap[score] || "보통";
    // 파싱 결과에서 해당 task index의 점수 항목을 사용 (존재하지 않을 경우 기본 데이터로 대체)
    const points = (parsedTaskPoints[index] && parsedTaskPoints[index].length > 0)
      ? parsedTaskPoints[index] : [];

    return {
      id: item.num,
      task: item.info,
      score: item.score,
      performance: performance,
      points: points
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
              <ul>
                {item.points.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </RE.TaskDescription>
          </RE.TaskCard>
        ))}
      </RE.KDSTGrid>
      
      <RE.SummaryBox style={{ marginTop: "20px", backgroundColor: "#f7f7f7", padding: "15px" }}>
        <strong>K-DST 분석 요약: </strong>
        <p>{parsedKdstSummary}</p>
      </RE.SummaryBox>
    </RE.SectionContainer>
  );
}
