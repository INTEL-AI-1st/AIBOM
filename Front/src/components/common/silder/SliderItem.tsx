import { useCallback } from "react";
import { SlideWapper, SlideImage, SlideContent, Title, Summary, Creator, SlideImageForm } from '@styles/common/SliderStyles';
import { Chat } from "./Slider";
import { useNavigate } from "react-router-dom";

interface SliderItemsProps {
  chat: Chat;
  onClick: (id: number) => void;
}

export default function SliderItems({ chat, onClick }: SliderItemsProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    onClick(parseInt(chat.id, 10)); // id를 number로 변환
  }, [chat.id, onClick]);

  const handleCreatorClick = useCallback(() => {
    if (chat.uuid) {
      navigate('/profile', { state: { uuid: chat.uuid } });
    }
  }, [chat.uuid, navigate]);

  return (
    <SlideWapper onClick={handleClick}>
      <SlideImageForm>
        {chat.image_url && <SlideImage src={chat.image_url} />}
      </SlideImageForm>
      <SlideContent>
        <Title>{chat.title}</Title>
        <Summary>{chat.summary}</Summary>
        <Creator onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the main click event
          handleCreatorClick();
        }}>
          {chat.creator}
        </Creator>
      </SlideContent>
    </SlideWapper>
  );
}

