"use client"
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ClockIcon, PauseCircleIcon, PlayCircleIcon, StopCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/catalyst-ui/button";


// LOL https://stackoverflow.com/questions/8105135/cannot-set-cookies-in-javascript
const Timer = () => {
    const FIFTEEN_MINUTES =  10 * 60; 
  
    const [secondsRemaining, setSecondsRemaining] = useState<number>();
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout>()
    const [timerState, setTimerState] = useState<"IDLE" | "START" | "PAUSE">()

    useEffect(() => {
        const cookieSecondsRemaining = Cookies.get("startTime");
        const cookieTimerState = Cookies.get("timerState");
        setSecondsRemaining(parseInt(cookieSecondsRemaining) || FIFTEEN_MINUTES)
        setTimerState(cookieTimerState || "IDLE")
        console.log("COOKIE STATE", cookieSecondsRemaining, cookieTimerState)
        if (timerState === "START") {
            start()
        }
        return () => clearInterval(timerInterval)
    }, [])

    const updateTimer = () => {
        if (secondsRemaining === 0) {
            reset()
        } else {
            setSecondsRemaining(prev => prev - 1);
        }
        // Store the current start time in the cookie
        Cookies.set("startTime", secondsRemaining, {expires: 1});
        const cookieSecondsRemaining = Cookies.get("startTime");
        const cookieTimerState = Cookies.get("timerState");
        console.log("COOKIE STATE", cookieSecondsRemaining, cookieTimerState)
      };

    function start() {
        setTimerState("START")
        clearInterval(timerInterval)
        const t = setInterval(updateTimer, 1000);
        setTimerInterval(t)
        Cookies.set("timerState", "START")
    }

    function pause() {
        setTimerState("PAUSE")
        clearInterval(timerInterval)
        Cookies.set("timerState", "PAUSE")
    }

    function reset() {
        setTimerState("IDLE")
        setSecondsRemaining(FIFTEEN_MINUTES)
        clearInterval(timerInterval)
        Cookies.set("timerState", "IDLE")
    }

    switch(timerState) {
        case "IDLE": return <div>
        <Button onClick={start}><ClockIcon/></Button>
      </div>
        case "START": return <div>
        <Button onClick={pause}><PauseCircleIcon/></Button>
        <h1>Timer: {secondsRemaining} seconds remaining</h1>
      </div>
        case "PAUSE": return <div>
        <Button onClick={start}><PlayCircleIcon/></Button>
        <Button onClick={reset}><StopCircleIcon/></Button>
        <h1>Timer: {secondsRemaining} seconds remaining</h1>
      </div>
    }
  };
  
  export default Timer;