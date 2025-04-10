import { FaRunning } from 'react-icons/fa';
import * as RE from '@styles/report/ReportStyles';
import * as RT from 'src/types/ReportTypes';
import { useMemo } from 'react';

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

export default function A001({ data, a001Summary }: A001Props) {
  // useMemo는 조건과 상관없이 항상 호출해야 합니다.
  const parsedSummary = useMemo(() => {
    if (!a001Summary) return { taskPoints: [], kdDSTSummary: '' };

    let trimmedText = a001Summary.trim();

    if (trimmedText.startsWith('```json')) {
      trimmedText = trimmedText.replace(/^```json/, '').replace(/```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(trimmedText) as A001SummaryJSON;
      const evaluationItems = parsed.evaluationItems || [];
      
      const kdDSTSummaryRaw = parsed.kdDSTSummary || "";
      const kdDSTSummary = kdDSTSummaryRaw.replace(/^K-DST\s*분석\s*요약:\s*/, "").trim();
      
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
      
      return { taskPoints, kdDSTSummary };
    } catch (error) {
      console.error("JSON 파싱 에러:", error);
      return { taskPoints: [], kdDSTSummary: '' };
    }
  }, [a001Summary]);

  if (!data) {
    return <div>K-DST 데이터가 없습니다.</div>;
  }
  
  const a001DataArray = Array.isArray(data) ? data : [data];

  const taskDataWithPoints: RT.A001Data[] = a001DataArray.map((item: RT.A001Item, index: number) => {
    const score = parseFloat(item.score);
    const performance: RT.PerformanceLevel = performanceMap[score] || "보통";
    const points = (parsedSummary.taskPoints[index] && parsedSummary.taskPoints[index].length > 0)
      ? parsedSummary.taskPoints[index]
      : [];
      
    return {
      id: item.num,
      task: item.info,
      score: item.score,
      performance: performance,
      points: points,
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
        <p>{parsedSummary.kdDSTSummary}</p>
      </RE.SummaryBox>
    </RE.SectionContainer>
  );
}
