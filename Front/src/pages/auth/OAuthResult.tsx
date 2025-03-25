import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function OAuthResult() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    if (status === 'success') {
        const token = Cookies.get('authToken');
        if (token) {
        localStorage.setItem("token", token);
        navigate('/');
        } else {
        console.error('토큰이 없습니다.');
        navigate('/login');
        }
    } else {
        navigate('/login');
    }
    }, [location, navigate]);

  return (
    <>
    </>
  );
}
