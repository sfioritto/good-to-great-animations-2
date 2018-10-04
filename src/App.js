import React, { Component } from 'react';
import './App.css';
import {CSSTransition, TransitionGroup, Transition} from 'react-transition-group';
import anime from 'animejs';

class TabbedContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      left: true,
      right: false
    };

    this.onSelectLeft = this.onSelectLeft.bind(this);
    this.onSelectRight = this.onSelectRight.bind(this);
  }

  onSelectLeft() {
    this.setState({left: true, right: false});
  }

  onSelectRight() {
    this.setState({left: false, right: true});
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
                onClick={this.onSelectLeft}
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
                onClick={this.onSelectRight}
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
      loaded: false
    };

    this.start = this.start.bind(this);
  }

  start() {
    if (this.state.progress < 100) {
      this.setState(state => ({
        progress: state.progress + 1
      }));
      setTimeout(this.start, 10);
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
              <div className={"loader unloaded" + (state === 'exiting' ? " loader-exit-active" : "")}>
                {this.props.button(
                  this.state.progress,
                  this.start
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

  let buttonContent,
      classNames = "progress-bar-loader";

  if (props.progress === 0) {
    buttonContent = <span className="overlay">{props.value}</span>;
  } else if (props.progress === 100) {
    classNames += " loaded";
    buttonContent = "Success!";
  } else {
    classNames += " loading";
    buttonContent = (
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
      {buttonContent}
    </button>
  );
}

class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      loadAnimationFinished: false
    };
  }

  toggleExpand(element) {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const {items, ...animationProps} = this.props;
    const delay = 50;
    const timeout = (animationProps.timeout || 200) + (delay * items.length - 1);
    let totalDelay = 0;

    setTimeout(() => {
      this.setState({loadAnimationFinished: true});
    }, timeout);

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
                style: this.state.loadAnimationFinished ? {} : {transitionDelay: totalDelay + "ms"},
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
    <div className="simple-card" style={props.style}>
      <div className="title"></div>
      <div className="sub-title"></div>
    </div>
  );
}

class ExpandedCard extends Component {

  constructor(props) {
    super(props);
    this.cardRef = React.createRef();
    this.bottomRef = React.createRef();
    this.topRef = React.createRef();
    this.state = {
      expanded: false,
      initialHeight: 0,
      mounted: false
    };
  }

  componentDidMount() {
    this.setState({
      initialHeight: this.cardRef.current.offsetHeight,
      topHeight: this.topRef.current.offsetHeight,
      mounted: true
    });
  }

  componentDidUpdate(prevProps, prevState) {

    const cardElem = this.cardRef.current;
    const bottomElem = this.bottomRef.current;
    const topElem = this.topRef.current;
    if (prevState.expanded !== this.state.expanded) {

      if (this.state.expanded) {
        anime({
          targets: cardElem,
          height: [this.state.initialHeight, cardElem.scrollHeight + this.state.topHeight],
          duration: 800,
          easing: 'easeInOutQuart',
        });
        anime({
          targets: bottomElem,
          opacity: [0, 1],
          duration: 800,
          easing: 'easeInOutQuart',
        });
        anime({
          targets: topElem,
          height: this.state.topHeight * 2,
          duration: 800,
          easing: 'easeInOutQuart',
        });
      } else {
         anime({
           targets: cardElem,
           height: [this.state.initialHeight],
           duration: 800,
           easing: 'easeInOutQuart',
         });
        anime({
          targets: bottomElem,
          opacity: 0,
          duration: 800,
          easing: 'easeInOutQuart',
        });
        anime({
          targets: topElem,
          height: this.state.topHeight,
          duration: 800,
          easing: 'easeInOutQuart',
        });
      }
    }
  }

  toggleExpand() {
    this.props.toggleExpand(this.cardRef.current);
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const style = {
      height: this.state.initialHeight || "",
      transitionDelay: this.props.style.transitionDelay
    };
    return (
      <div
        className={"expanded-card" + (this.state.mounted ? " mounted" : "")}
        ref={this.cardRef}
        style={style}>
        <div
          className="top"
          onClick={this.toggleExpand.bind(this)}
          ref={this.topRef}
          >
        </div>
        <div className="middle">
          <div className="title"></div>
          <div className = "sub-title"></div>
        </div>
        <div className="bottom" ref={this.bottomRef}>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
    );
  }
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
                classNames="container-card"
                appear
                />
              <Container
                items={expandedCards}
                classNames="container-card"
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
