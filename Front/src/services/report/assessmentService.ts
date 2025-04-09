import { supabase } from "@services/common/supabaseClient";
import * as RT from '@types/ReportTypes'

// Supabase 테이블 구조를 위한 인터페이스
interface AssessmentData {
  id?: number;
  user_id: string;
  assessment_id: string;
  assessment_type: string;
  raw_text: string;
  parsed_data: any;
  created_at?: string;
  updated_at?: string;
}

/**
 * 평가 데이터를 Supabase에 저장하는 함수
 * @param userId 사용자 ID
 * @param assessmentId 평가 ID
 * @param assessmentType 평가 유형 (예: "K-DST")
 * @param rawText 원본 텍스트
 * @param parsedData 파싱된 데이터
 * @returns 성공 여부 및 결과 데이터
 */
export async function saveAssessmentData(
  userId: string,
  assessmentId: string,
  assessmentType: string,
  rawText: string,
  parsedData: any
): Promise<{ success: boolean; error?: any; data?: any }> {
  try {
    // Supabase에 데이터 삽입
    const { data, error } = await supabase
      .from('assessment_data')
      .insert([
        {
          user_id: userId,
          assessment_id: assessmentId,
          assessment_type: assessmentType,
          raw_text: rawText,
          parsed_data: parsedData,
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('평가 데이터 저장 중 오류 발생:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('평가 데이터 저장 예외 발생:', error);
    return { success: false, error };
  }
}

/**
 * Supabase에서 평가 데이터를 조회하는 함수
 * @param userId 사용자 ID
 * @param assessmentId 평가 ID
 * @param assessmentType 평가 유형 (예: "K-DST") 
 * @returns 성공 여부 및 조회된 데이터
 */
export async function getAssessmentData(
  userId: string,
  assessmentId: string,
  assessmentType: string
): Promise<{ success: boolean; error?: any; data?: AssessmentData | null }> {
  try {
    // 가장 최근에 생성된 평가 데이터 한 개 조회
    const { data, error } = await supabase
      .from('assessment_data')
      .select('*')
      .eq('user_id', userId)
      .eq('assessment_id', assessmentId)
      .eq('assessment_type', assessmentType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('평가 데이터 조회 중 오류 발생:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('평가 데이터 조회 예외 발생:', error);
    return { success: false, error };
  }
}

/**
 * Supabase에 저장된 평가 데이터를 업데이트하는 함수
 * @param dataId 데이터 ID
 * @param updates 업데이트할 필드와 값
 * @returns 성공 여부 및 업데이트된 데이터
 */
export async function updateAssessmentData(
  dataId: number,
  updates: Partial<AssessmentData>
): Promise<{ success: boolean; error?: any; data?: any }> {
  try {
    // 데이터 업데이트 및 업데이트 시간 갱신
    const { data, error } = await supabase
      .from('assessment_data')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', dataId)
      .select();

    if (error) {
      console.error('평가 데이터 업데이트 중 오류 발생:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('평가 데이터 업데이트 예외 발생:', error);
    return { success: false, error };
  }
}

/**
 * K-DST 요약 텍스트를 파싱하는 함수
 * @param summary K-DST 텍스트
 * @returns 파싱된 항목별 점수와 요약
 */
export function parseKDSTSummary(summary: string): {
  taskPoints: string[][];
  kdstSummary: string;
} {
  const taskPoints: string[][] = [];
  
  // 각 항목(1-4)의 텍스트 추출
  for (let i = 1; i <= 4; i++) {
    // 정규표현식으로 현재 항목부터 다음 항목 또는 요약 전까지 추출
    const regex = new RegExp(`항목\\s*${i}:(.*?)(?=(항목\\s*${i+1}:|K-DST\\s*분석\\s*요약:))`, 's');
    const match = summary.match(regex);
    if (match) {
      const text = match[1].trim();
      // 먼저 줄바꿈으로 분리 시도
      let bullets = text.split(/\r?\n/);
      // 줄바꿈으로 분리된 배열 길이가 1이면 다른 구분자로 재시도
      if (bullets.length === 1) {
        bullets = text.split(/\s{2,}/);  // 공백 두 개 이상으로 분리
        if (bullets.length === 1) {
          bullets = text.split(/,|、/);  // 쉼표로 분리
        }
      }
      // 공백 제거 및 빈 문자열 필터링
      bullets = bullets.map(b => b.trim()).filter(b => b);
      taskPoints.push(bullets);
    } else {
      taskPoints.push([]);  // 항목이 없을 경우 빈 배열 추가
    }
  }
  
  // "K-DST 분석 요약:" 이후의 텍스트 추출
  const summaryRegex = /K-DST\s*분석\s*요약:\s*(.*)/s;
  const summaryMatch = summary.match(summaryRegex);
  const kdstSummary = summaryMatch ? summaryMatch[1].trim() : '';
  
  return { taskPoints, kdstSummary };
}

/**
 * K-DST 데이터를 처리하고 저장하는 함수
 * @param userId 사용자 ID
 * @param assessmentId 평가 ID
 * @param rawText 원본 텍스트
 * @returns 성공 여부 및 파싱된 데이터
 */
export async function processAndStoreKDST(
  userId: string,
  assessmentId: string,
  rawText: string
): Promise<{ success: boolean; error?: any; parsedData?: any }> {
  try {
    // 원본 텍스트 파싱
    const parsedData = parseKDSTSummary(rawText);
    
    // Supabase에 저장
    const result = await saveAssessmentData(
      userId,
      assessmentId,
      'K-DST',
      rawText,
      parsedData
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, parsedData };
  } catch (error) {
    console.error('K-DST 데이터 처리 중 오류 발생:', error);
    return { success: false, error };
  }
}

/**
 * 다른 평가 유형을 위한 파서 예시
 * @param text 원본 텍스트
 * @returns 파싱된 데이터
 */
export function parseOtherAssessmentType(text: string): any {
  // 다른 평가 유형에 맞는 특정 파싱 로직 구현
  // 구조화된 데이터 반환
  return {
    // 예시 구조
    sections: [],
    summary: ""
  };
}

/**
 * 모든 평가 유형 데이터를 처리하고 저장하는 함수
 * @param userId 사용자 ID
 * @param assessmentId 평가 ID
 * @param assessmentType 평가 유형
 * @param rawText 원본 텍스트
 * @returns 성공 여부 및 파싱된 데이터
 */
export async function processAndStoreAssessment(
  userId: string,
  assessmentId: string,
  assessmentType: string,
  rawText: string
): Promise<{ success: boolean; error?: any; parsedData?: any }> {
  try {
    let parsedData;
    
    // 평가 유형에 따른 파싱 로직 선택
    switch (assessmentType) {
      case 'K-DST':
        parsedData = parseKDSTSummary(rawText);
        break;
      case 'OTHER_TYPE_1':
        parsedData = parseOtherAssessmentType(rawText);
        break;
      // 추가 평가 유형에 대한 케이스 추가
      default:
        // 알 수 없는 유형일 경우 기본 파싱
        parsedData = { rawText };
    }
    
    // Supabase에 저장
    const result = await saveAssessmentData(
      userId,
      assessmentId,
      assessmentType,
      rawText,
      parsedData
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, parsedData };
  } catch (error) {
    console.error(`${assessmentType} 데이터 처리 중 오류 발생:`, error);
    return { success: false, error };
  }
}