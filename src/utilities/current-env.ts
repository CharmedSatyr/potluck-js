const { NODE_ENV } = process.env;

export const DEV: boolean = NODE_ENV === "development";
export const PROD: boolean = NODE_ENV === "production";
export const TEST: boolean = NODE_ENV === "test";
