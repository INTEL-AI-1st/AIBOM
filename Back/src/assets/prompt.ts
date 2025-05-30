
  /**
   * K-DST 리포트 프롬프트 템플릿
   * @param age - 아이의 나이 (세)
   * @param gender - 아이의 성별
   * @param groupName - 해당 아이가 속한 그룹명 (예: "그룹 A", "그룹 B", "그룹 C")
   * @param sectionText - 그룹 내 각 항목의 평가 내용 (예시: "1-1. 복합 신체 조절 – good (Task: 계단 올라가기)" 등 여러 줄)
   * @returns 프롬프트 문자열
   */
  export function getKdstPrompt(
    name: string,
    age: number,
    gender: string,
    groupName: string,
    sectionText: string
  ): string {
    const additionalInfo = `
  아이의 이름은 ${name}으로 생후 ${age}개월 ${gender}이며, K-DST 평가 기준에 따라 ${groupName}에 해당합니다.
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
  4. details은 3개를 고정으로 리턴
  
  출력 형식은 명확하고, 이해하기 쉬운 문장으로 구성해 주세요.

  JSON 타입으로 아래 리턴형식을 반드시 지키도록 하세요.
  리턴은 아래의 형식과 같이 해주세요.
  리턴 예시)
    {
    "evaluationItems": [
      {
        "item": "항목 1",
        "details": "계단 오르기 동작에 대한 균형감 발달 진행 중\n난간을 잡는 행동으로 안전을 확보하려는 모습 보임\n단계별 운동 발달에 따른 계단 이용 능력 향상 중"
      },
      {
        "item": "항목 2",
        "details": "계단 오르기 동작에 대한 균형감 발달 진행 중\n난간을 잡는 행동으로 안전을 확보하려는 모습 보임\n단계별 운동 발달에 따른 계단 이용 능력 향상 중"
      }
    ],
    "kdDSTSummary": "K-DST 분석 요약: 내용"
  }
    `.trim();
  }

/**
 * KICCE 리포트 프롬프트 템플릿
 * @param age - 아이의 나이 (세)
 * @param gender - 아이의 성별
 * @param sectionText - 항목의 평가 내용
 *    "신체운동": 85.0,
 *    "의사소통": 90.0,
 *    "사회관계": 80.0,
 *    "예술경험": 75.0,
 *    "자연탐구": 88.0
 * }
 * @returns 프롬프트 문자열
 */
export function getKiccePrompt(
    name: string,
    age: number,
    gender: string,
    sectionText: string
  ): string {
    return `
  너는 유아 행동 발달 분석 전문가이자 교육 컨설턴트이다.
  아이의 이름은 ${name}으로 생후 ${age}개월 ${gender}이며, KICCE 기준으로 다음 점수를 받았습니다 (100점 만점):
  
  ${sectionText}
  
  각 영역별 점수, 평가 내용, 그리고 가정 연계 활동 팁을 포함한 발달 리포트를 작성해 주세요.
  JSON 타입으로 아래 리턴형식을 반드시 지키도록 하세요.

  리턴 예시)
  {
    domain: '신체운동',
    description: '${name}는 또래 수준에 맞는 신체 운동 능력을 잘 갖추고 있으며, 대근육과 소근육을 활용한 활동에 안정감 있게 참여합니다. 특히 몸을 움직이며 즐기는 활동에서 긍정적인 태도를 보이며, 기본적인 신체 조절력과 협응력도 적절하게 발달하고 있습니다.',
    tip: '균형 잡힌 놀이 활동(예: 공 던지고 받기, 밸런스 게임)을 통해 더욱 다양한 움직임을 경험해보세요.'
  }
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
    name: string,
    kdstReport: string,
    kicceReport: string,
    tipsReport: string
  ): string {
    return `
  당신은 유아 발달 분석 전문가입니다.
  아이의 이름은 ${name}이며
  아래 리포트들을 참고하여, 전반적 발달 종합 평가를 작성해주세요.
  또한, 리포트에서 아동의 발달이 부족한 영역이 확인되면,
  해당 분야의 전문 상담이나 진료가 가능한 진료과를 추천해 주세요.

  시작 문단에 진단결과, 종합 평가: 등 기계적인 문단은 넣지 말고 자연스러운 문단으로 시작
  채팅블럭은 최대 7개까지만 작성하세요.
  
  --- K-DST 리포트 ---
  ${kdstReport}
  
  --- KICCE 리포트 ---
  ${kicceReport}
  
  --- 추천 리포트 ---
  ${tipsReport}
  
  데이터들은 있을수도 없을수도 있으니 있는 내용에 한해 만들어줘.
  JSON 타입으로 아래 리턴형식을 반드시 지키도록 하세요.

  리턴 예시)
  {
    Combine: 내용
  }
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
  export function getExpertReviewPrompt(
    name: string,
    kdstReport: string,
    kicceData: string
  ): string {
  //   const diffLines = Object.keys(scores).map((domain) => {
  //     const diff = differences[domain];
  //     const sign = diff >= 0 ? "+" : "";
  //     return `${domain} 점수: 내 아이(${scores[domain].toFixed(
  //       1
  //     )}) vs 평균(${domainAvg[domain].toFixed(1)}) → 차이: ${sign}${diff.toFixed(1)}`;
  //   }).join("\n");
  
  //   const additionalInfo = `
  // 아이의 정보: ${age}세 ${gender}
  // 평균 비교 결과 (내 아이 점수 - ${age}세 ${gender} 평균):
  // ${diffLines}
  return `
  당신은 유아행동 발달 분석 결과에 대해 평가하는 전문가입니다.
  아이의 이름은 ${name}이며

  ${kicceData}
  
  위 내용가 존재한다면
  도메인 별로 이번 달 점수와 저번 달 점수의 차이를 비교하여 성장비교를 해주고
  이번 달 점수와 나잇대 평균 점수도 성장비교를 해 전문가 의견을 작성해주세요.
  필수로 상승에 (▲0.0) 하강에 (▼0.0) 와 같이 형식을 맞춰주세요.

  ${kdstReport}
  
  위 내용은 K-DST 결과를 기반으로 만들어진 내용입니다.
  내용이 존재한다면
  내용을 파악하고 전문가 의견을 작성해주세요.

  내용을 합산하여 전문가의 시선으로 비교 및 조언으로 총평을 작성하고
  성장을 위한 추천 사항을 작성해주세요.
  
  데이터가 하나라면 그 하나를 토대로 만들어주세요.
  최종적으로 전문가 총평, 추천 사항으로 리포트를 작성해주세요.
  JSON 타입으로 아래 리턴형식을 반드시 지키도록 하세요.

  리턴 예시)
  {
     review: '${name}는 전반적인 발달이 안정적으로 이루어지고 있으며, 특히 자연탐구(4.8)와 의사소통(4.3) 영역에서 또래보다 높은 수준의 흥미와 탐색 역량을 보이고 있습니다.
              경험(▲0.3)0.3과사회관계(▲0.1)0.1는 개선되었으며, 반면신체운동·건강(▼0.2)0.2은 소폭 감소하여 일부 신체 활동에서의 집중도나 수행력이 낮아진 모습이 관찰됩니다.
              유치원의 놀이 중심 통합 수업은 OO이의 주도성과 호기심을 잘 끌어내고 있으며, 관찰 및 표현 활동에서는 몰입도가 매우 높습니다.
              또한, K-DST 신체 과제 평가에 따르면 OO이는 '굴러오는 공 멈추기' 및 '공 튀기기' 등에서 손-눈 협응 및 반응 조절 능력이 뛰어난 수준을 보였습니다. 
             '밧줄 뛰어넘기'에서도 기초 체력과 균형감각이 잘 발달된 모습이지만, '줄넘기' 수행에서는 반복 동작의 조절과 리듬감 형성에 어려움이 있어, 도전적 과제에 대한 자신감 회복이 필요한 시점입니다.',
  Recommend: '줄넘기처럼 리듬감과 지속적인 신체 움직임이 필요한 활동은 부담 없는 놀이 형태(예: 음악에 맞춰 뛰기, 짧은 줄넘기 게임)로 접근해 자신감을 길러주세요.
              성공 경험을 자주 제공하고, 격려 중심의 피드백을 통해 신체활동에 대한 긍정적 태도를 유지하는 것이 중요합니다.'
  }

    `.trim();
  }
  

  /**
 * 발달 지원 팁 프롬프트 템플릿
 * @param ageMonths - 아이의 나이 (개월)
 * @param gender - 아이의 성별 ("남아" 또는 "여아")
 * @param focusAreas - 지원이 필요한 발달 영역 목록 (예: ["의사소통", "사회관계", "예술경험", "자연탐구"])
 * @returns GPT에게 전달할 프롬프트 문자열
 */
  export function getDevelopmentTipsPrompt(
    name: string,
    age: number,
    gender: string,
    sectionText: string
  ): string {
    return `
  너는 유아 발달 지원 전문가입니다.
  아이의 이름은 ${name}으로 현재 ${age}개월 된 ${gender}이며, 아래 네 가지 발달 영역에서 관심을 가지고 지원할 수 있습니다:
  
  ${sectionText}
  
  위 내용을 기반으로
  가정에서 아이의 성장을 더욱 촉진할 수 있는 4개의 발달 영역을 선정하고,
  각 영역별로 가정에서 쉽게 실천 가능한 구체적인 활동 팁을 **2개씩** 제안해 주세요.
  - 팁 앞에는 ✅ 이모지를 붙여 주세요.
  - 가능한 짧고 명확한 문장으로 작성해 주세요.
  
  아이가 특별히 부족하거나 의심이 된다면 해당 분야를 면밀히 검사할 수 있는
  기관이나 시설을 추천해주세요.

  아이가 특별히 관심을 보이거나 더욱 다양한 체험이 필요한 영역이 있다면,
  그 영역을 보다 풍성하게 경험할 수 있는 추천 기관이나 시설을 안내해 주세요.

  특별한 관심 영역이 없다면 아이의 다양한 발달을 균형 있게 돕는 체험 공간이나 프로그램을 추천해 주세요.
  
  JSON 타입으로 아래 리턴 형식을 반드시 지키도록 하세요.
  리턴 예시)
  {
    "tips": [
      {
        "item": "의사소통 발달 지원",
        "details": "✅ 하루 중 아이와 1:1로 대화하는 시간을 10분 이상 가져보세요.\n✅ 그림책을 읽은 뒤 '이 다음엔 무슨 일이 일어날까?' 같은 열린 질문을 해보세요."
      },
      {
        "item": "사회관계 능력 향상",
        "details": "✅ 역할놀이(마트놀이, 병원놀이 등)를 통해 다양한 사회적 상황을 경험하게 해보세요.\n✅ 또래 친구들과 함께 놀 수 있는 기회를 자주 만들어 주세요 (소규모 모임, 가족 모임 등)."
      }
    ],
    "institution": "※ ${name}의 관심 분야를 더욱 확장하거나 다양한 체험 기회를 제공할 수 있는 프로그램이나 기관 방문을 추천드립니다."
  }
  `.trim();
  }


    /**
 * 챗봇 프롬프트 템플릿
 * @param msg - 메시지
 * @returns GPT에게 전달할 프롬프트 문자열
 */
    export function getChatBotPrompt(
      msg: string,
    ): string {
      return `
    당신은 유아발달관리용 챗봇입니다.
    아래 메시지의 대한 답변을 주세요.
    
    ${msg}
    
    메세지 내에
    유아관찰이 있다면 KICCE 기반으로 대답합니다.
    행동발달이 잇다면 K-DST 기반을 대답합니다.

    그 외에 메시지는 역할에 맞게 질문에 맞는 대답을 합니다.
    `.trim();
    }
  
  
    