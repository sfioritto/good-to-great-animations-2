import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function Button(props) {

  let innerJSX,
      classNames = "progress-bar-loader";

  if (props.progress === 0) {
    innerJSX = <span className="overlay">{props.value}</span>;
  } else if (props.progress === 100) {
    classNames += " loaded";
    innerJSX = "Success!";
  } else {
    classNames += " loading";
    innerJSX = (
      <span
        className="progress-bar"
        style = {{width: props.progress + "%"}}
        >
      </span>
    );
  }

  return (
    <button
      className={classNames}
      onClick={props.onClick}
      >
      {innerJSX}
    </button>
  );
}

class App extends Component {
  render() {
    return (
      <div className="app-frame">
      <Button
        value="Load the App!"
        progress={0}
        onClick={() => console.log("click")}
        />
      </div>
    );
  }
}

export default App;
