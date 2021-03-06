import "./App.css";
import { useState } from "react";
function noop() {}

const baseButtonStyle = {
  height: "3vh",
};

const buttonStyle = {
  ...baseButtonStyle,
  width: "3vh",
};

const submitStyle = {
  ...baseButtonStyle,
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
  return (
    <div>
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
    display: "inline",
  };
  switch (props.result) {
    case "exact":
      return <p style={resultStyle}>X</p>;
    case "correct":
      return <p style={resultStyle}>O</p>;
    case "incorrect":
      return <p style={resultStyle}>.</p>;
    default:
      throw Error("WTF");
  }
}

function PastGuess(props) {
  return (
    <div>
      {props.guess.map((g, i) => (
        <GuessButton key={i} enabled={false} choice={props.options[g]} />
      ))}
      {props.results.map((r, i) => (
        <GuessMark key={i} result={r} />
      ))}
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
      result.push("exact");
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
      result.push("incorrect");
    } else {
      result.push("correct");
      secretCopy[indexOf] = -1;
    }
  }
  return result;
}

function HiddenResult(props) {
  let row;
  if (!props.result) {
    row = Array(props.guessCount)
      .fill(0)
      .map((_) => <GuessButton enabled={false} choice="_" />);
  } else {
    row = props.result.map((r) => <GuessButton enabled={false} choice={r} />);
  }
  return <div>{row}</div>;
}

function App() {
  const GUESS_COUNT = 4;
  const options = ["b", 2, 3, 4, "a"];

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
        (a) => a === "exact"
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

  const outerStyle = {
    "text-align": "center",
    "vertical-align": "center",
    display: "flex",
  };

  const innerStyle = {
    margin: "auto",
    "text-align": "left",
  };

  return (
    <div className="App" style={outerStyle}>
      <div style={innerStyle}>
        <HiddenResult
          result={didWin ? guessHistory[guessHistory.length - 1].guess : null}
          guessCount={GUESS_COUNT}
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
        <p>{theSecret.map((x) => options[x])}</p>
      </div>
    </div>
  );
}

export default App;
