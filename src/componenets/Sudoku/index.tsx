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
    color: #f7c2e5;
    border-radius: 5px;
    margin: 5px;
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
    padding: 5px;
    background-color: gray;
`
const StyledSudokuCellNumber = styled.div<{ cell: { error: number, number: number, default: boolean } }>`
    width: 15px;
    height: 15px;
    border-radius: 20px;
    padding: 10px;
    background-color: ${({ cell }) => cell.number === -1 ? '#e49732' : cell.default ? '#442929' : cell.error ? '#ff0000' : '#9b5a06'};
    color: white;
`



function Sudoku(setNumberModalLocation: any) {
    const [table, setTable] = useState<{ meta: { empty: number, error: number }, array: { number: number, error: number, default: boolean }[][] }>({
        meta: { empty: 81, error: 0 },
        array: Array.from({ length: 9 }, (_, i) => Array.from({ length: 9 }, (_, i) => ({ number: -1, error: 0, default: false })))
    });
    const { callModal, event, winGame } = useContext(ModalContext);

    const startGame = (complexity: number) => {
        if (complexity < 0 || complexity > 1)
            return;
        const creator = new SudokuCreator({ childMatrixSize: 3 })
        const { puzzle } = creator.createSudoku(complexity);
        const array = puzzle.map((row) => row.map((number) => { return { number: number === -1 ? -1 : number + 1, error: 0, default: number === -1 ? false : true } }))
        const meta = {
            empty: array.reduce((s, r) => s + r.filter((c) => c.number === -1).length, 0),
            error: 0,
        }
        setTable({ meta: meta, array: array });

    };

    useEffect(() => {
        if (event.row === -1 || event.col === -1)
            return;
        setTable((table) => {
            const oldArray = table.array;
            if (oldArray[event.row][event.col].default)
                return table;

            const oldValue = oldArray[event.row][event.col].number;
            const newValue = event.value;
            if (oldValue === newValue)
                return table;

            let newArray = [...table.array];
            let newMeta = { empty: table.meta.empty, error: table.meta.error };
            newArray[event.row][event.col].number = event.value;

            if (oldValue !== -1) {
                newMeta.error -= oldArray[event.row][event.col].error;
            }

            if (oldValue === -1) {
                newMeta.empty--;
            }
            if (newValue === -1) {
                newMeta.empty++;
            }

            if (newValue !== oldValue) {

                // remove old errors
                for (let i = 0; i < 9; i++) {
                    if (newArray[i][event.col].number === oldValue) {
                        newArray[i][event.col].error--;
                    }
                    if (newArray[event.row][i].number === oldValue) {
                        newArray[event.row][i].error--;
                    }
                }
                const base_i = Math.floor(event.row / 3) * 3;
                const base_j = Math.floor(event.col / 3) * 3;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (oldArray[base_i + i][base_j + j].number === oldValue) {
                            newArray[base_i + i][base_j + j].error--;
                        }
                    }
                }
                // add new errors
                let seen_errors = 0;
                for (let i = 0; i < 9; i++) {
                    if (newArray[i][event.col].number === newValue) {
                        newArray[i][event.col].error++;
                        seen_errors++;
                    }
                    if (newArray[event.row][i].number === newValue) {
                        newArray[event.row][i].error++;
                        seen_errors++;
                    }
                }
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (newArray[base_i + i][base_j + j].number === newValue) {
                            newArray[base_i + i][base_j + j].error += 1;
                            seen_errors++;
                        }
                    }
                }
                newArray[event.row][event.col].error = seen_errors - 3;

            }
            if (newValue !== -1)
                newMeta.error += newArray[event.row][event.col].error;

            const newTable = { meta: newMeta, array: newArray };
            console.log(newMeta);
            if (newMeta.empty === 0 && newMeta.error === 0){
                winGame();
            }
            return newTable;
        });

    }, [event, winGame]);

    return (
        <StyledSudokuBundle>
            <StyledKeyBox>
                {[{ name: 'noob', comp: 0 }, { name: 'easy', comp: 0.2 }, { name: 'medium', comp: 0.5 }, { name: 'hard', comp: 0.8 }, { name: 'insane', comp: 1 }].map((level, index) =>
                    <StyledKeyBoxButton key={index} onClick={() => startGame(level.comp)}>
                        {level.name}
                    </StyledKeyBoxButton>
                )}
            </StyledKeyBox>
            <StyledSudoku>
                {table.array.map((row, rowIndex) =>
                    <StyledSudokuRow key={rowIndex}>
                        {row.map((cell, colIndex) =>
                            <div key={colIndex}>
                                <StyledSudokuCellBorder1 colIndex={colIndex} rowIndex={rowIndex}>
                                    <StyledSudokuCellBorder2 colIndex={colIndex} rowIndex={rowIndex}>

                                        <StyledSudokuCell>
                                            <StyledSudokuCellNumber cell={cell} onClick={(event) => {const loc=event.currentTarget.getBoundingClientRect();callModal(rowIndex, colIndex, loc.x, loc.y)}} >
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