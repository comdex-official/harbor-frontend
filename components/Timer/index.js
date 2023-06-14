import { useTimer } from "react-timer-hook";

const Timer = ({ expiryTimestamp }) => {
  const { seconds, minutes, hours } = useTimer({ expiryTimestamp });

  return (
    <div>
      <span>{hours}</span> H <span>{minutes}</span> M <span>{seconds}</span> S
    </div>
  );
};

export default Timer;
