import './App.css';
import { useState } from 'react';
function noop() {}

/*
TODO:
* Fix bug wherebthe results are not ordered correctly (need to add sort) - possibly fix this by adding an enum
* Make the entire thing a fixed table that grows from the bottom to the top, maybe chnage colors of buttons to indicate that they are unfilled
* Change letters to colors
* Add help tooltip
* Add settings menu
* Fix the alignment breaking when the submit button disappears
*/

const baseButtonStyle = {
  height: '4vh',
  'font-size': '2.5vh',
};

const buttonStyle = {
  ...baseButtonStyle,
  width: '4vh',
};

const submitStyle = {
  ...baseButtonStyle,
  align: 'middle',
};

function GuessButton(props) {
  return (
    <button
      enabled={(!props.disabled).toString()}
      onClick={() => (props.onClick ?? noop)()}
      style={buttonStyle}
    >
      {props.choice}
    </button>
  );
}

function SubmitButton(props) {
  return (
    <button onClick={() => props.onClick()} style={submitStyle}>
      Submit
    </button>
  );
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

function ChoiceRow(props) {
  const style = {
    position: 'fixed',
    bottom: '10px',
  };
  return (
    <div style={style}>
      {range(props.guessCount).map((i) => (
        <GuessButton
          enabled={props.enabled}
          key={i}
          choice={props.choices[i]}
          onClick={() => props.changeChoice(i)}
        />
      ))}
      {props.enabled ? <SubmitButton onClick={() => props.submit()} /> : null}
    </div>
  );
}

function GuessMark(props) {
  const resultStyle = {
    display: 'inline-block',
  };
  switch (props.result) {
    case 'exact':
      return <i className="base-icon gg-block" style={resultStyle}></i>;
    case 'correct':
      return <i className="base-icon gg-unblock" style={resultStyle}></i>;
    case 'incorrect':
      return <i className="base-icon gg-circle" style={resultStyle}></i>;
    default:
      throw Error('WTF');
  }
}

function PastGuess(props) {
  const ggg = {
    display: 'inline-block',
  };
  const parent = {};
  return (
    <div style={parent}>
      <div style={ggg}>
        {props.guess.map((g, i) => (
          <GuessButton key={i} enabled={false} choice={props.options[g]} />
        ))}
      </div>
      <div style={ggg}>
        {props.results.map((r, i) => (
          <GuessMark key={i} result={r} />
        ))}
      </div>
    </div>
  );
}

function GuessContainer(props) {
  return (
    <div>
      {props.guessHistory.map((g, i) => (
        <PastGuess
          key={i}
          guess={g.guess}
          results={g.result}
          options={props.options}
        />
      ))}
    </div>
  );
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function calculateResult(secret, guess) {
  // This code has no tests, it is a copy of the tested code from the other main brain and hopefully it works XD
  // https://github.com/zpeleg/MainBrain/blob/main/app/src/main/java/ninja/ziv/mainbrain/GameManager.kt#L60
  let secretCopy = secret.slice();
  let guessCopy = guess.slice();
  let result = [];
  for (let i = 0; i < secretCopy.length; i++) {
    if (secretCopy[i] === guessCopy[i]) {
      result.push('exact');
      secretCopy[i] = -1;
      guessCopy[i] = -1;
    }
  }
  for (let i = 0; i < secretCopy.length; i++) {
    if (guessCopy[i] === -1) {
      continue;
    }
    let indexOf = secretCopy.indexOf(guessCopy[i]);
    if (indexOf === -1) {
      result.push('incorrect');
    } else {
      result.push('correct');
      secretCopy[indexOf] = -1;
    }
  }
  return result;
}

function HiddenResult(props) {
  return (
    <div>
      {props.result.map((r) => (
        <GuessButton enabled={false} choice={r} />
      ))}
    </div>
  );
}

function App() {
  const GUESS_COUNT = 4;
  const options = ['a', 'b', 'c', 'd'];

  // This doesn't work correctly with React.StrictMode
  const [theSecret, _] = useState(
    Array(GUESS_COUNT)
      .fill()
      .map(() => getRandomInt(options.length))
  );

  const [guessHistory, setGuessHistory] = useState([]);
  const [didWin, setDidWin] = useState(false);
  function showGuess() {
    const newGuessHistory = guessHistory.slice().concat([
      {
        guess: choices.slice(),
        result: calculateResult(theSecret, choices),
      },
    ]);
    setGuessHistory(newGuessHistory);
    if (
      newGuessHistory[newGuessHistory.length - 1].result.every(
        (a) => a === 'exact'
      )
    ) {
      setDidWin(true);
    }
  }

  const [choices, setChoices] = useState(Array(GUESS_COUNT).fill(0));
  function changeChoice(idx) {
    let c = choices[idx] + 1;
    if (c === options.length) {
      c = 0;
    }
    let newChoices = choices.slice();
    newChoices[idx] = c;
    setChoices(newChoices);
  }

  return (
    <div className="first-container">
      <div className="my-window">
        <h1>Main Brain</h1>
        <HiddenResult
          result={
            didWin
              ? guessHistory[guessHistory.length - 1].guess.map(
                  (g) => options[g]
                )
              : Array(GUESS_COUNT).fill('_')
          }
        />
        <GuessContainer s guessHistory={guessHistory} options={options} />
        <ChoiceRow
          guessCount={GUESS_COUNT}
          enabled={!didWin}
          options={options}
          changeChoice={changeChoice}
          submit={() => showGuess()}
          choices={choices.map((i) => options[i])}
        />
        {/* <p>{theSecret.map((x) => options[x])}</p> */}
      </div>
    </div>
  );
}

export default App;
