import { FaChild } from "react-icons/fa";
import * as RE from "@styles/report/ReportStyles";
import { ChildProfile } from "src/types/ReportTypes";
import { useMemo } from "react";

interface ProfileProps {
  data: ChildProfile | null;
  summary: string | undefined;
}

export default function Profile({ data, summary }: ProfileProps) {
  const parsedSummary = useMemo(() => {
    if (!summary) return {};
    let trimmedText = summary.trim();

    if (trimmedText.startsWith('```json')) {
      trimmedText = trimmedText.replace(/^```json/, '').replace(/```$/, '').trim();
    }

    try {
      return JSON.parse(trimmedText);
    } catch (error) {
      console.error('JSON 파싱 에러:', error);
      return {};
    }
  }, [summary]);

  if (!data) {
    return (
      <RE.ProfileGrid>
        <RE.GridItem>
          <p>프로필 데이터가 없습니다.</p>
        </RE.GridItem>
      </RE.ProfileGrid>
    );
  }

  return (
    <RE.ProfileGrid>
      <RE.GridItem>
        <RE.SectionTitle>
          <FaChild size={20} />
          아이 프로필 요약
        </RE.SectionTitle>
        <RE.ProfileCard>
          <RE.InfoItem>
            <strong>이름:</strong> {data.name}
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>나이:</strong> {data.ageYears}세 ({data.ageMonths}개월)
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>관찰기간:</strong> {data.observationPeriod}
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>유치원:</strong> {data.kindergarten}
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>교사 이름:</strong> {data.teacherName}
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>최근 관찰일:</strong> {data.lastObservationDate}
          </RE.InfoItem>
        </RE.ProfileCard>
      </RE.GridItem>

      <RE.GridItem>
        <RE.SectionTitle>전반적 발달 종합 평가</RE.SectionTitle>
        <RE.ProfileCard>
          <RE.SummaryText>{parsedSummary.Combine}</RE.SummaryText>
        </RE.ProfileCard>
      </RE.GridItem>
    </RE.ProfileGrid>
  );
}
