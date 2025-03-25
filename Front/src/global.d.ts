export {};

declare global {
  interface Window {
    naver: {
      LoginWithNaverId: new (options: {
        clientId: string;
        callbackUrl: string;
        isPopup: boolean;
        loginButton: { color: string; type: number; height: number };
      }) => {
        init: () => void;
      };
    };
    Kakao: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Auth: {
        createLoginButton: (options: {
          container: string;
          success: (authObj: unknown) => void;
          fail: (err: unknown) => void;
        }) => void;
      };
    };
    google: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            container: HTMLElement,
            options: { theme: string; size: string }
          ) => void;
        };
      };
    };
  }
}
