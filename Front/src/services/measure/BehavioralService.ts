export const beha = (formData: FormData) => {
    fetch("/upload-video", {
      method: "POST",
      body: formData,
      // Content-Type은 브라우저가 자동으로 multipart/form-data로 설정함
      keepalive: true,
    });
    window.location.href = "/";
  };
  