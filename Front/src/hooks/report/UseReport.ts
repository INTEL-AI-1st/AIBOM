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
  a001Data: Map<string, RT.A001Data>;
  a002Data: Map<string, RT.A002Data>;
};

// 전역 캐시 객체
const dataCache: DataCache = {
  profileData: new Map<string, RT.ChildProfile>(),
  a001Data: new Map<string, RT.A001Data>(),
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

// 제네릭 데이터 패칭 훅
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
 * KDST 데이터를 가져오는 훅
 * @returns {Object} KDST 데이터, 로딩 상태, 에러, 리패치 함수
 */
export function useKdstData() {
  const { selectedChild } = useMainContext();
  
  return useFetchData<RT.A001Data>(
    RS.selectA001, 
    dataCache.a001Data,
    selectedChild?.uid
  );
}

/**
 * A002 데이터를 가져오는 훅 
 * @returns {Object} A002 데이터, 로딩 상태, 에러, 리패치 함수
 */
export function useA002Data() {
  const { selectedChild } = useMainContext();
  
  return useFetchData<RT.A002Data>(
    RS.selectA002, 
    dataCache.a002Data,
    selectedChild?.uid
  );
}

/**
 * 아동 관련 모든 데이터를 가져오는 통합 훅
 * @returns {Object} 통합된 아동 데이터, 로딩 상태, 에러, 리패치 함수
 */
export function useChildData() {
  const { data: profile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useProfileData();
  const { data: kdst, loading: kdstLoading, error: kdstError, refetch: refetchKdst } = useKdstData();
  
  const loading = profileLoading || kdstLoading;
  const error = profileError || kdstError;
  
  const refetchAll = useCallback(() => {
    refetchProfile();
    refetchKdst();
  }, [refetchProfile, refetchKdst]);

  return {
    profile,
    kdst,
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
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
  
    // force 매개변수를 제거하여 쓰지 않도록 수정
    const fetchGptSummary = useCallback(async () => {
      if (!prompt) return;
  
      setLoading(true);
      setError(null);
  
      try {
        // GPT API 엔드포인트와 요청 방식은 필요에 따라 수정하세요.
        const response = await RS.getPrompt();
        console.log(`response === ${response.text}`);
        setSummary(response.text);
      } catch (err) {
        console.error("GPT 요약 호출 오류:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }, [prompt]);
  
    useEffect(() => {
      if (prompt) {
        fetchGptSummary();
      }
    }, [prompt, fetchGptSummary]);
  
    return { summary, loading, error, refetch: fetchGptSummary };
  }