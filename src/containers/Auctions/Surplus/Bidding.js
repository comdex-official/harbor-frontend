import { Table, Button } from "antd";
import { SvgIcon } from "../../../components/common";
import { iconNameFromDenom } from "../../../utils/string";
import { denomConversion, amountConversion } from "../../../utils/coin";
import TooltipIcon from "../../../components/TooltipIcon";
import moment from "moment";

export const Bidding = ({ biddingList }) => {
  const columnsBidding = [
    {
      title: (
          <>
            Outflow Token <TooltipIcon text="Asset to be sold in the auction" />
          </>
      ),
      dataIndex: "outflowToken",
      key: "outflowToken",
      width: 250,
    },
    {
      title: (
          <>
            Inflow Token{" "}
            <TooltipIcon text="Asset used to buy the auctioned asset" />
          </>
      ),
      dataIndex: "inflowToken",
      key: "inflowToken",
      width: 200,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 200,
      render: (end_time) => <div className="endtime-badge">{end_time}</div>,
    },
    {
      title: (
          <>
            Auction Status <TooltipIcon text="Auction status" />
          </>
      ),
      dataIndex: "auctionStatus",
      key: "auctionStatus",
      align: "center",
    },
    {
      title: (
          <>
            Bidding Status <TooltipIcon text="Bidding status" />
          </>
      ),
      dataIndex: "action",
      key: "action",
      align: "right",
    },
  ];

  // biddingList.reverse(); // showing newest bid first (ascending->descending)

  const tableBiddingData =
      biddingList &&
      biddingList.length > 0 &&
      biddingList.map((item, index) => {
        return {
          key: index,
          outflowToken: (
              <>
                <div className="assets-withicon">
                  <div className="assets-icon">
                    <SvgIcon
                        name={iconNameFromDenom(item?.bid?.denom)}
                    />
                  </div>
                  {amountConversion(item?.bid?.amount || 0)}{" "}
                  {denomConversion(item?.bid?.denom)}
                </div>
              </>
          ),
          inflowToken: (
              <>
                <div className="assets-withicon">
                  <div className="assets-icon">
                    <SvgIcon
                        name={iconNameFromDenom(item?.auctionedCollateral?.denom)}
                    />
                  </div>
                  {amountConversion(item?.auctionedCollateral?.amount || 0)}{" "}
                  {denomConversion(item?.auctionedCollateral?.denom)}
                </div>
              </>
          ),
          timestamp: moment(item?.biddingTimestamp).format("MMM DD, YYYY HH:mm"),
          auctionStatus: (
              <Button
                  size="small"
                  className={
                    item?.auctionStatus === "0"
                        ? "biddin-btn bid-btn-placed"
                        : item?.auctionStatus === "1"
                            ? "biddin-btn bid-btn-success"
                            : item?.auctionStatus === "2"
                                ? "biddin-btn bid-btn-rejected"
                                : ""
                  }
              >
                {item?.auctionStatus === "0"
                    ? "Started No bids"
                    : item?.auctionStatus === "1"
                        ? "Going on"
                        : "Ended"}
              </Button>
          ),
          action: (
              <Button
                  size="small"
                  className={
                      item?.auctionStatus === "active"
                          ? "biddin-btn bid-btn-success"
                          : item?.auctionStatus === "inactive"
                              ? "biddin-btn bid-btn-rejected"
                              : ""
                  }
              >
                {item?.biddingStatus}
              </Button>
          ),
        };
      });

  return (
      <Table
          className="custom-table more-table  bidding-bottom-table"
          dataSource={tableBiddingData}
          columns={columnsBidding}
          pagination={false}
          scroll={{ x: "100%" }}
      />
  );
};

export default Bidding;
