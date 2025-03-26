import styled from 'styled-components';

export const RightSection = styled.div`
  flex: 2;
  display: flex;
  gap: 20px;
  position: relative;
  overflow: visible;
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
  flex: 1;
  position: relative;
`;

export const Headers = styled.div`
  display: flex;
  justify-content: space-between;

  h3,
  p {
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
  width: 250px;
  height: 250px;
  flex-shrink: 0;
  position: relative;
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
`;