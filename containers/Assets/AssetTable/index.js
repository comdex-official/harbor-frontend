import { Button, Table, Input, Switch, Tabs } from "antd";
import { StarFilled, StarOutlined } from '@ant-design/icons';
import Lodash from "lodash";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import { connect, useDispatch } from "react-redux";
import { Col, Row, SvgIcon } from "../../../components/common";
import NoDataIcon from "../../../components/common/NoDataIcon";
import AssetList from "../../../config/ibc_assets.json";
import { cmst, comdex, harbor } from "../../../config/network";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { getChainConfig } from "../../../services/keplr";
import {
    amountConversion,
    commaSeparatorWithRounding,
    denomConversion,
} from "../../../utils/coin";
import { commaSeparator, formateNumberDecimalsAuto, marketPrice } from "../../../utils/number";
import { iconNameFromDenom } from "../../../utils/string";
import variables from "../../../utils/variables";
import Deposit from "./Deposit";
// import "./index.scss";
// import LPAsssets from "./LPAassets";
import Withdraw from "./Withdraw";

const AssetsTable = ({
    lang,
    assetBalance,
    balances,
    markets,
    refreshBalance,
    assetMap,
    harborPrice,
    loading,
    setLoading
}) => {
    const dispatch = useDispatch();

    // const [loading, setLoading] = useState(false);
    const [isHideToggleOn, setHideToggle] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const [filterValue, setFilterValue] = useState("1");

    const tabItems = [
        {
            key: "1",
            label: "AssetsTable",
        },
        {
            key: "2",
            label: "LF Tokens",
        },
    ];

    const handleBalanceRefresh = () => {
        setLoading(true);
        let assetReloadBth = document.getElementById("reload-btn");
        assetReloadBth.classList.toggle("reload");
        if (!assetReloadBth.classList.contains("reload")) {
            assetReloadBth.classList.add("reload-2");
        } else {
            assetReloadBth.classList.remove("reload-2");
        }

        dispatch({
            type: "BALANCE_REFRESH_SET",
            value: refreshBalance + 1,
        });
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const handleHideSwitchChange = (value) => {
        setHideToggle(value);
    };

    const onSearchChange = (searchKey) => {
        setSearchKey(searchKey.trim().toLowerCase());
    };

    const favIconClick = (_favIcon, favItem) => {
        console.log(_favIcon, favItem);

    }

    const columns = [
        // {
        //     title: '',
        //     dataIndex: 'favorite',
        //     key: 'favorite',
        //     width: 30,
        //     render: (favorite) =>
        //     (
        //         <>
        //             <span style={{ cursor: "pointer" }} onClick={() => favIconClick(favorite, favItem)}>
        //                 {favorite?.[0] ? <StarFilled style={{ color: 'gold' }} /> : <StarOutlined />}
        //             </span>
        //         </>
        //     ),
        // },
        // {
        //     title: '',
        //     dataIndex: 'favorite',
        //     key: 'favorite',
        //     width: 30,
        //     fixed: 'left',
        //     render: () => null, // Render nothing in the column cell
        // },

        {
            title: "Asset",
            dataIndex: "asset",
            key: "asset",
            width: 230,
            // sorter: true,
            sorter: (a, b) => a?.symbol.localeCompare(b?.symbol),
            sortDirections: ["ascend", "descend"],
            showSorterTooltip: false,
        },
        {
            title: "No. of Tokens",
            dataIndex: "noOfTokens",
            key: "noOfTokens",
            align: "left",
            sorter: (a, b) => Number(a?.noOfTokens) - Number(b?.noOfTokens),
            sortDirections: ["ascend", "descend"],
            showSorterTooltip: false,
            render: (tokens) => (
                <>
                    <p>{commaSeparator(Number(tokens || 0))}</p>
                </>
            ),
        },
        {
            title: "Oracle Price",
            dataIndex: "oraclePrice",
            key: "oraclePrice",
            align: "left",
            sorter: (a, b) => Number(a?.oraclePrice) - Number(b?.oraclePrice),
            sortDirections: ["ascend", "descend"],
            showSorterTooltip: false,
            render: (price) => (
                <>
                    ${formateNumberDecimalsAuto({ price: Number(price) || 0 })}
                </>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "left",
            sorter: (a, b) => Number(a?.amount) - Number(b?.amount),
            sortDirections: ["ascend", "descend"],
            showSorterTooltip: false,
            render: (amount) => (
                <>
                    <p>${commaSeparator(Number(Math.floor(amount * Math.pow(10, DOLLAR_DECIMALS)) / Math.pow(10, DOLLAR_DECIMALS)))}</p>
                </>
            ),
        },
        {
            title: "IBC Deposit",
            dataIndex: "ibcdeposit",
            key: "ibcdeposit",
            align: "center",
            render: (value) => {
                if (value) {
                    return value?.depositUrlOverride ? (
                        // <Button
                        //   type="primary btn-filled"
                        //   size="small"
                        //   className="external-btn"
                        // >
                        //   <a
                        //     href={value?.depositUrlOverride}
                        //     target="_blank"
                        //     rel="noreferrer"
                        //   >
                        //     Deposit{" "}
                        //     <span className="hyperlink-icon">
                        //       {" "}
                        //       <SvgIcon name="hyperlink" />
                        //     </span>
                        //   </a>
                        // </Button>
                        <div>
                            <a
                                href={value?.depositUrlOverride}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#ABA5FB" }}
                            >
                                Deposit{" "}
                            </a>
                        </div>
                    ) : (
                        <Deposit
                            chain={value}
                            balances={balances}
                            handleRefresh={handleBalanceRefresh}
                        />
                    );
                }
            },
        },
        {
            title: "IBC Withdraw",
            dataIndex: "ibcwithdraw",
            key: "ibcwithdraw",
            width: 120,
            render: (value) => {
                if (value) {
                    return value?.withdrawUrlOverride ? (
                        // <Button
                        //   type="primary btn-filled"
                        //   size="small"
                        //   className="external-btn"
                        // >
                        //   <a
                        //     href={value?.withdrawUrlOverride}
                        //     target="_blank"
                        //     rel="noreferrer"
                        //   >
                        //     Withdraw{" "}
                        //     <span className="hyperlink-icon">
                        //       {" "}
                        //       <SvgIcon name="hyperlink" />
                        //     </span>
                        //   </a>
                        // </Button>
                        <div >
                            <a
                                href={value?.withdrawUrlOverride}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#ABA5FB" }}
                            >
                                Withdraw{" "}
                            </a>
                        </div>
                    ) : (
                        <Withdraw
                            chain={value}
                            balances={balances}
                            handleRefresh={handleBalanceRefresh}
                        />
                    );
                }
            },
        },
    ];


    const getPrice = (denom) => {
        if (denom === harbor?.coinMinimalDenom) {
            return harborPrice;
        }
        if (denom === "ucmst") {
            return markets?.cswapApiPrice?.ucmst?.price || 0;
        }

        return marketPrice(markets, denom, assetMap[denom]?.id) || 0;
    };

    let ibcBalances = AssetList?.tokens.map((token) => {
        const ibcBalance = balances.find(
            (item) => item.denom === token?.ibcDenomHash
        );
        return {
            chainInfo: getChainConfig(token),
            coinMinimalDenom: token?.coinMinimalDenom,
            symbol: token?.symbol,
            balance: {
                amount: ibcBalance?.amount
                    ? amountConversion(
                        ibcBalance.amount,
                        comdex?.coinDecimals,
                        assetMap[ibcBalance?.denom]?.decimals
                    )
                    : 0,
                price: getPrice(ibcBalance?.denom) || 0,
            },
            sourceChannelId: token.comdexChannel,
            destChannelId: token.channel,
            ibcDenomHash: token?.ibcDenomHash,
            explorerUrlToTx: token?.explorerUrlToTx,
            depositUrlOverride: token?.depositUrlOverride,
            withdrawUrlOverride: token?.withdrawUrlOverride,
        };
    });

    const nativeCoin = balances.filter(
        (item) => item.denom === comdex?.coinMinimalDenom
    )[0];
    const cmstCoin = balances.filter(
        (item) => item.denom === cmst?.coinMinimalDenom
    )[0];
    const harborCoin = balances.filter(
        (item) => item.denom === harbor?.coinMinimalDenom
    )[0];

    const nativeCoinValue =
        getPrice(nativeCoin?.denom) *
        (nativeCoin?.amount ? Number(amountConversion(nativeCoin?.amount)) : 0);

    const cmstCoinValue =
        getPrice(cmstCoin?.denom) *
        (cmstCoin?.amount ? Number(amountConversion(cmstCoin?.amount)) : 0);

    const harborCoinValue =
        getPrice(harborCoin?.denom) *
        (harborCoin?.amount ? Number(amountConversion(harborCoin?.amount)) : 0);

    const currentChainData = [
        {
            key: comdex.symbol,
            favorite: true,
            symbol: comdex?.symbol,
            asset: (
                <>
                    <div className="assets-withicon">
                        <div className="assets-icon">
                            <SvgIcon name={iconNameFromDenom(comdex?.coinMinimalDenom)} />
                        </div>{" "}
                        {denomConversion(comdex?.coinMinimalDenom)}
                    </div>
                </>
            ),
            noOfTokens: nativeCoin?.amount ? amountConversion(nativeCoin.amount) : 0,
            oraclePrice: getPrice(comdex?.coinMinimalDenom),
            amount: nativeCoinValue || 0,
        },
        {
            key: cmst?.symbol,
            favorite: true,
            symbol: cmst?.symbol,
            asset: (
                <>
                    <div className="assets-withicon">
                        <div className="assets-icon">
                            <SvgIcon name={iconNameFromDenom(cmst?.coinMinimalDenom)} />
                        </div>{" "}
                        {denomConversion(cmst?.coinMinimalDenom)}
                    </div>
                </>
            ),
            noOfTokens: cmstCoin?.amount ? amountConversion(cmstCoin.amount) : 0,
            oraclePrice: getPrice(cmst?.coinMinimalDenom),
            amount: cmstCoinValue || 0,
        },
        {
            key: harbor?.symbol,
            favorite: true,
            symbol: harbor?.symbol,
            asset: (
                <>
                    <div className="assets-withicon">
                        <div className="assets-icon">
                            <SvgIcon name={iconNameFromDenom(harbor?.coinMinimalDenom)} />
                        </div>{" "}
                        {denomConversion(harbor?.coinMinimalDenom)}
                    </div>
                </>
            ),
            noOfTokens: harborCoin?.amount ? amountConversion(harborCoin.amount) : 0,
            oraclePrice: getPrice(harbor?.coinMinimalDenom),

            amount: harborCoinValue || 0,
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const tableIBCData =
        ibcBalances &&
        ibcBalances.map((item) => {
            return {
                key: item?.symbol,
                favorite: selectedRowKeys?.includes(item?.symbol),
                symbol: item?.symbol,
                asset: (
                    <>
                        <div className="assets-withicon">
                            <div className="assets-icon">
                                <SvgIcon name={iconNameFromDenom(item?.ibcDenomHash)} />
                            </div>
                            {denomConversion(item?.ibcDenomHash)}{" "}
                        </div>
                    </>
                ),
                noOfTokens: item?.balance?.amount,
                oraclePrice: getPrice(item?.ibcDenomHash),
                amount: Number(item.balance?.amount) * item.balance?.price,
                ibcdeposit: item,
                ibcwithdraw: item,
            };
        });

    // Sort the tableIBCData array based on the favorite property
    tableIBCData.sort((a, b) => {
        // Check if either item is a favorite
        if (a.favorite && !b.favorite) {
            return -1; // a is favorite, b is not favorite, so a comes first
        } else if (!a.favorite && b.favorite) {
            return 1; // b is favorite, a is not favorite, so b comes first
        } else {
            return 0; // Both are either favorites or not favorites, maintain their original order
        }
    });


    const favoriteIBCData = tableIBCData.filter((item) => item.favorite);
    const nonFavoriteIBCData = tableIBCData.filter((item) => !item.favorite);

    console.log(favoriteIBCData, "favoriteIBCData");
    console.log(nonFavoriteIBCData, "nonFavoriteIBCData");
    console.log(selectedRowKeys, "selectedRowKeys");


    let allTableData = Lodash.concat(currentChainData, tableIBCData);

    let tableData = isHideToggleOn
        ? allTableData?.filter((item) => Number(item?.noOfTokens) > 0)
        : allTableData;

    tableData = searchKey ? tableData?.filter((item) => {
        return ((item?.symbol).toLowerCase()).includes(searchKey.toLowerCase())
    }) : tableData;

    let balanceExists = allTableData?.find(
        (item) => Number(item?.noOfTokens) > 0
    );

    const onChange = (key) => {
        setFilterValue(key);
    };



    // New code 



    const TableRow = ({ data }) => {
        const [isFavorite, setIsFavorite] = useState(false);

        const handleFavoriteClick = () => {
            setIsFavorite(!isFavorite);
        };

        return (
            <div>
                <span>{data.symbol}</span>
                <div className="assets-withicon">
                    <div className="assets-icon">
                        <SvgIcon name={iconNameFromDenom(data.ibcDenomHash)} />
                    </div>
                    {denomConversion(data.ibcDenomHash)}{" "}
                </div>
                <span>{data.noOfTokens}</span>
                <span>{data.oraclePrice}</span>
                <span>{data.amount}</span>
                <div onClick={handleFavoriteClick}>
                    {isFavorite ? <StarFilled /> : <StarOutlined />}
                </div>
                {/* <Table
                    className="custom-table assets-table"
                    dataSource={tableIBCData}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    scroll={{ x: "100%" }}
                    locale={{ emptyText: <NoDataIcon /> }}
                /> */}
            </div>
        );
    };

    // const [selectedRowKeys, setSelectedRowKeys] = useState(['CMDX', 'CMST', "HARBOR","OSMO"]);
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectionType, setSelectionType] = useState('checkbox');


    const saveFavoritesToLocalStorage = (favorites) => {
        localStorage.setItem('favoriteTokens', JSON.stringify(favorites));
    };

    const handleFavoriteClick = (coinMinimalDenom) => {
        const updatedIBCData = ibcBalances.map((item) => {
            if (item.coinMinimalDenom === coinMinimalDenom) {
                return {
                    ...item,
                    favorite: !item.favorite,
                };
            }
            return item;
        });

        ibcBalances = updatedIBCData;
        saveFavoritesToLocalStorage(updatedIBCData.filter((item) => item.favorite));
    };

    useEffect(() => {
        const favoritesFromLocalStorage = JSON.parse(localStorage.getItem('favoriteTokens')) || [];

        const updatedIBCData = ibcBalances.map((item) => {
            return {
                ...item,
                favorite: favoritesFromLocalStorage.includes(item.coinMinimalDenom),
            };
        });

        ibcBalances = updatedIBCData;
    }, []);


    useEffect(() => {
        // Check if favorite tokens exist in localStorage
        const storedFavorites = localStorage.getItem('favoriteTokens');
        if (storedFavorites) {
            setSelectedRowKeys(JSON.parse(storedFavorites));
        } else {
            // Set default favorite tokens
            const defaultFavorites = ['CMDX', 'CMST', 'HARBOR'];
            setSelectedRowKeys(defaultFavorites);
            localStorage.setItem('favoriteTokens', JSON.stringify(defaultFavorites));
        }
    }, []);

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    useEffect(() => {
        // Load selected row keys from local storage on component mount
        const storedRowKeys = localStorage.getItem('favoriteTokens');

        if (storedRowKeys) {
            setSelectedRowKeys(JSON.parse(storedRowKeys));
        }
    }, []);

    useEffect(() => {
        // Save selected row keys to local storage whenever it changes
        localStorage.setItem('favoriteTokens', JSON.stringify(selectedRowKeys));
    }, [selectedRowKeys]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: () => ({
            style: {
                display: 'none',
            },
        }),
        renderCell: (checked, record) => {
            const isSelected = selectedRowKeys.includes(record.key);

            return (
                <div onClick={() => handleRowSelection(record.key)} style={{ cursor: "pointer" }}>
                    {isSelected ? (
                        <StarFilled style={{ color: 'gold' }} />
                    ) : (
                        <StarOutlined style={{ color: 'gray' }} />
                    )}
                </div>
            );
        },
    };

    const handleRowSelection = (key) => {
        const newSelectedRowKeys = [...selectedRowKeys];

        if (newSelectedRowKeys.includes(key)) {
            const index = newSelectedRowKeys.indexOf(key);
            newSelectedRowKeys.splice(index, 1);
        } else {
            newSelectedRowKeys.push(key);
        }

        setSelectedRowKeys(newSelectedRowKeys);
    };
    // console.log(tableData, "tableData");

    // Sort the dataSource array based on the favorite property (true first)
    // tableData = [...tableData].sort(
    //     (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)
    // );



    return (
        <div className="app-content-wrapper">
            <div className=" assets-section">
                <Row>
                    <div className="mt-4">
                    </div>
                    <Col className="assets-search-section">
                        <div>
                            Hide 0 Balances{" "}
                            <Switch
                                disabled={!balanceExists}
                                onChange={(value) => handleHideSwitchChange(value)}
                                checked={isHideToggleOn}
                            />
                        </div>
                        <Input
                            placeholder="Search Asset.."
                            onChange={(event) => onSearchChange(event.target.value)}
                            suffix={<SvgIcon name="search" viewbox="0 0 18 18" />}
                        />
                    </Col>
                </Row>


                <Row>
                    <Col>
                        {filterValue === "1" ? (
                            <Table
                                className="custom-table assets-table"
                                dataSource={tableData}
                                // rowSelection={rowSelection}
                                rowSelection={{
                                    type: selectionType,
                                    ...rowSelection,
                                }}
                                columns={columns}
                                loading={loading}
                                pagination={true}
                                scroll={{ x: "100%" }}
                                locale={{ emptyText: <NoDataIcon /> }}
                            />
                        ) : (
                            null
                        )}

                        {/* <div>
                            {tableData.map((row) => (
                                <TableRow key={row.key} data={row} />
                            ))}
                        </div> */}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

AssetsTable.propTypes = {
    lang: PropTypes.string.isRequired,
    assetBalance: PropTypes.number,
    refreshBalance: PropTypes.number.isRequired,
    assetMap: PropTypes.object,
    harborPrice: PropTypes.number.isRequired,
    balances: PropTypes.arrayOf(
        PropTypes.shape({
            denom: PropTypes.string.isRequired,
            amount: PropTypes.string,
        })
    ),
    markets: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        assetBalance: state.account.balances.asset,
        balances: state.account.balances.list,
        markets: state.oracle.market,
        refreshBalance: state.account.refreshBalance,
        assetMap: state.asset.map,
        harborPrice: state.liquidity.harborPrice,
    };
};

export default connect(stateToProps)(AssetsTable);
