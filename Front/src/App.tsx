  import { createBrowserRouter, RouterProvider } from "react-router-dom";
  import styled from "styled-components";
  import Register from '@pages/auth/Register';
  import Login from '@pages/auth/Login'
  import OAuthResult from "@pages/auth/OAuthResult";
  import Home from '@pages/Home';
  import MyPage from '@pages/MyPage';
  import Main from "@pages/Main";
  import { PopupProvider } from "@components/common/Popup";
  import { ProtectedRoute } from "@components/common/ProtectedRoute";
import Community from "@pages/Community";
import Education from "@pages/Education";
import Observation from "@pages/Observation";
import { MainProvider } from "@context/MainContext";

  // ----- [라우터 설정] -----
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
        { path: "", element: <Main /> },
        { path: "education", element: <Education /> }, 
        { path: "community", element: <Community /> }, 
        { path: "my", element: <MyPage /> },
      ],
    },
      { path: "obser", element: <Observation />}
  
  ]);

  const App = () => {
    return (
      <StyledWrapper>
        <PopupProvider>
          <MainProvider>
            <RouterProvider router={router} />
          </MainProvider>
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
