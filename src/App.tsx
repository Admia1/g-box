import Sudoku from './componenets/Sudoku';
import NumberModal from './componenets/NumberModal'
import { ModalContextProvider } from './hooks/ModalContext';
import './App.css';
import WinGameModal from './componenets/WinGameModal';

function App() {

  return (
    <>
      <ModalContextProvider>
          <NumberModal />
          <WinGameModal />
          <Sudoku />
      </ModalContextProvider>
    </>
  );
}

export default App;
