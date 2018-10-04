import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {CSSTransition, TransitionGroup, Transition} from 'react-transition-group';
import anime from 'animejs';

class TabbedContainer extends Component {

  constructor(props) {
    super(props);
    this.tabsRef = React.createRef();
    this.state = {
      left: true,
      right: false,
      expanded: false,
      originalScrollTop: 0
    };

    this.onSelectLeft = this.onSelectLeft.bind(this);
    this.onSelectRight = this.onSelectRight.bind(this);
  }

  toggleExpand(cardElem, finalHeight) {
    const containerElem = ReactDOM.findDOMNode(this);
    const tabsHeight = this.tabsRef.current.offsetHeight;
    const heightDiff = containerElem.offsetHeight - finalHeight;
    const scrollTop = containerElem.scrollTop;

    if (!this.state.expanded) {
      anime({
        targets: cardElem,
        marginTop: [0, (heightDiff/2) + "px"],
        marginBottom: [0, (heightDiff/2) + "px"],
        duration: 800,
        easing: 'easeInOutQuart',
      });
      anime({
        targets: containerElem,
        scrollTop: cardElem.offsetTop + tabsHeight,
        duration: 800,
        easing: 'easeInOutQuart'
      });
    } else {
      anime({
        targets: cardElem,
        marginTop: 0,
        marginBottom: "1rem",
        duration: 800,
        easing: 'easeInOutQuart',
      });
      anime({
        targets: containerElem,
        scrollTop: this.state.originalScrollTop,
        duration: 800,
        easing: 'easeInOutQuart',
      });
    }

    this.setState(state => {
      return {
        expanded: !state.expanded,
        originalScrollTop: scrollTop
      };
    });

  }

  onSelectLeft() {
    this.setState(state => {
      return {
        left: true,
        right: false
      };
    });
  }

  onSelectRight() {
    this.setState(state => {
      return {
        left: false,
        right: true
      };
    });
  }

  render() {

    const leftSelected = this.state.left ? " selected" : "";
    const rightSelected = this.state.right ? " selected" : "";
    const GenericContainer = this.props.container;

    return (
      <div className={"tabbed-container" + (this.state.expanded ? " expanded" : "")}>
        <div ref={this.tabsRef} className="tabs">
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
            <GenericContainer>
              {React.Children.map(this.props.left, child => {
                return React.cloneElement(child, {
                  toggleExpand: this.toggleExpand.bind(this)
                });
              })}
            </GenericContainer>
          </div>
          <div className={"right" + rightSelected}>
            <GenericContainer>
              {this.props.right}
            </GenericContainer>
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
      this.setState(state => {
        return {loaded: true};
      });
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
    this.delay = 50;
  }

  getTimeout() {
  }

  render() {
    const {children, timeout} = this.props;
    const totalTimeout = (timeout || 200) + (this.delay * children.length - 1);

    let totalDelay = 0;

    return (
      <TransitionGroup
        className="container">
        {React.Children.map(children, child => {
          const transition = (
            <CSSTransition
              classNames="container-card"
              timeout={totalTimeout}
              appear>
              <div
                className="spacer"
                style={{
                  transitionDelay: totalDelay + "ms"
                }}>
                {child}
              </div>
            </CSSTransition>
          );
          totalDelay += this.delay;
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
    this.setState(state => {
      return {
        initialHeight: this.cardRef.current.offsetHeight,
        topHeight: this.topRef.current.offsetHeight,
        mounted: true
      };
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
          easing: 'easeInOutQuart'
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
    if (this.props.toggleExpand) {
      this.props.toggleExpand(
        this.cardRef.current,
        this.cardRef.current.scrollHeight + this.state.topHeight
      );
    }
    this.setState(state => {
      return {
        expanded: !state.expanded
      };
    });
  }

  render() {
    const style = {
      height: this.state.initialHeight || ""
    };
    return (
      <div
        className={"expanded-card"}
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
        <div className={"bottom" + (this.state.mounted ? " mounted" : "")} ref={this.bottomRef}>
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
            return <SimpleCard key={key}/>;
          });

          const expandedCards = [1, 2, 3, 4, 5, 6].map(key=>{
            return <ExpandedCard key={key} />;
          });

          return (
            <TabbedContainer
              left={expandedCards}
              right={simpleCards}
              container={Container}
              />
          );
        }}/>
      </div>
    );
  }
}

export default App;
