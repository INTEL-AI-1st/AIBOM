import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { useMainContext } from "@context/MainContext";
import * as RS from "@services/report/ReportService";
import * as RT from "src/types/ReportTypes";

// API 응답 타입 정의
interface ApiResponse<T> {
  info: T;
}

// 타입 안전성을 위한 캐시 맵 타입 정의
type DataCache = {
  profileData: Map<string, RT.ChildProfile>;
  a001Data: Map<string, RT.A001Item>;
  a002Data: Map<string, RT.A002Item>;
};

// 전역 캐시 객체
const dataCache: DataCache = {
  profileData: new Map<string, RT.ChildProfile>(),
  a001Data: new Map<string, RT.A001Item>(),
  a002Data: new Map<string, RT.A002Item>(),
};

// 메모리 관리를 위한 구독자 카운트 추적 훅
function useSubscribers(key: string): Map<string, number> {
  const subscribersRef = useRef<Map<string, number>>(new Map());
  
  useEffect(() => {
    const subscribers = subscribersRef.current;
    const current = subscribers.get(key) || 0;
    subscribers.set(key, current + 1);
    
    return () => {
      const count = subscribers.get(key) || 0;
      if (count <= 1) {
        subscribers.delete(key);
      } else {
        subscribers.set(key, count - 1);
      }
    };
  }, [key]);
  
  return subscribersRef.current;
}

// 제네릭 데이터 패칭 훅 (단일 파라미터)
function useFetchData<T>(
  fetchFn: (uid: string) => Promise<T | ApiResponse<T>>,
  cacheMap: Map<string, T>,
  uid?: string,
  cacheKey?: string
) {
  const actualCacheKey = cacheKey || uid || "";
  const [data, setData] = useState<T | undefined>(() => 
    actualCacheKey ? cacheMap.get(actualCacheKey) : undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const isMounted = useRef(true);
  const key = `${uid || ""}:${cacheKey || ""}`;
  useSubscribers(key);
  
  // 데이터 패칭 함수
  const fetchData = useCallback(async (force = false) => {
    if (!uid) return;
    
    if (!force && cacheMap.has(actualCacheKey)) {
      setData(cacheMap.get(actualCacheKey));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn(uid);
      if (result && isMounted.current) {
        let actualData: T;
        
        if (typeof result === "object" && result !== null && "info" in result) {
          actualData = (result as ApiResponse<T>).info;
        } else {
          actualData = result as T;
        }
        
        cacheMap.set(actualCacheKey, actualData);
        setData(actualData);
      }
    } catch (err) {
      console.error("데이터 패칭 오류:", err);
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [uid, actualCacheKey, fetchFn, cacheMap]);  

  // 컴포넌트 마운트/언마운트 및 의존성 변경 시 데이터 패칭
  useEffect(() => {
    isMounted.current = true;
    
    if (uid) {
      fetchData();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [uid, fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch: useCallback(() => fetchData(true), [fetchData]) 
  };
}

// 두 개의 파라미터를 가진 함수를 위한 데이터 패칭 훅
function useFetchDataWithTwoParams<T>(
  fetchFn: (uid: string, param: string) => Promise<T | ApiResponse<T>>,
  cacheMap: Map<string, T>,
  uid?: string,
  param?: string
) {
  const actualCacheKey = `${uid || ""}:${param || ""}`;
  const [data, setData] = useState<T | undefined>(() => 
    actualCacheKey ? cacheMap.get(actualCacheKey) : undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const isMounted = useRef(true);
  useSubscribers(actualCacheKey);
  
  // 데이터 패칭 함수
  const fetchData = useCallback(async (force = false) => {
    if (!uid || !param) return;
    
    if (!force && cacheMap.has(actualCacheKey)) {
      setData(cacheMap.get(actualCacheKey));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn(uid, param);
      if (result && isMounted.current) {
        let actualData: T;
        
        if (typeof result === "object" && result !== null && "info" in result) {
          actualData = (result as ApiResponse<T>).info;
        } else {
          actualData = result as T;
        }
        
        cacheMap.set(actualCacheKey, actualData);
        setData(actualData);
      }
    } catch (err) {
      console.error("데이터 패칭 오류:", err);
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [uid, param, actualCacheKey, fetchFn, cacheMap]);  

  // 컴포넌트 마운트/언마운트 및 의존성 변경 시 데이터 패칭
  useEffect(() => {
    isMounted.current = true;
    
    if (uid && param) {
      fetchData();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [uid, param, fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch: useCallback(() => fetchData(true), [fetchData]) 
  };
}

/**
 * 아동 프로필 데이터를 가져오는 훅
 * @returns {Object} 프로필 데이터, 로딩 상태, 에러, 리패치 함수
 */
export function useProfileData() {
  const { selectedChild } = useMainContext();
  
  return useFetchData<RT.ChildProfile>(
    RS.selectProfile, 
    dataCache.profileData,
    selectedChild?.uid
  );
}

/**
 * A001 데이터를 가져오는 훅 (month 파라미터 사용)
 * @returns {Object} A001 데이터, 로딩 상태, 에러, 리패치 함수
 */
export function useA001Data() {
  const { selectedChild } = useMainContext();
  
  return useFetchDataWithTwoParams<RT.A001Item>(
    RS.selectA001, 
    dataCache.a001Data,
    selectedChild?.uid,
    selectedChild?.ageMonths // month 파라미터 사용
  );
}

/**
 * A002 데이터를 가져오는 훅 (age 파라미터 사용)
 * @returns {Object} A002 데이터, 로딩 상태, 에러, 리패치 함수
 */
export function useA002Data() {
  const { selectedChild } = useMainContext();
  
  return useFetchDataWithTwoParams<RT.A002Item>(
    RS.selectA002, 
    dataCache.a002Data,
    selectedChild?.uid,
    selectedChild?.ageYears
  );
}

/**
 * 아동 관련 모든 데이터를 가져오는 통합 훅
 * @returns {Object} 통합된 아동 데이터, 로딩 상태, 에러, 리패치 함수
 */
export function useChildData() {
  const { data: profile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useProfileData();
  const { data: a001, loading: a001Loading, error: a001Error, refetch: refetchA001 } = useA001Data();
  const { data: a002, loading: a002Loading, error: a002Error, refetch: refetchA002 } = useA002Data();
  
  const loading = profileLoading || a001Loading || a002Loading;
  const error = profileError || a001Error || a002Error;
  
  const refetchAll = useCallback(() => {
    refetchProfile();
    refetchA001();
    refetchA002();
  }, [refetchProfile, refetchA001, refetchA002]);

  return {
    profile,
    a001,
    a002,
    loading,
    error,
    refetchAll
  };
}

/**
 * GPT API를 호출하여 요약 텍스트를 생성하는 훅
 * @param reportId GPT API 호출에 필요한 리포트 아이디 (필수)
 * @param profile 사용자 프로파일 (선택적)
 * @param a001 A001 아이템 (선택적)
 * @param a002 A002 아이템 (선택적)
 * @returns {Object} { summary, a001Summary, a002Summary, reviewSummary, tipsSummary, loading, error, refetch } - 생성된 요약들, 로딩 상태, 에러, 재호출 함수
 */
export function useGptSummary(
  reportId: string | null,
  profile?: RT.ChildProfile,
  a001?: RT.A001Item,
  a002?: RT.A002Item
) {
  const [summaries, setSummaries] = useState({
    summary: "",
    a001Summary: "",
    a002Summary: "",
    reviewSummary: "",
    tipsSummary: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const successfulFetchRef = useRef(false);
  const fetchingRef = useRef(false);
  
  const hasRequiredData = useMemo(() => {
    if (!reportId) return false;
    
    switch (reportId) {
      case 'A001':
        return !!profile && !!a001;
      case 'A002':
        return !!profile && !!a002;
      default:
        return !!profile;
    }
  }, [reportId, profile, a001, a002]);

  const fetchGptSummary = useCallback(async (force = false) => {
    if (!hasRequiredData || !reportId) return;
    if (successfulFetchRef.current && !force) return;
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      const context: Record<string, RT.ChildProfile | RT.A001Item | RT.A002Item | undefined> = { profile };
      if (reportId === 'A001' || reportId === 'all') {
        context.a001 = a001;
      }
      if (reportId === 'A002' || reportId === 'all') {
        context.a002 = a002;
      }

      const response = await RS.getPrompt({ context });
      
      const findResponseText = (type: string): string => {
        const item = response.responses?.find((r: RT.ResponseItem) => r.type === type);
        return item?.text ?? "";
      };
      
      setSummaries({
        summary: findResponseText("Combined"),
        a001Summary: findResponseText("K-DST"),
        a002Summary: findResponseText("KICCE"),
        reviewSummary: findResponseText("review"),
        tipsSummary: findResponseText("tips")
      });
      
      // 성공적으로 완료됨을 표시
      successfulFetchRef.current = true;
    } catch (err) {
      console.error("GPT 요약 호출 오류:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [reportId, hasRequiredData, profile, a001, a002]);

  // 초기 데이터 로드 및 의존성 변경 시 실행
  useEffect(() => {
    // 모든 필수 데이터가 준비된 경우에만 실행
    if (hasRequiredData) {
      fetchGptSummary();
    }
  }, [hasRequiredData, fetchGptSummary]);

  // 강제로 다시 호출하는 함수
  const refetch = useCallback(() => {
    successfulFetchRef.current = false;
    fetchGptSummary(true);
  }, [fetchGptSummary]);

  return {
    ...summaries,
    loading,
    error,
    refetch
  };
}