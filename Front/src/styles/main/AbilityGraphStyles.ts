import styled from 'styled-components';
import { Link } from 'react-router-dom'

export const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  
  &.compact-mode {
    gap: 0;
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;

export const GrayBox = styled.div`
  background-color: #f0f0f0;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ColorSection = styled.div<{ backgroundColor: string }>`
  background-color: ${props => props.backgroundColor};
  padding: 10px;
  flex: 1 1 calc(33% - 20px);
  position: relative;
  
  .compact-mode & {
    flex: 1 1 100%;
    height: auto;
    margin-bottom: 20px;
  }
`;

export const Headers = styled.div`
  display: flex;
  justify-content: space-between;

  h3 {
    margin: 10px 0;
    white-space: nowrap;
  }
  
  .compact-mode & {
    h3 {
      font-size: 1.1rem;
    }
  }
`;

export const Bodys = styled.div`
  display: flex;
  
  .compact-mode & {
    justify-content: center;
    margin: 15px 0;
  }
`;

export const PerformanceBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

export const ShapeContainer = styled(GrayBox)`
  max-width: 250px;
  flex-shrink: 0;
  position: relative;
  
  .compact-mode & {
    width: 300px !important;
    height: 300px !important;
    max-width: 100%;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const InfoIconWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 5px;
  margin-left: 8px;
  cursor: pointer;

  &:hover > div {
    display: block;
  }
`;

export const Tooltip = styled.div`
  display: none;
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  z-index: 100;
`;

export const LockWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  align-items: center;
  justify-content: center;
  z-index: 10
`;

export const ColorBox = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 2;
  
  .compact-mode & {
    width: 110px;
  }
`;

export const ColorWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  &:hover {
    cursor: pointer;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Color = styled.div<{ color: string }>`
  border: 1px solid #aaa;
  width: 13px;
  height: 13px;
  margin-right: 5px;
  background: ${props => props.color};
`;

export const ColorText = styled.span`
  font-weight: 400;
  font-size: 0.8rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 5px;
`;

export const LinkP = styled(Link)`
  color: #222;
  text-decoration-line: none;
  margin-top: 10px;
`;