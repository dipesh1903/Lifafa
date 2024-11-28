/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {onCall} from "firebase-functions/v2/https";
import ogs from "open-graph-scraper";

export const openGraph = onCall(async (request, response) => {
    const url = request.data.url;
    try{
        const result = await ogs({url
        })
        return {result: result.result, error: result.error}
    } catch(error) {
        return error
    }
  });
