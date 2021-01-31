import './App.css';
import { useState } from 'react';
function noop() { }

function GuessButton(props) {
  return <button enabled={!props.disabled} onClick={() => (props.onClick ?? noop)()}>{props.choice}</button>
}

function SubmitButton(props) {
  return <button onClick={() => props.onClick()}>Submit</button>
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}


function ChoiceRow(props) {
  const [choices, setChoices] = useState(Array(props.guessCount).fill(0))
  console.log(choices)
  function changeChoice(idx) {
    let c = choices[idx] + 1
    if (c === props.options.length) {
      c = 0
    }
    let newChoices = choices.slice()
    newChoices[idx] = c
    setChoices(newChoices)
  }
  function submitChoices() {
    props.submitGuess(choices)
  }
  return (
    <div>
      {(range(props.guessCount).map((i) =>
        <GuessButton
          enabled={props.enabled}
          key={i}
          choice={props.options[choices[i]]}
          onClick={() => changeChoice(i)} />))}
      {props.enabled ? <SubmitButton onClick={() => submitChoices()} /> : (null)}
    </div>
  );
}

function PastGuess(props) {
  return (
    <div>
      {props.guess.map((g) => <GuessButton enabled={false} choice={props.options[g]} />)}
    </div>
  )
}

function GuessContainer(props) {
  return (
    <div>
      {props.guessHistory.map((g) => <PastGuess guess={g} options={props.options} />)}
    </div>
  )
}

function App() {
  const options = [1, 2, 3, 4, "a"];
  const [guessHistory, setGuessHistory] = useState([])
  function showGuess(guess) {
    const newGuessHistory = guessHistory.slice().concat([guess])
    setGuessHistory(newGuessHistory)
    console.log(guess)
  }
  return (
    <div className="App">
      <GuessContainer guessHistory={guessHistory} options={options} />
      <ChoiceRow guessCount={4} enabled={true} options={options} submitGuess={(x) => showGuess(x)} />
    </div>
  );
}

export default App;
