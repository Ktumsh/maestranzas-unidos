export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = process.env.NODE_ENV === "test";

export const localUrl = "http://localhost:3000";
export const productionUrl = "https://maestranzas-unidos.vercel.app";

export const siteUrl = isDevelopmentEnvironment ? localUrl : productionUrl;
