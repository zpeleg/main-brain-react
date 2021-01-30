import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function GuessButton(props) {
  console.log(props.options);

  const [choice, setChoice] = useState(0);
  function changeChoice() {
    let newChoice = choice + 1;
    if (newChoice == props.options.length) {
      newChoice = 0;
    }
    setChoice(newChoice)
  }
  return <button disabled={props.disabled} onClick={() => changeChoice()}>{props.options[choice]}</button>;
}

function SubmitButton(props){
  return <button onClick={()=>props.onClick()}>Submit</button>
}

function ChoiceRow(props) {
  console.log(props.options);
  return (
    <div>
      {(Array(props.guessCount).fill().map((i) => <GuessButton disabled={false} key={i} options={props.options} />))}
      <SubmitButton />
    </div>
  );
}

function App() {
  const options = [1, 2, 3, 4, "a"];
  return (
    <div className="App">
      <ChoiceRow guessCount={4} options={options} />
    </div>
  );
}

export default App;
