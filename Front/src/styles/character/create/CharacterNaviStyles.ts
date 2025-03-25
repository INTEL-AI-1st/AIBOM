import styled from 'styled-components';

export const StepNavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 12px;
  margin-bottom: 24px;
`;

export const StepItem = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  cursor: pointer;
  opacity: ${props => props.isActive ? 1 : 0.5};
`;

export const StepIcon = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? '#000' : props.isCompleted ? '#000' : '#ddd'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

export const StepLabel = styled.span<{ isActive: boolean }>`
  font-size: 12px;
  font-weight: ${props => props.isActive ? '500' : 'normal'};
`;

export const RequiredMark = styled.span`
  color: red;
  margin-left: 2px;
`;