import React, { createContext, PropsWithChildren, useState } from 'react';


export const ModalContext = createContext<{
    location: { row: number; col: number; x: number; y: number; };
    callModal: (row: number, col: number, x: number, y: number) => void;
    chooseNumber: (number: number) => void;
    event: { row: number, col: number, value: number };
    gameStatus: number;
    winGame: ()=>void;
    continueGame: ()=>void;
}>({
    location: { row: -1, col: -1, x: 0, y: 0 },
    callModal: (row, call, x, y) => { },
    chooseNumber: (number) => { },
    event: { row: -1, col: -1, value: -1 },
    gameStatus: 0,
    winGame: ()=>{},
    continueGame: ()=>{},
});

export function ModalContextProvider({ children }: PropsWithChildren<{}>) {
    const [location, setLocation] = useState<{ x: number, y: number, row: number, col: number }>({ x: 0, y: 0, row: -1, col: -1 });
    const [event, setEvent] = useState<{ row: number, col: number, value: number }>({ row: -1, col: -1, value: -1 });
    
    const [gameStatus, setGameStatus] = useState<number>(0);
    const winGame = ()=>{
        setGameStatus(1);
    }
    const callModal = (row: number, col: number, x: number, y: number) => {
        setLocation({ row, col, x, y });
    }
    const chooseNumber = (number: number) => {
        if (number !== -1 && (number < 1 || number > 9))
            return;
        if (location.row < 0 || location.row > 8)
            return;
        if (location.col < 0 || location.col > 8)
            return;

        setEvent({ row: location.row, col: location.col, value: number });
        setLocation({ row: -1, col: -1, x: 0, y: 0 });
    }
    const continueGame = ()=>{
        setGameStatus(0);
    }

    return (
        <ModalContext.Provider value={{ location, callModal, chooseNumber, event, gameStatus, winGame, continueGame }}>
            {children}
        </ModalContext.Provider>
    );
}