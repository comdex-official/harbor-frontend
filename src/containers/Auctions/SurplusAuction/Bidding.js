import { Table, Button } from "antd";
import { SvgIcon } from "../../../components/common";
import { iconNameFromDenom } from "../../../utils/string";
import { denomConversion, amountConversion } from "../../../utils/coin";
import TooltipIcon from '../../../components/TooltipIcon'
export const Bidding = ({ biddingList }) => {
  const columnsBidding = [
    {
      title: (
        <>
          Auctioned Asset <TooltipIcon text="Asset to be sold in the auction" />
        </>
      ),
      dataIndex: "auctionedasset",
      key: "auctionedasset",
      width: 250,
    },
    {
      title: (
        <>
          Amount <TooltipIcon text="Auction amount" />
        </>
      ),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 150,
    },
    {
      title: (
        <>
          Bidding Asset{" "}
          <TooltipIcon text="Asset used to buy the auctioned asset" />
        </>
      ),
      dataIndex: "biddingasset",
      key: "biddingasset",
      width: 200,
    },
    {
      title: (
        <>
          Amount <TooltipIcon text="Bid amount" />
        </>
      ),
      dataIndex: "amount2",
      key: "amount2",
      align: "center",
      width: 200,
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
        id: item.id,
        auctionedasset: (
          <>
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon
                  name={iconNameFromDenom(item?.auctionedCollateral?.denom)}
                />
              </div>
              {denomConversion(item?.auctionedCollateral?.denom)}
            </div>
          </>
        ),
        biddingasset: (
          <>
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon name={iconNameFromDenom(item?.bid?.denom)} />
              </div>
              {denomConversion(item?.bid?.denom)}
            </div>
          </>
        ),
        amount:
          item?.auctionedCollateral?.amount &&
          amountConversion(item?.auctionedCollateral?.amount),
        amount2: item?.bid?.amount && amountConversion(item?.bid?.amount),
        auctionStatus: (
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
            {item?.auctionStatus}
          </Button>
        ),
        action: (
          <Button
            size="small"
            className={
              item?.biddingStatus === "placed"
                ? "biddin-btn bid-btn-placed"
                : item?.biddingStatus === "success"
                  ? "biddin-btn bid-btn-success"
                  : item?.biddingStatus === "rejected"
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
