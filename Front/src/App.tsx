import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import styled from "styled-components";
import { PopupProvider } from "@components/common/Popup";
import { ProtectedRoute } from "@components/auth/ProtectedRoute";
import { MainProvider } from "@context/MainContext";

// 페이지 컴포넌트들을 lazy 로딩으로 불러옵니다.
const Register = lazy(() => import("@pages/auth/Register"));
const Login = lazy(() => import("@pages/auth/Login"));
const OAuthResult = lazy(() => import("@pages/auth/OAuthResult"));
const Home = lazy(() => import("@pages/Home"));

const Main = lazy(() => import("@pages/main/Main"));
const Education = lazy(() => import("@pages/education/Education"));

const Community = lazy(() => import("@pages/community/Community"));
const Write = lazy(() => import("@pages/community/Write/Write"));
const Post = lazy(() => import("@pages/community/Post/Post"));

const MyPage = lazy(() => import("@pages/myPage/MyPage"));

const Observation = lazy(() => import("@pages/measure/Observation"));
const Behavioral = lazy(() => import("@pages/measure/Behavioral"));
const Report = lazy(() => import("@pages/report/Report"));

// 라우터 설정
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/oauth-result", element: <OAuthResult /> },

  // Protected routes (인증이 필요한 경로)
  {
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          { index: true, element: <Main /> },
          { path: "education", element: <Education /> },
          { path: "community/write", element: <Write /> },
          { path: "community", element: <Community /> },
          { path: "community/post", element: <Post /> },
          { path: "my", element: <MyPage /> },
        ],
      },
      { path: "/obser", element: <Observation /> },
      { path: "/pose", element: <Behavioral /> },
      { path: "/report", element: <Report /> },
    ],
  },
]);

const App = () => {
  return (
    <StyledWrapper>
      <PopupProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <MainProvider>
              <RouterProvider router={router} />
            </MainProvider>
          </Suspense>
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
