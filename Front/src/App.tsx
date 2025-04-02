import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import styled from "styled-components";
import { PopupProvider } from "@components/common/Popup";
import { ProtectedRoute } from "@components/ProtectedRoute";
import { MainProvider } from "@context/MainContext";

// 페이지 컴포넌트들을 lazy 로딩으로 불러옵니다.
const Register = lazy(() => import("@pages/auth/Register"));
const Login = lazy(() => import("@pages/auth/Login"));
const OAuthResult = lazy(() => import("@pages/auth/OAuthResult"));
const Home = lazy(() => import("@pages/Home"));

const Main = lazy(() => import("@pages/Main"));
const Education = lazy(() => import("@pages/Education"));

const Community = lazy(() => import("@pages/Community/Community"));
const Write = lazy(() => import("@pages/Community/Write/Write"));
const Post = lazy(() => import("@pages/Community/Post/Post"));

const MyPage = lazy(() => import("@pages/MyPage"));

const Observation = lazy(() => import("@pages/measure/Observation"));
const Behavioral = lazy(() => import("@pages/measure/Behavioral"));
const Report = lazy(() => import("@pages/Report"));

// 라우터 설정
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/oauth-result", element: <OAuthResult /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Main /> },
      { path: "education", element: <Education /> },
      { path: "community", element: <Community /> },
      { path: "community/write", element: <Write /> },
      { path: "community/post", element: <Post /> },
      { path: "my", element: <MyPage /> },
    ],
  },
  {
    path: "/obser",
    element: (
      <ProtectedRoute>
        <Observation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pose",
    element: (
      <ProtectedRoute>
        <Behavioral />
      </ProtectedRoute>
    ),
  },
  {
    path: "/report",
    element: (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return (
    <StyledWrapper>
      <PopupProvider>
      <ProtectedRoute>
        <MainProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </MainProvider>
        </ProtectedRoute>
      </PopupProvider>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;
