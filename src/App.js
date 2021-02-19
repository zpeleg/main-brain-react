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
  return (
    <div>
      {(range(props.guessCount).map((i) =>
        <GuessButton
          enabled={props.enabled}
          key={i}
          choice={props.choices[i]}
          onClick={() => props.changeChoice(i)} />))}
      {props.enabled ? <SubmitButton onClick={() => props.submit()} /> : (null)}
    </div>
  );
}

function GuessMark(props) {
  switch (props.success) {
    case "exact":
      return <p>X</p>
    case "correct":
      return <p>O</p>
    case "incorrect":
      return <p>.</p>
  }
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
      {/* {props.guessHistory.map((g) => <p>{g}</p>)} */}
    </div>
  )
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function App() {
  const GUESS_COUNT = 4
  const options = ["b", 2, 3, 4, "a"];

  // Not sure this is the correct way to do this, but it's a cool hack
  const [theGuess, _] = useState(Array(GUESS_COUNT).fill().map(() => getRandomInt(options.length)))

  const [guessHistory, setGuessHistory] = useState([])
  function showGuess() {
    const newGuessHistory = guessHistory.slice().concat([choices.slice()])
    setGuessHistory(newGuessHistory)
  }

  const [choices, setChoices] = useState(Array(GUESS_COUNT).fill(0))
  function changeChoice(idx) {
    let c = choices[idx] + 1
    if (c === options.length) {
      c = 0
    }
    let newChoices = choices.slice()
    newChoices[idx] = c
    setChoices(newChoices)
  }

  return (
    <div className="App">
      <GuessContainer guessHistory={guessHistory} options={options} />
      <ChoiceRow
        guessCount={GUESS_COUNT}
        enabled={true}
        options={options}
        changeChoice={changeChoice}
        submit={() => showGuess()}
        choices={choices.map((i)=>options[i])} />
    </div>
  );
}

export default App;
