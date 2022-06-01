import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ModalContext } from "../../hooks/ModalContext";
import { SudokuCreator } from '@algorithm.ts/sudoku'

const StyledSudokuBundle = styled.div`
    display: flex;
    flex-direction: row;
`
const StyledKeyBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px;
    background-color: #191a15;
`
const StyledKeyBoxButton = styled.button`
    background-color: #442008;
    opacity: 1;
    z-index: 10;
    margin: 5px;
    border-radius: 5px;
    color: #f7c2e5;
    &:hover{
        scale: 0.95;
    }
`
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
    ${({ rowIndex }) => (rowIndex % 3 === 0) ? '10px' : '0px'} ${({ colIndex }) => (colIndex % 3 === 2) ? '10px' : '0px'} ${({ rowIndex }) => (rowIndex % 3 === 2) ? '10px' : '0px'} ${({ colIndex }) => (colIndex % 3 === 0) ? '10px' : '0px'}
    ;
    background-color : #0e2512;
`
const StyledSudokuCellBorder2 = styled.div<{ rowIndex: number, colIndex: number }>`
    padding: 
    ${({ rowIndex }) => (rowIndex % 3 !== 0) ? '5px' : '0px'} ${({ colIndex }) => (colIndex % 3 !== 2) ? '5px' : '0px'} ${({ rowIndex }) => (rowIndex % 3 !== 2) ? '5px' : '0px'} ${({ colIndex }) => (colIndex % 3 !== 0) ? '5px' : '0px'} ;
    background-color: #0a1e44;
`
const StyledSudokuCell = styled.div`
    width: 40px;
    height: 40px;
    padding: 10px;
    background-color: gray;
`
const StyledSudokuCellNumber = styled.div<{ cell:{error: number, number:number, default: boolean} }>`
    width: 20px;
    height: 20px;
    border-radius: 20px;
    padding: 10px;
    background-color: ${({ cell }) => cell.number === -1 ? '#e49732' : cell.default? '#442929': cell.error? '#ff0000' : '#9b5a06'};
    color: white;
`



function Sudoku(setNumberModalLocation: any) {
    const [table, setTable] = useState<{ number: number, error: number, default: boolean }[][]>(Array.from({ length: 9 }, (_, i) => Array.from({ length: 9 }, (_, i) => ({ number: -1, error: 0, default: false }))));
    // console.log(table);
    const { callModal, event } = useContext(ModalContext);

    const startGame = (complexity: number) => {
        if (complexity < 0 || complexity > 1)
            return;
        const creator = new SudokuCreator({ childMatrixSize: 3 })
        const { puzzle } = creator.createSudoku(complexity);
        setTable(puzzle.map((row) => row.map((number) => { return { number: number === -1 ? -1 : number + 1, error: 0, default: number === -1 ? false : true } })));

    };

    useEffect(() => {
        if (event.row === -1 || event.col === -1)
            return;
        setTable((oldTable) => {
            if (oldTable[event.row][event.col].default)
                return oldTable;

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
                            copy[base_i + i][base_j + j].error += 1;
                            seen_errors++;
                        }
                    }
                }
                copy[event.row][event.col].error = seen_errors - 3;

            }

            return copy;
        });

    }, [event]);

    return (
        <StyledSudokuBundle>
            <StyledKeyBox>
                {[{ name: 'easy', comp: 0.2 }, { name: 'medium', comp: 0.5 }, { name: 'hard', comp: 0.8 }, { name: 'insane', comp: 1 }].map((level, index) =>
                    <StyledKeyBoxButton onClick={() => startGame(level.comp)}>
                        {level.name}
                    </StyledKeyBoxButton>
                )}
            </StyledKeyBox>
            <StyledSudoku>
                {table.map((row, rowIndex) =>
                    <StyledSudokuRow key={rowIndex}>
                        {row.map((cell, colIndex) =>
                            <div key={colIndex}>
                                <StyledSudokuCellBorder1 colIndex={colIndex} rowIndex={rowIndex}>
                                    <StyledSudokuCellBorder2 colIndex={colIndex} rowIndex={rowIndex}>

                                        <StyledSudokuCell>
                                            <StyledSudokuCellNumber cell={cell} onClick={(event) => callModal(rowIndex, colIndex, event.currentTarget.getBoundingClientRect().x, event.currentTarget.getBoundingClientRect().y)} >
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
        </StyledSudokuBundle>
    );
}

export default Sudoku;