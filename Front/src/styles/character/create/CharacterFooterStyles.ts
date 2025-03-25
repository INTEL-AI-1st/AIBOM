import styled, { css } from "styled-components";

export const FooterContainer = styled.div`
    position: 'fixed';
    bottom: 0;
    left: 0;
`;
export const ButtonsContainer = styled.div<{ index: number }>`
    display: flex;
    justify-content: ${(props) => (props.index === 0 ? 'flex-end' : 'space-between')};
    margin-top: 20px;
`;

const ButtonStyles = css`
    border-radius: 4px;
    padding: 8px 24px;
`

export const PrevButton = styled.button`
    ${ButtonStyles}
  background-color: #aaa;
`;

export const NextButton = styled.button`
    ${ButtonStyles}
`;