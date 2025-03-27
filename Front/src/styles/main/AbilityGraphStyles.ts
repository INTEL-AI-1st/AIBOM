import styled from 'styled-components';
import { Link } from 'react-router-dom'

export const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  /* overflow: hidden; */
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
  height: 50%;
  flex: 1 1 calc(33% - 20px);
  position: relative;
`;

export const Headers = styled.div`
  display: flex;
  justify-content: space-between;

  h3{
    margin: 10px 0;
    white-space: nowrap;
  }
`;

export const Bodys = styled.div`
  display: flex;
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
  margin-top: 15px;
`;

export const LinkP = styled(Link)`
  color: #222;
  text-decoration-line: none;
`;