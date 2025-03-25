import { useParams } from "react-router-dom";

export default function Notice() {
  const { id } = useParams();

  return (
    <div>
      <h2>공지사항 상세</h2>
      <p>공지사항 ID: {id}</p>
      <p>해당 공지사항의 내용을 여기에 표시할 수 있습니다.</p>
    </div>
  );
}
