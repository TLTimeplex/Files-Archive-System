export type restrictions = {
    private: boolean;
    whitelist: number[];
}

export const defaultRestrictions: restrictions = {
    private: true,
    whitelist: []
}

export const toRestrictions = (restrictions: string): restrictions => {return {...defaultRestrictions, ...JSON.parse(restrictions)}}

export default restrictions;