import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaUndo } from "react-icons/fa";
import { Container, Row, Col, Button } from "react-bootstrap";
import sound from "../src/ding.mp3";


import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            audioRef.current.play();
            console.log(audioRef.current);
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              alert("Time to get back to work!");
              return sessionLength * 60;
            }
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, breakLength, sessionLength, timerLabel]);

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength((prevBreakLength) => prevBreakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength((prevBreakLength) => prevBreakLength + 1);
    }
    else {
      setBreakLength(60);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength((prevSessionLength) => prevSessionLength - 1);
      setTimeLeft((prevTimeLeft) => (prevTimeLeft - 60 >= 0 ? prevTimeLeft - 60 : 0));
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength((prevSessionLength) => prevSessionLength + 1);
      setTimeLeft((prevTimeLeft) => prevTimeLeft + 60);
    }
  };

  const handleStartStop = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const handleReset = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <h1>Pomodoro Clock</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <div id="break-label">Break Length</div>
            <div className="length-controls">
              <Button id="break-decrement" onClick={handleBreakDecrement}>
                -
              </Button>
              <div id="break-length">{breakLength}</div>
              <Button id="break-increment" onClick={handleBreakIncrement}>
                +
              </Button>
            </div>
          </Col>
          <Col>
            <div id="session-label">Session Length</div>
            <div className="length-controls">
              <Button id="session-decrement" onClick={handleSessionDecrement}>
                -
              </Button>
              <div id="session-length">{sessionLength}</div>
              <Button id="session-increment" onClick={handleSessionIncrement}>
                +
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div id="timer-label">{timerLabel}</div>
            <div id="time-left">{formatTime(timeLeft)}</div>
            <Button id="start_stop" onClick={handleStartStop}>
              {isRunning ? <FaPause /> : <FaPlay />}
            </Button>
            <Button id="reset" onClick={handleReset}>
              <FaUndo />
            </Button>
          </Col>
        </Row>
      </Container>
      <audio id="beep" ref={audioRef} src={sound} />
    </div>
  );
}

export default App;
