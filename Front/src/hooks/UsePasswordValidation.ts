import { useState, useMemo } from "react";

// 비밀번호 유효성 검사 함수
function validatePassword(password: string): boolean {
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

// 비밀번호 관련 커스텀 훅 (회원가입/로그인 공통 사용)
export function usePasswordValidation() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rePassword, setRePassword] = useState("");
    const [showRePassword, setShowRePassword] = useState(false);

    // 비밀번호 유효성 검사 (useMemo로 최적화)
    const isValPw = useMemo(() => validatePassword(password), [password]);

    // 비밀번호 확인 검사 (useMemo로 최적화)
    const isCfPw = useMemo(() => password === rePassword, [password, rePassword]);

    return {
        password, setPassword,
        showPassword, setShowPassword,
        rePassword, setRePassword,
        showRePassword, setShowRePassword,
        isValPw, isCfPw,
    };
}
