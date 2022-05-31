import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { ModalContext } from "../../hooks/ModalContext";


const StyledPosition = styled.div<{isEnable:boolean, location:{x:number, y:number}}>`
    ${({isEnable})=> isEnable? '':'display : none;'};
    position: absolute;
    width: 100%;
    height: 100%;
    padding: ${({location})=>location.y && location.y-20}px 0px 0px ${({location})=>location.x && location.x-20}px;
`
const StyledNumberBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 80px;
    height: 80px;
    align-items: center;
    justify-content: space-between;
`
const StyledRow = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`

const StyledCell = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 10px;
    padding:  5px 5px 5px 5px;
    background-color: #1e1e29;
    opacity: 0.25;
    color: white;
    transition: 2s;
    cursor: pointer;
    
    &:hover{
        scale: 2;
        opacity: 0.75;
        background-color: #802d75;
    }
`


function NumberModal() {
    const numbers = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

    const { location, callModal, chooseNumber } = useContext(ModalContext);

    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    console.log(isEnabled);
    useEffect(() => {
        if(location.x !== 0 && location.y !== 0){
            setIsEnabled(true);
        }
        else{
            setIsEnabled(false);
        }
    }, [location, setIsEnabled]);


    return (
        
        <StyledPosition isEnable={isEnabled} location={location} onClick={()=>callModal(-1,-1,0,0)} >
            <StyledNumberBox>
                {numbers.map((row, rowIndex) =>
                    <StyledRow key={rowIndex}>
                        {row.map((number, colIndex) =>
                            <StyledCell key={colIndex} >
                                <div onClick={(event) => {event.stopPropagation();chooseNumber(number)}}>
                                    {number}
                                </div>
                            </StyledCell>
                        )}
                    </StyledRow>
                )}
            </StyledNumberBox>
        </StyledPosition>
    )
}

export default NumberModal