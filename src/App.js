import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {CSSTransition, TransitionGroup, Transition} from 'react-transition-group';

class TabbedContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      left: true,
      right: false
    };
  }

  render() {

    const leftSelected = this.state.left ? " selected" : "";
    const rightSelected = this.state.right ? " selected" : "";

    return (
      <div className="tabbed-container">
        <div className="tabs">
          <CSSTransition
            in={this.state.left}
            timeout={200}
            classNames="left"
            appear
            >
            <div className={"left" + leftSelected}>
              <div
                className="button"
                onClick={() => this.setState({left: true, right: false})}
                ></div>
            </div>
          </CSSTransition>
          <CSSTransition
            in={this.state.right}
            timeout={200}
            classNames="right"
            >
            <div className={"right" + rightSelected}>
              <div
                className="button"
                onClick={() => this.setState({left: false, right: true})}
                ></div>
            </div>
          </CSSTransition>
        </div>
        <div className="containers">
          <div className={"left" + leftSelected}>
            {this.props.children[0]}
          </div>
          <div className={"right" + rightSelected}>
            {this.props.children[1]}
          </div>
        </div>
      </div>
    );
  }
}

class Loader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      loaded: true
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

  render() {
    return (
      <Transition
        in={!this.state.loaded}
        timeout={300}>
        {(state) => {
          if (state === "exiting" ||
              state === "entered") {
            return (
              <div className={"loader unloaded" + (state == 'exiting' ? " loader-exit-active" : "")}>
                {this.props.button(
                  this.state.progress,
                  this.start.bind(this)
                )}
              </div>
            );

          } else {
            return this.props.loaded();
          }
        }}

      </Transition>
    );
  }
}

function ProgressBarButton(props) {

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

class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleExpand(element) {
    console.log(element);
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const {items, ...animationProps} = this.props;
    const delay = 30;
    const timeout = (animationProps.timeout || 200) + (delay * items.length - 1);
    let totalDelay = 0;

    return (
      <TransitionGroup
        className={"container" + (this.state.expanded ? " expanded" : "")}>
        {items.map(({key, child}) => {
          const transition = (
            <CSSTransition
              key={key}
              {...animationProps}
              timeout={timeout}>
              {React.cloneElement(child, {
                style: {transitionDelay: totalDelay + "ms"},
                toggleExpand: this.toggleExpand.bind(this)
              })}
            </CSSTransition>
          );
          totalDelay += delay;
          return transition;
        })}
      </TransitionGroup>
    );
  }
}

function SimpleCard(props) {
  return (
    <div className="simple-card">
      <div className="title"></div>
      <div className="sub-title"></div>
    </div>
  );
}

function ExpandedCard(props) {
  const cardRef = React.createRef();
  return (
    <div className="expanded-card" ref={cardRef}>
      <div
        className="top"
        onClick={() => props.toggleExpand(cardRef.current)}
        >
      </div>
      <div className="middle">
        <div className="title"></div>
        <div className = "sub-title"></div>
      </div>
      <div className="bottom">
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <div className="app-frame">
        <Loader
          button={(progress, onClick) => {
            return (
              <ProgressBarButton
                value="Load the App!"
                progress={progress}
                onClick={onClick}
                />
            );
          }}
        loaded={(data) => {

          const simpleCards = [1, 2, 3, 4, 5, 6].map(key=>{
            return {
              key: key,
              child: <SimpleCard />
            };
          });

          const expandedCards = [1, 2, 3, 4, 5, 6].map(key=>{
            return {
              key: key,
              child: <ExpandedCard />
            };
          });

          return (
            <TabbedContainer>
              <Container
                items={simpleCards}
                classNames="simple-card"
                appear
              />
              <Container
                items={expandedCards}
                classNames="simple-card"
                appear
                />
            </TabbedContainer>
          );
        }}/>
      </div>
    );
  }
}

export default App;
