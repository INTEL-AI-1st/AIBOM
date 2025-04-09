// 아이 프로필 정보
export interface ChildProfile {
    name: string;
    ageYears: string;
    ageMonths: string
    observationPeriod: string;
    kindergarten: string;
    teacherName: string;
    lastObservationDate: string;
  }
  
  //A001: K-DST 행동 발달 분석 데이터
  export interface KDSTTask {
    id: number;
    task: string;
    performance: '완벽함' | '잘 함' | '보통' | '잘 못함';
    points: string[];
  }
  
  export interface A001Data {
    tasks: KDSTTask[];
    summary: string;
  }
  
  //A002: KICCE 유아관찰척도 데이터
  export interface KICCEDomain {
    domain: string;
    score: number;
    previousScore?: number; // 이전 점수 (변화 계산용)
    description: string;
    tip: string;
  }
  
  export interface A002Data {
    domains: KICCEDomain[];
  }
  
  // 전문가 총평 및 권장사항
  export interface DomainChange {
    domain: string;
    change: number; // 양수는 증가, 음수는 감소
  }
  
  export interface Recommendation {
    id: number;
    content: string;
  }
  
  export interface ExpertAssessment {
    generalAssessment: string[];
    domainChanges: DomainChange[];
    kdstAssessment: string;
    recommendations: Recommendation[];
  }
  
  // 발달 지원 팁
  export interface TipGroup {
    title: string;
    tips: string[];
  }
  
  export interface SupportTips {
    homeTips: TipGroup[];
    agencies?: string[]; // 유관기관 정보
  }