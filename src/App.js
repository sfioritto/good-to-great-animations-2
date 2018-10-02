import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {CSSTransition, TransitionGroup, Transition} from 'react-transition-group';

class Loader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      loaded: false
    };
  }

  start() {
    if (this.state.progress < 100) {
      this.setState({
        progress: this.state.progress + 1
      });
      setTimeout(this.start.bind(this), 10);
    } else {
      this.setState({loaded: true});
    }
  }

  unloaded() {
    return this.props.unloaded({
      progress: this.state.progress,
      onClick: this.start.bind(this)
    });
  }

  loaded() {
    return this.props.loaded();
  }

  render() {
    return (
      <Transition
        in={!this.state.loaded}
        timeout={300}>
        {(state) => {
          if (state === "exiting" ||
              state === "entered") {
            return (
              <div className={"loader unloaded " + (state == 'exiting' ? "loader-exit-active" : "")}>
                {this.unloaded()}
              </div>
            );

          } else {
            return this.loaded();
          }
        }}

      </Transition>
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

function Container(props) {
  return (
    <TransitionGroup
      className="container">
      {props.items.map(({key, child}) => {
        return (
          <CSSTransition
            key={key}
            {...props}>
            {child}
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
}

function SimpleCard(props) {
  return (
    <div className="simple-card">
      <div className="title"></div>
      <div className="sub-title"></div>
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <div className="app-frame">
        <Loader
          unloaded={(props) => {
            return (
              <Button
                value="Load the App!"
                {...props}
                />
            );
          }}
        loaded={(data) => {
          const items = [1, 2, 3, 4, 5, 6].map(key=>{
            return {
              key: key,
              child: (<SimpleCard />)
            };
          });
          return (
            <Container
              items={items}
              timeout={100}
              classNames="simple-card"
              appear
              />
          );
        }}/>
      </div>
    );
  }
}

export default App;
