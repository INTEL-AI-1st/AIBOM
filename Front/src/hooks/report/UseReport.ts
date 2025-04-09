import { useEffect, useCallback, useState, useRef } from "react";
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
  a002Data: Map<string, RT.A002Data>;
};

// 전역 캐시 객체
const dataCache: DataCache = {
  profileData: new Map<string, RT.ChildProfile>(),
  a001Data: new Map<string, RT.A001Item>(),
  a002Data: new Map<string, RT.A002Data>(),
};

// 메모리 관리를 위한 구독자 카운트 추적 훅
function useSubscribers(key: string): Map<string, number> {
  const subscribersRef = useRef<Map<string, number>>(new Map());
  
  useEffect(() => {
    const current = subscribersRef.current.get(key) || 0;
    subscribersRef.current.set(key, current + 1);
    
    return () => {
      const count = subscribersRef.current.get(key) || 0;
      if (count <= 1) {
        subscribersRef.current.delete(key);
      } else {
        subscribersRef.current.set(key, count - 1);
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
  
  return useFetchDataWithTwoParams<RT.A002Data>(
    RS.selectA002, 
    dataCache.a002Data,
    selectedChild?.uid,
    selectedChild?.ageYears // age 파라미터 사용
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
 * @param prompt GPT API에 전달할 프롬프트 텍스트 (사용자가 자유롭게 수정 가능)
 * @returns {Object} { summary, loading, error, refetch } - 생성된 요약, 로딩 상태, 에러, 재호출 함수
 */
export function useGptSummary(prompt: string | null) {
  // 이미 정의된 useProfileData와 useA001Data 훅을 통해 필요한 데이터를 가져옵니다.
  const { data: profile } = useProfileData();
  const { data: a001 } = useA001Data();
  const { data: a002 } = useA002Data();

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 프롬프트와 함께 profile, a001 데이터를 payload로 포함하여 전송합니다.
  const fetchGptSummary = useCallback(async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);

    try {
      // context 객체에 profile과 a001 데이터를 포함합니다.
      const payload = {
        context: {
          profile,
          a001,
          a002,
        },
      };

      // RS.getPrompt 함수가 payload 객체를 받도록 수정했다고 가정합니다.
      const response = await RS.getPrompt(payload);
      console.log(`response === ${response.text}`);
      setSummary(response.text);
    } catch (err) {
      console.error("GPT 요약 호출 오류:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [prompt, profile, a001, a002]);

  useEffect(() => {
    if (prompt) {
      fetchGptSummary();
    }
  }, [prompt, fetchGptSummary]);

  return { summary, loading, error, refetch: fetchGptSummary };
}
