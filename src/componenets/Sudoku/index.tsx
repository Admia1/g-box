import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ModalContext } from "../../hooks/ModalContext";


const StyledSudoku = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #e69a9a;
    justify-content: space-around;
`

const StyledSudokuRow = styled.div`
    display: flex;
    flex-direction: row;
`
const StyledSudokuCellBorder1 = styled.div<{ rowIndex: number, colIndex: number }>`
    padding: 
    ${({ rowIndex }) => (rowIndex % 3 === 0) ? '10px' : '0px'}
    ${({ colIndex }) => (colIndex % 3 === 2) ? '10px' : '0px'} 
    ${({ rowIndex }) => (rowIndex % 3 === 2) ? '10px' : '0px'}
    ${({ colIndex }) => (colIndex % 3 === 0) ? '10px' : '0px'} 
    ;
    background-color : #0e2512;
`
const StyledSudokuCellBorder2 = styled.div<{ rowIndex: number, colIndex: number }>`
    padding: 
    ${({ rowIndex }) => (rowIndex % 3 !== 0) ? '5px' : '0px'}
    ${({ colIndex }) => (colIndex % 3 !== 2) ? '5px' : '0px'} 
    ${({ rowIndex }) => (rowIndex % 3 !== 2) ? '5px' : '0px'}
    ${({ colIndex }) => (colIndex % 3 !== 0) ? '5px' : '0px'} 
    ;
    background-color: #0a1e44;
`
const StyledSudokuCell = styled.div`
    width: 40px;
    height: 40px;
    padding: 10px;
    background-color: gray;
`
const StyledSudokuCellNumber = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 20px;
    padding: 10px;
    background-color: #1e1e29;
    color: white;
`

function Sudoku(setNumberModalLocation:any) {
    const [table, setTable] = useState<number[][]>(Array.from({ length: 9 }, (_, i) => Array.from({ length: 9 }, (_, i) => -1)));
    // console.log(table);
    const { callModal , event } = useContext(ModalContext);

    useEffect(() => {
        if(event.row !== -1 && event.col !== -1){
            setTable((oldTable) => {
                let copy = [...oldTable];
                copy[event.row][event.col] = event.value;
                return copy;
            });
        }
    }, [event]);

    return (
        <>
        <StyledSudoku>
            {table.map((row, rowIndex) =>
                <StyledSudokuRow key={rowIndex}>
                    {row.map((cell, colIndex) =>
                        <div key={colIndex}>
                            <StyledSudokuCellBorder1 colIndex={colIndex} rowIndex={rowIndex}>
                                <StyledSudokuCellBorder2 colIndex={colIndex} rowIndex={rowIndex}>

                                    <StyledSudokuCell>
                                        <StyledSudokuCellNumber onClick={(event) => callModal(rowIndex,colIndex,event.currentTarget.getBoundingClientRect().x ,event.currentTarget.getBoundingClientRect().y )} >
                                            {((cell === -1) ? "-" : cell)}
                                        </StyledSudokuCellNumber>
                                    </StyledSudokuCell>
                                </StyledSudokuCellBorder2>
                            </StyledSudokuCellBorder1>
                        </div>
                    )}
                </StyledSudokuRow>
            )}
        </StyledSudoku>
        </>
    );
}

export default Sudoku;