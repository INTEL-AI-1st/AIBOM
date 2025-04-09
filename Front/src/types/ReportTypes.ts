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
  export interface A001Item {
    num: string;
    info: string;
    score: string;
  }
  
  // 퍼포먼스 타입을 열거형으로 정의
  export type PerformanceLevel = '완벽함' | '보통' | '잘 못함';
  
  export interface A001Data {
    id: string;
    task: string;
    score: string;
    performance: PerformanceLevel;
    points: string[];
  }
  
  //A002: KICCE 유아관찰척도 데이터

  export interface A002Item {
    domain: string;
    score: string;
    avg: string;
  }

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

  export  interface ResponseItem {
    type: "K-DST" | "KICCE" | "Combined" | string;
  }