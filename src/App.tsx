import Sudoku from './componenets/Sudoku';
import NumberModal from './componenets/NumberModal'
import { ModalContextProvider } from './hooks/ModalContext';
import './App.css';
import WinGameModal from './componenets/WinGameModal';
import styled from 'styled-components';

const DisplayWrapper = styled.div`
    display: flex;
    width: 100%;
    background-color: #817878;
    align-items: center;
    justify-content: center;
`


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
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
