export type restrictions = {
    private: boolean;
    whitelist: number[];
    archive: boolean;
}

export const defaultRestrictions: restrictions = {
    private: true,
    whitelist: [],
    archive: false
}

export const toRestrictions = (restrictions: string | undefined): restrictions => {return restrictions != undefined ? {...defaultRestrictions, ...JSON.parse(restrictions)} : defaultRestrictions;}

export default restrictions;