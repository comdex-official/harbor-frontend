import { useEffect, useState } from "react";
import { getTransactionTimeFromHeight } from "../../services/transaction";
import moment from "moment";

const Date = ({ height }) => {
  const [timestamp, setTimestamp] = useState();

  useEffect(() => {
    if (height) {
      fetchData();
    }
  }, [height]);

  const fetchData = async () => {
    const trasactionTime = await getTransactionTimeFromHeight(height);
    console.log(trasactionTime, "time");
    if (trasactionTime) {
      setTimestamp(trasactionTime);
    }
  };

  return (
    <div className="dates-col">
      <div className="dates">
        {moment.utc(timestamp).local().startOf("seconds").fromNow()}
      </div>
      <small>{moment(timestamp).format("MMM DD, YYYY HH:mm")}</small>
    </div>
  );
};

export default Date;
