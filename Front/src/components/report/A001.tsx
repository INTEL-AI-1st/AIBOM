import { FaRunning } from 'react-icons/fa';
import * as RE from '@styles/report/ReportStyles';
import * as RT from 'src/types/ReportTypes';

interface EvaluationItem {
  item: string;
  details: string;
}

interface A001SummaryJSON {
  evaluationItems: EvaluationItem[];
  kdDSTSummary: string;
}

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

// a001Summary JSON 파싱 함수
function parseA001Summary(summary: string) {
  try {
    // 코드 블록(예: "```json")이 포함되어 있다면 제거합니다.
    if (summary.startsWith("```")) {
      // 첫 줄에 있는 ```와 언어 지정 (예: ```json) 제거
      summary = summary.replace(/^```[^\n]*\n/, "");
      // 마지막에 위치한 ``` 제거
      summary = summary.replace(/\n```$/, "");
    }

    // JSON 문자열 파싱 및 타입 단언
    const parsed = JSON.parse(summary) as A001SummaryJSON;
    const evaluationItems = parsed.evaluationItems || [];
    
    // kdDSTSummary 문자열에서 접두어 제거 (존재하는 경우)
    const kdDSTSummaryRaw = parsed.kdDSTSummary || "";
    const kdDSTSummary = kdDSTSummaryRaw.replace(/^K-DST\s*분석\s*요약:\s*/, "").trim();
    
    // evaluationItems의 details를 bullet list로 변환 (줄바꿈, 2칸 이상의 공백, 혹은 쉼표 기준)
    const taskPoints = evaluationItems.map((item: EvaluationItem) => {
      const details = item.details || "";
      let bullets = details.split(/\r?\n/);
      if (bullets.length === 1) {
        bullets = details.split(/\s{2,}/);
        if (bullets.length === 1) {
          bullets = details.split(/,|、/);
        }
      }
      return bullets.map((b: string) => b.trim()).filter((b: string) => b);
    });
    
    return { taskPoints, kdstSummary: kdDSTSummary };
  } catch (error) {
    console.error("JSON 파싱 에러:", error);
    return { taskPoints: [], kdstSummary: '' };
  }
}

export default function A001({ data, a001Summary }: A001Props) {
  if (!data) {
    return <div>K-DST 데이터가 없습니다.</div>;
  }
  
  // data가 배열이 아닌 경우 배열로 변환합니다.
  const a001DataArray = Array.isArray(data) ? data : [data];

  // JSON 형식의 a001Summary 파싱
  const { taskPoints: parsedTaskPoints, kdstSummary: parsedKdstSummary } = a001Summary 
    ? parseA001Summary(a001Summary) 
    : { taskPoints: [], kdstSummary: '' };

  // data 배열을 기반으로 각 Task에 대한 정보를 구성합니다.
  const taskDataWithPoints: RT.A001Data[] = a001DataArray.map((item: RT.A001Item, index: number) => {
    const score = parseFloat(item.score);
    const performance: RT.PerformanceLevel = performanceMap[score] || "보통";
    // JSON 파싱 결과에서 해당 인덱스의 점수 항목을 사용 (없으면 빈 배열)
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
