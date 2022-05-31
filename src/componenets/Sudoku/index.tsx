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
const StyledSudokuCellNumber = styled.div<{error:number}>`
    width: 20px;
    height: 20px;
    border-radius: 20px;
    padding: 10px;
    background-color: ${({error}) => (error)? '#ff0000':'#1e1e29'};
    color: white;
`

function Sudoku(setNumberModalLocation: any) {
    const [table, setTable] = useState<{ number: number, error: number }[][]>(Array.from({ length: 9 }, (_, i) => Array.from({ length: 9 }, (_, i) => ({ number: -1, error: 0 }))));
    // console.log(table);
    const { callModal, event } = useContext(ModalContext);
    
    useEffect(() => {
        if (event.row !== -1 && event.col !== -1) {
            setTable((oldTable) => {
                const old_value = oldTable[event.row][event.col].number;
                const new_value = event.value;

                let copy = [...oldTable];
                copy[event.row][event.col].number = event.value;

                console.log(new_value, old_value);
                if (new_value !== old_value) {
                    console.log("bleeding");

                    // remove old errors
                    for (let i = 0; i < 9; i++) {
                        if (copy[i][event.col].number === old_value) {
                            copy[i][event.col].error--;
                        }
                        if (copy[event.row][i].number === old_value) {
                            copy[event.row][i].error--;
                        }
                    }
                    const base_i = Math.floor(event.row / 3) * 3;
                    const base_j = Math.floor(event.col / 3) * 3;
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (oldTable[base_i + i][base_j + j].number === old_value) {
                                copy[base_i + i][base_j + j].error--;
                            }
                        }
                    }
                    // add new errors
                    let seen_errors = 0;
                    for (let i = 0; i < 9; i++) {
                        if (copy[i][event.col].number === new_value) {
                            copy[i][event.col].error++;
                            seen_errors++;
                        }
                        if (oldTable[event.row][i].number === new_value) {
                            copy[event.row][i].error++;
                            seen_errors++;
                        }
                    }
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (oldTable[base_i + i][base_j + j].number === new_value) {
                                copy[base_i + i][base_j + j].error+=1;
                                seen_errors++;
                            }
                        }
                    }
                    copy[event.row][event.col].error=seen_errors-3;

                }

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
                                            <StyledSudokuCellNumber error={cell.number !== -1 ? cell.error : 0} onClick={(event) => callModal(rowIndex, colIndex, event.currentTarget.getBoundingClientRect().x, event.currentTarget.getBoundingClientRect().y)} >
                                                {((cell.number === -1) ? "-" : `${cell.number}`)}
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