import React, { useState, useEffect } from 'react';

function CountdownTimerForAuction({ endTime, placeBidModal=true }) {
    const targetDate = new Date(endTime).getTime();
    const initialCountdown = Math.max(targetDate - Date.now(), 0);
    const [countdown, setCountdown] = useState(initialCountdown);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const timeLeft = targetDate - now;

            if (timeLeft <= 0) {
                clearInterval(interval);
                setCountdown(0);
            } else {
                setCountdown(timeLeft);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [targetDate]);

    const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

    return (
        <div>
            {/* <p>{days || 0} days, {hours || 0} hours, {minutes || 0} minutes, {seconds || 0} seconds</p> */}
            {placeBidModal ? <div className="timer_container">
                <div className="hr_box time_box">
                    <div className="time">{hours || 0}</div>
                    <div className="value">Hours</div>
                </div>
                <div className="min_box time_box">
                    <div className="time">{minutes || 0}</div>
                    <div className="value">Minutes</div>
                </div>
                <div className="sec_box time_box">
                    <div className="time">{seconds || 0}</div>
                    <div className="value">Seconds</div>
                </div>
            </div>
                :
                <div>
                    <span>{hours}</span> H <span>{minutes}</span> M <span>{seconds}</span> S
                </div>
            }
        </div>
    );
}

export default CountdownTimerForAuction;
