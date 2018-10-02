import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Loader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
  }

  start() {
    if (this.state.progress < 100) {
      this.setState({
        progress: this.state.progress + 1
      });
      setTimeout(this.start.bind(this), 10);
    }
  }

  render() {
    return (
      <div className="loader">
        {this.props.render({
          progress: this.state.progress,
          onClick: this.start.bind(this)
        })}
      </div>
    );
  }
}

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
        <Loader
          render={(props) => {
            return (
              <Button
                value="Load the App!"
                {...props}
                />
            );
          }}/>

      </div>
    );
  }
}

export default App;
