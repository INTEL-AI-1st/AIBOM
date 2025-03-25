import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styled, { css } from "styled-components";

/** Slider Css */
export const SliderWapper = styled.div`
  max-width: 100%;
  padding: 0 20px;
  margin-bottom: 40px;
`;

export const MainTitle = styled.h2`
  margin: 20px 0;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
`;

export const SliderContainer = styled.div`
  position: relative;
  width: 100%;
`;


/** SliderNav Css */
export const BtnStyle = css`
  position: absolute;
  top: 50%;
  font-size: 1.2rem;
  color: #555;
  width: 32px;
  height: 32px;
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 50%;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

export const PrevButton = styled(GrFormPrevious)`
  ${BtnStyle}
  left: 0;      
  transform: translate(-33%, -50%); 
`;

export const NextButton = styled(GrFormNext)`
  ${BtnStyle}
  right: 0;
  transform: translate(33%, -50%);
`;

export const OverlayStyle = css`
  position: absolute;
  top: 0;
  width: 50px;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.3s ease;
`;

export const FadeOverlayLeft = styled.div`
  ${OverlayStyle}
  left: 0;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0)
  );
`;

export const FadeOverlayRight = styled.div`
  ${OverlayStyle}
  right: 0;
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0)
  );
`;

/** SliderItem Css */
export const SlideWapper = styled.div`
  width: 200px;
  background-color: #fff;
  overflow: hidden;
  cursor: pointer;
  margin: 0 auto;
  text-align: left;
`;

export const SlideImageForm = styled.div`
  width: 100%;
  border-radius: 8px;
  position: relative;
  padding-top: 100%;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  overflow: hidden;
`;

export const SlideImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;

    ${SlideImageForm}:hover & {
    transform: scale(1.05); /* hover 시 이미지 확대 */
    }
`;


export const SlideContent = styled.div`
    padding-top: 10px;
    font-size: 12px;
    margin: 0;
`;

export const Title = styled.h4`
    font-size: 14px;
    font-weight: bold;
    margin: 5px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Summary = styled.div`
    color: #666;
    margin-bottom: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
`;

export const Creator = styled.div`
    background-color: #ddd;
    color: #444;
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
`;