const variables = {
  en: {
    // Sidebar menu
    dashboard: "Dashboard",
    positions: "My Positions",
    earn: "earn",
    balances: "Balances",
    c_swap: "cSwap",
    borrow: "Borrow",
    farm: "Farm",
    mint: "Mint",
    MyHome: "My Home",
    assets: "Assets",
    govern: "Govern",
    auction: "Auction",
    more: "More",

    // Connect account
    connect: "Connect",
    connected: "Connected",
    testnet: "Testnet",
    mainnet: "Mainnet",
    connect_wallet: "Connect Wallet",
    keplr_wallet: "Keplr Wallet",
    balance_wallet: "Balance",
    address_wallet: "Address",
    disconnect: "Disconnect",
    disconnect_wallet: "Disconnect Wallet",
    yes: "Yes",
    no: "No",
    view_explore: "View Explorer",

    // Dashboard
    overview: "Overview",
    tvl: "Total Value Locked (TVL)",
    tv: "Total Value",
    collateral: "Collateral",
    liquidity: "Liquidity",
    pair_id: "Pair Id",
    cmdx_circulating_supply: "Circulating Supply",
    cmdx_market_cap: "Market Cap",
    cmdx_price: "CMDX Price",
    others: "OTHERS",
    staked: "Staked",
    casset_market_cap: "cAsset Market Cap",
    trading_fee: "Trading Fee",
    txn_fee: "TXN Fee",
    gold: "ucgold",
    silver: "Silver",
    crude_oil: "Crude Oil",
    price: "Price",
    trade: "Trade",
    total_value_of_all_cassets_in_lps: "Total Value of all CASSETS IN LPS",
    comdex_description:
      "Comdex's synthetics protocol unlocks access to a vast set of commodity debt assets and liquidity, making the flow of capital from DeFi to CeFi seamless.",
    day: "Day",
    week: "Week",
    month: "Month",
    year: "Year",
    //Banner
    comdexs: "Comdex’s",
    decentralized: "Decentralized",
    synthetic_exchange: "Synthetics Exchange",
    platform: "Platform",
    find_out_more: "Find Out More",

    //Total volume
    total_volume: "TOTAL VOLUME",
    total_value_locked: "TOTAL VALUE LOCKED",
    total_liquidity: "Liquidity",
    total_collateral: "Collateral",

    // Balances
    total_claimable_rewards: "total claimable rewards",
    holding: "Holding",
    borrowed: "Borrowed",
    farming: "Farming",
    total_value: "Total Value",
    current_ltv: "Current LTV",
    cAsset_balance: "cAsset Balance",
    mint_balance: "Mint Balance",
    farm_balance: "Farm Balance",
    asset_balance: "Asset Balance",
    borrowing_power_used: "Borrowing Power Used",
    your_collateral: "Your Collateral",
    health_factor: "Health Factor",
    you_borrowed: "You Borrowed",
    borrow_information: "Borrow Information",
    cmdx: "cmdx",
    ust: "ust",
    atom: "atom",
    xprt: "xprt",
    USD: "USD",
    CMDX: "CMDX",
    deposit: "Deposit",
    withdraw: "Withdraw",
    draw: "Draw",
    repay: "Repay",
    deposit_collateral: "Deposit Collateral",
    withdraw_collateral: "Withdraw Collateral",
    draw_debt: "Draw Debt",
    repay_debt: "Repay Debt",
    closeVault: "Close Vault",
    collateral_type: "Collateral Type",
    add_remove: "Add/Remove",

    // Send
    receiver_address: "Reciepient address",
    receiver_address_placeholder: "Enter Reciepient's address",
    token: "Token",
    amount: "Amount",
    send: "Send",
    cancle: "Cancle",
    available: "Available",
    max: "Max",
    half: "Half",
    from: "From",
    to: "To",

    // Borrow Page
    edit: "Edit",
    close: "Close",
    borrow_cAssets: "Borrow cAssets",
    borrow_cAsset: "Borrow cAsset",
    choose_collateral: "Collateral Asset",
    collateral_asset:
      "Collateral asset may affect the minimum collateral ratio.",
    set_collateral_ratio: "Set a Collateral Ratio",
    liquidate_below_minimum:
      "Position will be liquidated if the collateral ratio moves below the minimum threshold",

    confirm_borrow_amount: "Confirm borrow amount",
    position_closed: "Position can be closed by repaying the borrowed amount.",
    asset_description: "",
    withdraw_amount: "Withdrawn Amount",
    burn_amount: "Burn Amount",

    // Farm Page
    collateral_ratio: "Collateral Ratio",
    borrowed_assets: "Borrowed Assets",
    remove: "Remove",
    remove_liquidity: " Remove Liquidity",
    long: "Long",
    short: "Short",
    provide_casset: "Provide cAsset",
    provide_ust: "Provide UST",
    provide: "Provide",
    total_amount: "Total amount",
    pool_details: "POOL DETAILS",
    your_details: "YOUR DETAILS",
    my_amount: "My amount",
    my_liquidity: "My liquidity",
    available_amount: "Available Amount ",
    available_lp: "Available LP",
    bonded_lp: "Bonded LP",
    manage_liquidity: "Manage Liquidity",
    unbond_token: "Unbond Token",
    unbond: "Unbond",
    bond: "Bond",
    start_earning: "Start Earning",
    bond_lptokens: "Bond LP Tokens",
    unbonding_period: "Unbonding Period",
    amount_to_unbond: "Amount to Unbond",
    amount_to_bond: "Amount to Bond",
    unbonding: "Unbonding",
    unbonding_duration: "Unbonding Duration",
    unbond_lp_token: "Unbond LP Token",
    unbonding_complete: "Unbonding Complete",
    // Swap Page
    limit_order: "Limit Order",
    pay: "Pay",
    pool_price: "Pool Price",
    at_price: "At",
    you_get: "And get",
    balance: "Balance",
    tobuy: "To Buy",
    expected_price: "Expected Price",
    minimum_received: "Minimum Received",
    tx_fee: "Transaction Fee",
    tx_hash: "Transaction Hash",
    swap_fee: "Swap Fee",
    oracle_price: "Oracle Price",
    sell: "Sell",
    to_get: "To Get",
    buy: "Buy",
    price_per_gld: "Price per ucgold",
    spread: "Spread",
    slippage: "Slippage",
    commission: "Commission",
    swap: "Swap",
    swap_anyway: "Swap Anyway",
    oracle_price_tooltip: "Asset price feched from oracle",
    volume_tooltip: "24 hour trading volume for the Asset",
    premium_tooltip:
      "Difference between the Asset price in the pool and the oracle price",
    liquidity_tooltip: "Total liquidity for current Asset",
    estimated_slippage: "Estimated Slippage",

    // caution notice
    back: "Back",
    caution_header: "Caution Notice",
    sub_text:
      "Trading involves a significant risk of loss and is not suitable for all investors, in particular, past developments do not necessarily indicate future results",
    risk: "TRADE AT YOUR OWN RISK",
    read_and_understand:
      "I have read and understand these risks, and wish to proceed.",
    agree: "Agree",

    // Theme Index
    switch_dark: "Enable dark mode",
    switch_light: "Enable light mode",
    poolSize: "Pool Size",
    poolLiquidity: "Pool Liquidity",
    apr: "APR",

    //Tooltip text

    //Dashboard
    tooltip_circulating_supply_CMST:
      "Circulating supply is the amount of CMST available and circulating in the market",
    tooltip_circulating_supply_HARBOR:
      "Circulating supply is the amount of HARBOR available and circulating in the market",
    tooltip_market_cap: "Market Cap = Current Price * Circulating Supply",
    tooltip_total_value_locked:
      "Total value locked of assets being used as collateral (including Stablemint assets)",

    //My Positions
    tooltip_earn_current_balance: "Current balance of Composite deposited in Locker",
    tooltip_earn_interest_earned: "Total interest accumulated till date from Locker",
    tooltip_earn_interest_rate: "Current annual interest rate of Locker",
    tooltip_earn_transaction_type: "Type of transaction ( Withdraw or Deposit)",
    tooltip_earn_balance: "Balance after transaction",
    tooltip_vaults_collaterallocked: "Total amount of collateral locked across all vaults",
    tooltip_vaults_totaldebt: "Total amount of Composite Debt Owed across all Vaults which is a sum of Composite borrowed and interest accrued",
    tooltip_vaults_availabletoborrow: "Total amount of Composite available to borrow adhering to vault safety limits",
    tooltip_vaults_vaulttype: "Type of vault",
    tooltip_vaults_debt: "Composite Debt owed for this vault which is a sum of Composite borrowed and interest accrued",
    tooltip_vaults_stabilityfee: "Stability fee is the interest charged annually ( compounded per block) for current vault",
    tooltip_vaults_collateralratio: "The collateral ratio of the vault which is equal to collateral deposited by composite borrowed",
    tooltip_history_current_balance: "Current balance of Composite deposited in Locker",
    tooltip_history_collaterallocked: "Total amount of collateral locked across all vaults",
    tooltip_history_totaldebt: "Total amount of Composite Debt Owed across all Vaults which is a sum of Composite borrowed and interest accrued",



    // Mint
    tooltip_mint_asset_lr: "If the collateral ratio of the vault goes below this value, the vault will get automatically liquidated which means that the deposited collateral will be sold to recover bad Composite 		Debt",
    tooltip_mint_asset_stabilityfee: "Current Interest Rate on Borrowed Amount",
    tooltip_mint_asset_mincollateralratio: "Minimum collateral ratio at which composite should be minted",
    tooltip_mint_asset_minborrow: "Minimum composite that should be borrowed for any active vault",
    tooltip_mint_asset_debtceiling: "Maximum Composite that can be withdrawn per vault type",
    tooltip_mint_open_withdrawable: "Amount of Composite that can be borrowed as long as collateral ratio is above min. collateral ratio",
    tooltip_mint_open_liquidationprice: "The price of deposited asset at which the vault will be liquidated",
    tooltip_mint_open_collateraldeposted: "Total amount of collateral locked",
    tooltip_mint_open_oracleprice: "The current price of the deposited asset fetched from on-chain oracles",
    tooltip_mint_open_withdrawn: "Total amount of Composite Debt Owed",
    tooltip_mint_open_vaultId: "Unique Vault ID created per vault address and vault type",
    tooltip_mint_open_stabilityfee: "Current Interest Rate on Borrowed Amount",
    tooltip_mint_open_openingfee: "Opening Fee charged is a one time value deducted per withdrawal. The value fee collected is added to the collector module",
    tooltip_mint_open_liquidationratio: "If the collateral ratio of the vault goes below this value, the vault will get automatically liquidated which means that the deposited collateral will be sold to recover bad Composite Debt",
    tooltip_mint_open_opendate: "The date the Vault was opened",
    tooltip_mint_edit_deposit: "To deposit more collateral",
    tooltip_mint_edit_withdraw: "To withdraw collateral as long as collateral ratio is above min. collateral ratio",
    tooltip_mint_edit_draw: "Borrow more Composite as long as collateral ratio is above min. collateral ratio",
    tooltip_mint_edit_repay: "Repay debt in Composite as long as debt is above minimum borrow amount",
    tooltip_mint_edit_liquidationprice: "The price of deposited asset at which the vault will be liquidated",
    tooltip_mint_edit_collateraldeposted: "Total amount of collateral locked",
    tooltip_mint_edit_oracleprice: "The current price of the deposited asset fetched from on-chain oracles",
    tooltip_mint_edit_withdrawn: "Total amount of Composite Debt Owed",
    tooltip_mint_edit_vaultId: "Unique Vault ID created per vault address and vault type",
    tooltip_mint_edit_stabilityfee: "Current Interest Rate on Borrowed Amount",
    tooltip_mint_edit_openingfee: "Opening Fee charged is a one time value deducted per withdrawal. The value fee collected is added to the collector module",
    tooltip_mint_edit_liquidationratio: "If the collateral ratio of the vault goes below this value, the vault will get automatically liquidated which means that the deposited collateral will be sold to recover bad Composite Debt",
    tooltip_mint_edit_opendate: "The date the Vault was opened",
    tooltip_mint_close_liquidationprice: "The price of deposited asset at which the vault will be liquidated",
    tooltip_mint_close_collateraldeposted: "Total amount of collateral locked",
    tooltip_mint_close_oracleprice: "The current price of the deposited asset fetched from on-chain oracles",
    tooltip_mint_close_withdrawn: "Total amount of Composite Debt Owed",
    tooltip_mint_close_vaultId: "Unique Vault ID created per vault address and vault type",
    tooltip_mint_close_stabilityfee: "Current Interest Rate on Borrowed Amount",
    tooltip_mint_close_openingfee: "Opening Fee charged is a one time value deducted per withdrawal. The value fee collected is added to the collector module",
    tooltip_mint_close_liquidationratio: "If the collateral ratio of the vault goes below this value, the vault will get automatically liquidated which means that the deposited collateral will be sold to recover bad Composite Debt",
    tooltip_mint_close_opendate: "The date the Vault was opened",

    //Earn
    tooltip_deposit: "Deposit Composite in locker to earn interest compounded per block",
    tooltip_newbalance: "New balance of Composite deposited after transaction is completed",
    tooltip_interestrate: "Current earning interest rate for locker, which can change based on governance polling",
    tooltip_calculator: "Calculator to compute earnings expected after a period of time for a certain principal",
    tooltip_interestearned: "Interest earned till date",
    tooltip_balance: "Current balance of Composite deposited in locker",
    tooltip_newbalance: "New balance of Composite in locker after withdrawal transaction is completed",
    tooltip_calculator: "Calculator to compute earnings expected after a period of time for a certain principal",

    //Assets
    total_asset_balance: "Total Asset Balance",
    comdex_assets: "Assets",
    tx_success: "Transaction Successful",
    tx_failed: "Transaction Failed",
    asset_bought: "Asset Bought",
    asset_swap: "Asset Swapped",

    // Govern Page
    banner_paira:
      "Stake your CMDX tokens to earn rewards and participate in governance proposals",
    yield_card_text:
      "  Yield smarter with Unagii, the automated DeFi yield platform redefining the way you earn.",
    omniflix_card_text:
      "OmniFlix Network is a trusted Proof-of-Stake infrastructure provider and validator to comfortably stake your coins and earn rewards.",
    manage_stake: " Manage Stake",

    // More Page
    details: "Details",
    filter: "Filter",
    campaign: "Campaign",
  },
};

export default variables;
