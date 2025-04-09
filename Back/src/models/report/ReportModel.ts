import pool from "@config/db";

// 아이 프로필 정보
interface ChildProfile {
    name: string;
    ageYears: string;
    ageMonths: string
    observationPeriod: string;
    kindergarten: string;
    teacherName: string;
    lastObservationDate: string;
}
  
//A001: K-DST 행동 발달 분석 데이터
interface KDSTTask {
    id: number;
    task: string;
    performance: '완벽함' | '잘 함' | '보통' | '잘 못함';
    points: string[];
}
  
interface A001Data {
    tasks: KDSTTask[];
    summary: string;
}
  
//A002: KICCE 유아관찰척도 데이터
interface KICCEDomain {
    domain: string;
    score: number;
    previousScore?: number; // 이전 점수 (변화 계산용)
    description: string;
    tip: string;
}
  
interface A002Data {
    domains: KICCEDomain[];
}
  
// 전문가 총평 및 권장사항
interface DomainChange {
    domain: string;
    change: number; // 양수는 증가, 음수는 감소
}
  
interface Recommendation {
    id: number;
    content: string;
}
  
interface ExpertAssessment {
    generalAssessment: string[];
    domainChanges: DomainChange[];
    kdstAssessment: string;
    recommendations: Recommendation[];
}
  
// 발달 지원 팁
interface TipGroup {
    title: string;
    tips: string[];
}
  
interface SupportTips {
    homeTips: TipGroup[];
    agencies?: string[]; // 유관기관 정보
}

export const selectChildProfile = async (uid: string): Promise<ChildProfile | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
    `
        SELECT 
            c.name,  
            CAST(TIMESTAMPDIFF(YEAR, c.birthday, CURDATE()) AS CHAR) as ageYears,
            CAST(TIMESTAMPDIFF(MONTH, c.birthday, CURDATE()) AS CHAR) as ageMonths,
            CONCAT(MIN(a.record_month), ' ~ ', MAX(a.record_month)) as observationPeriod,
            '인텔 유치원' as kindergarten,
            '마크 김' as teacherName,
            MAX(a.record_month) as lastObservationDate	
        FROM TB_USERS_CHILDS c
        LEFT JOIN TB_CHILD_ABILITY a
        ON c.uid = a.uid
        WHERE c.uid = ?
    `, [uid]
  );
    conn.release();
    return rows.length ? rows[0] : null;
};

export const selectA001Data = async (uid: string, month: string): Promise<A001Data | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        `       
        SELECT 
               c.score, 
               i.GROUP_NUM num, 
               i.info 
          FROM TB_CHILD_ABILITY c
    RIGHT JOIN TB_ABILITY_INFO i
            ON c.ABILITY_ID = i.ABILITY_ID
           AND c.ABILITY_LABEL_ID = i.ABILITY_LABEL_ID
         WHERE c.uid = ?
           AND i.GROUP_ID = CASE 
                            WHEN ? <= 35 THEN 'A' 
                            WHEN ? >= 54 THEN 'C' 
                            ELSE 'B' END
        `, 
      [uid, month, month]
  );
    conn.release();
    return rows.length ? rows : null;
};

export const selectA002Data = async (uid: string, age: string): Promise<A002Data | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT 
            ability_label_id as abilityLabelId,
            quest_id as questId,
            score
        FROM TB_OBSERVATION
       WHERE UID = ?
         AND STATE = 1`, 
      [uid]
  );
    conn.release();
    return rows.length ? rows : null;
};
