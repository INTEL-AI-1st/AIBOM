import { useRef, useCallback, useState, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { SliderWapper, MainTitle, SliderContainer } from "@styles/common/SliderStyles";
import SliderItems from "./SliderItem";
import SliderNav from "./SliderNav";

export interface Chat {
  uuid: string;
  id: string;
  image_url: string;
  title: string;
  summary: string;
  creator: string;
}

export interface chatProps {
  chats: Chat[];
  title: string;
  slidesToShow?: number;
  slidesToScroll?: number;
  detailPath?: string;
}

export default function SliderForm({ 
  chats, 
  title, 
  slidesToShow = 5, 
  slidesToScroll = 3,
  detailPath = "/chat"
}: chatProps) {
  const navigate = useNavigate();
  const slickRef = useRef<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const prev = useCallback(() => {
    if (slickRef.current) slickRef.current.slickPrev();
  }, []);

  const next = useCallback(() => {
    if (slickRef.current) slickRef.current.slickNext();
  }, []);

  const handleMovieClick = useCallback((id: number) => {
    navigate(`${detailPath}/${id}`);
  }, [navigate, detailPath]);

  const hasPrev = currentSlide > 0;
  const hasNext = currentSlide < chats.length - slidesToShow;

  const settings = useMemo(() => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    arrows: false,
    swipe: true,
    draggable: true,
    afterChange: (index: number) => setCurrentSlide(index),
    lazyLoad: 'ondemand' as const,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, slidesToShow),
          slidesToScroll: Math.min(2, slidesToScroll),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(2, slidesToShow),
          slidesToScroll: Math.min(1, slidesToScroll),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }), [slidesToShow, slidesToScroll]);

  return (
    <SliderWapper>
      <MainTitle>{title}</MainTitle>
      <SliderContainer>
        <Slider ref={slickRef} {...settings}>
          {chats.map((chat) => (
            <SliderItems key={chat.id} chat={chat} onClick={handleMovieClick} />
          ))}
        </Slider>
        
        <SliderNav isVisible={hasPrev} direction="prev" onClick={prev} />
        <SliderNav isVisible={hasNext} direction="next" onClick={next} />
      </SliderContainer>
    </SliderWapper>
  );
}
