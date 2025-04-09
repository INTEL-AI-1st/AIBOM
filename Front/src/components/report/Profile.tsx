import { FaChild } from "react-icons/fa";
import * as RE from "@styles/report/ReportStyles";
import { useProfileData, useGptSummary } from "@hooks/report/UseReport";

export default function Profile() {
  const { data: profileData, loading, error } = useProfileData();

  // 프로필 데이터가 존재할 때 GPT 프롬프트를 구성
  const gptPrompt = profileData
    ? `아이 프로필 요약: 이름: ${profileData.name}, 나이: ${profileData.ageYears}세 (${profileData.ageMonths}개월),
       관찰기간: ${profileData.observationPeriod}, 유치원: ${profileData.kindergarten}, 교사: ${profileData.teacherName}, 
       최근 관찰일: ${profileData.lastObservationDate}. 이 데이터를 바탕으로 전반적 발달 평가 요약을 작성해줘.`
    : null;

  // GPT API 호출 훅 사용 (refetch은 사용하지 않아 구조분해하지 않습니다)
  const { summary: gptSummary, loading: gptLoading, error: gptError } = useGptSummary(gptPrompt);

  if (error) {
    throw error;
  }
  if (loading) {
    return <div>프로필 데이터를 로딩 중입니다...</div>;
  }
  if (!profileData) {
    return <div>프로필 데이터가 없습니다.</div>;
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
            <strong>이름:</strong> {profileData.name}
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>나이:</strong> {profileData.ageYears}세 ({profileData.ageMonths}개월)
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>관찰기간:</strong> {profileData.observationPeriod}
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>유치원:</strong> {profileData.kindergarten}
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>교사 이름:</strong> {profileData.teacherName}
          </RE.InfoItem>
          <RE.InfoItem>
            <strong>최근 관찰일:</strong> {profileData.lastObservationDate}
          </RE.InfoItem>
        </RE.ProfileCard>
      </RE.GridItem>

      <RE.GridItem>
        <RE.SectionTitle>전반적 발달 종합 평가</RE.SectionTitle>
        <RE.ProfileCard>
          {gptLoading ? (
            <RE.SummaryText>요약 내용을 생성 중...</RE.SummaryText>
          ) : gptError ? (
            <RE.SummaryText>요약 생성 중 오류 발생.</RE.SummaryText>
          ) : (
            <RE.SummaryText>{gptSummary}</RE.SummaryText>
          )}
        </RE.ProfileCard>
      </RE.GridItem>
    </RE.ProfileGrid>
  );
}
