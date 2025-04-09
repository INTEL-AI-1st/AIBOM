
  /**
   * K-DST 리포트 프롬프트 템플릿
   * @param age - 아이의 나이 (세)
   * @param gender - 아이의 성별
   * @param groupName - 해당 아이가 속한 그룹명 (예: "그룹 A", "그룹 B", "그룹 C")
   * @param sectionText - 그룹 내 각 항목의 평가 내용 (예시: "1-1. 복합 신체 조절 – good (Task: 계단 올라가기)" 등 여러 줄)
   * @returns 프롬프트 문자열
   */
  export function getKdstPrompt(
    age: number,
    gender: string,
    groupName: string,
    sectionText: string
  ): string {
    const additionalInfo = `
  아이는 생후 ${age}개월 ${gender}이며, K-DST 평가 기준에 따라 ${groupName}에 해당합니다.
  아래는 ${groupName}의 행동 평가 항목별 결과입니다. 각 항목의 점수는 2점 만점이며,
  0은 bad, 1은 good, 2는 perfect로 판정되었습니다.
  
  [${groupName}]
  ${sectionText}
  
  위 정보를 참고하여, 아이의 행동 발달 상태를 분석하고,
  해당 task 수행에 대한 구체적인 코칭 및 가정 연계 지도 팁을 포함한 리포트를 작성해 주세요.
    `;
    return `
  너는 유아 행동 발달 분석 전문가이자 교육 컨설턴트입니다.
  다음 아이의 정보와 K-DST 평가 결과를 바탕으로 행동 발달 리포트를 작성해 주세요.
  
  ${additionalInfo}
  
  리포트에는 아래 사항을 포함해 주세요.
  1. ${groupName} 각 항목별 평가 분석
  2. K-DST 분석 요약
  3. 아이의 나이와 성별을 고려한 맞춤형 조언 제공
  4. 아래 리턴 형식은 무조건 지킬 것
  
  출력 형식은 명확하고, 이해하기 쉬운 문장으로 구성해 주세요.

  리턴은 아래의 형식과 같이 해주세요.
  리턴 예시)
  항목 1:
  계단 오르기 동작에 대한 균형감 발달 진행 중
  난간을 잡는 행동으로 안전을 확보하려는 모습 보임
  단계별 운동 발달에 따른 계단 이용 능력 향상 중 
  항목 2:
  계단 오르기 동작에 대한 균형감 발달 진행 중
  난간을 잡는 행동으로 안전을 확보하려는 모습 보임
  단계별 운동 발달에 따른 계단 이용 능력 향상 중
  ...
  K-DST 분석 요약:
  내용
    `.trim();
  }

/**
 * KICCE 리포트 프롬프트 템플릿
 * @param age - 아이의 나이 (세)
 * @param gender - 아이의 성별
 * @param scores - 각 영역별 점수를 담은 객체. 예: {
 *    "신체운동·건강": 85.0,
 *    "의사소통": 90.0,
 *    "사회관계": 80.0,
 *    "예술경험": 75.0,
 *    "자연탐구": 88.0
 * }
 * @returns 프롬프트 문자열
 */
export function getKiccePrompt(
    age: number,
    gender: string,
    scores: { [domain: string]: number }
  ): string {
    return `
  너는 유아 행동 발달 분석 전문가이자 교육 컨설턴트이다.
  아이는 ${age}세 ${gender}이며, KICCE 기준으로 다음 점수를 받았습니다 (100점 만점):
  
  - 신체운동·건강: ${scores["신체운동·건강"].toFixed(1)}
  - 의사소통:     ${scores["의사소통"].toFixed(1)}
  - 사회관계:     ${scores["사회관계"].toFixed(1)}
  - 예술경험:     ${scores["예술경험"].toFixed(1)}
  - 자연탐구:     ${scores["자연탐구"].toFixed(1)}
  
  각 영역별 점수, 평가 내용, 그리고 가정 연계 활동 팁을 포함한 발달 리포트를 작성해 주세요.
    `.trim();
  }
  
  /**
   * 통합 리포트 프롬프트 템플릿
   * 두 리포트를 종합하여 최종 리포트를 요청할 때 사용합니다.
   * @param kicceReport - KICCE 리포트 전체 텍스트
   * @param kdstReport - K-DST 리포트 전체 텍스트
   * @returns 프롬프트 문자열
   */
  export function getCombinedPrompt(
    kicceReport: string,
    kdstReport: string
  ): string {
    return `
  너는 유아 발달 분석 전문가이다.
  아래 두 리포트를 참고하여, 전문가 총평(월간 변화·두 기준 비교·통합 진단)과
  발달 지원 팁(교육과정 연계·가정 연계 활동·K-DST 과제 포함)을 작성해 주세요.
  또한, 리포트에서 아동의 발달이 부족한 영역이 확인되면,
  해당 분야의 전문 상담이나 진료가 가능한 진료과를 추천해 주세요.
  
  --- KICCE 리포트 ---
  ${kicceReport}
  
  --- K-DST 리포트 ---
  ${kdstReport}
    `.trim();
  }
  
  /**
   * 평균 비교 결과를 포함한 KICCE 리포트 프롬프트 템플릿
   * @param age - 아이의 나이 (세)
   * @param gender - 아이의 성별
   * @param scores - 아이의 점수 객체
   * @param differences - (내 아이 점수 - 평균) 차이를 담은 객체
   * @param domainAvg - 각 영역별 평균 점수를 담은 객체
   * @returns 프롬프트 문자열
   */
  export function getAvgComparisonPrompt(
    age: number,
    gender: string,
    scores: { [domain: string]: number },
    differences: { [domain: string]: number },
    domainAvg: { [domain: string]: number }
  ): string {
    const diffLines = Object.keys(scores).map((domain) => {
      const diff = differences[domain];
      const sign = diff >= 0 ? "+" : "";
      return `${domain} 점수: 내 아이(${scores[domain].toFixed(
        1
      )}) vs 평균(${domainAvg[domain].toFixed(1)}) → 차이: ${sign}${diff.toFixed(1)}`;
    }).join("\n");
  
    const additionalInfo = `
  아이의 정보: ${age}세 ${gender}
  평균 비교 결과 (내 아이 점수 - ${age}세 ${gender} 평균):
  ${diffLines}
  
  위 결과를 참고하여 리포트에 반영해 주세요.
    `;
  
    return `
  너는 유아 행동 발달 분석 전문가이자 교육 컨설턴트이다.
  다음 아이의 정보와 평균 비교 결과를 바탕으로 KICCE 기준 발달 리포트를 작성해줘.
  
  ${additionalInfo}
  
  리포트 작성 시, 
  1) 신체운동·건강  
  2) 의사소통  
  3) 사회관계  
  4) 예술경험  
  5) 자연탐구  
  
  각 영역별 100점 만점 점수, 평가 내용, 그리고 가정에서 할 수 있는 활동 팁을 포함하며,  
  평균 대비 어느 정도 높은지 혹은 낮은지를 간단히 언급해줘.
    `.trim();
  }
  