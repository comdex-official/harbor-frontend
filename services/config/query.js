import axios from "axios";

export const queryIbcAssets = async () => {
    let url = process.env.NEXT_PUBLIC_ASSET_LIST_URL;
    try {
        const result = await axios.get(url);
        return result?.data;
    } catch (error) {
        return error;
    }
};

export const queryEnvConfig = async () => {
    let url = process.env.NEXT_PUBLIC_CONFIG_JSON_URL;
    try {
        const result = await axios.get(url);
        return result?.data;
    } catch (error) {
        return error;
    }
};

export const queryIconsUrl = async () => {
    let url = process.env.NEXT_PUBLIC_ICONS_JSON_URL;
    try {
        const result = await axios.get(url);
        return result?.data;
    } catch (error) {
        return error;
    }
};