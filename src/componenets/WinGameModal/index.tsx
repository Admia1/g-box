import styled from "styled-components";
import { useContext } from "react";
import { ModalContext } from "../../hooks/ModalContext";

const StyledPosition = styled.div<{ isEnable: boolean }>`
    position: absolute;
    display: flex;
    ${({ isEnable }) => isEnable ? '' : 'display : none;'}
    
    align-items: center;
    justify-content: center;
    padding: 200px;
`
const StyledMessageBoxBorder = styled.div`
    display: flex;
    background-color: #432442;
    padding: 10px;
    border-radius: 20px;
`

const StyledMessageBox = styled.div`
    display: flex;
    width: 500;
    height: 300;
    padding: 30px;
    background-color: #0ebb65;
    border-radius: 20px;
`


function WinGameModal() {
    const { gameStatus, continueGame } = useContext(ModalContext);
    return (
        <StyledPosition isEnable={gameStatus === 1}>
            <StyledMessageBoxBorder>
                <StyledMessageBox onClick={continueGame}>
                    <pre>{"YOU WON!!!\n\nClick to continue to play"}</pre>
                </StyledMessageBox>
            </StyledMessageBoxBorder>
        </StyledPosition>
    );
}

export default WinGameModal;