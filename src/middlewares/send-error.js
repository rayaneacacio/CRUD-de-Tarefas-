import { locales } from "../locales.js";

const { INTERNAL_SERVER_ERROR } = locales;

export const sendError = (res, statusCode = 500, errorMessage = INTERNAL_SERVER_ERROR) => {

  return res
    .writeHead(statusCode, {'Content-Type': 'application/json'})
    .end(JSON.stringify({error: errorMessage}));
};