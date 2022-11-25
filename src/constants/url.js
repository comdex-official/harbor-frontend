export const getPriceChartURL = (range) => {
  return `https://api-osmosis.imperator.co/tokens/v2/historical/CMDX/chart?tf=${range}`;
};

// tf = range 60- 1H, 1440 - 1D, 10080 - 1W,  43800 - 1M
export const CAMPAIGN_URL = "https://test-campaign.comdex.one";

export const API_URL = process.env.REACT_APP_API_URL;
export const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=comdex%2Ccosmos%2Cosmosis%2Caxlusdc%2Caxlweth&vs_currencies=usd";