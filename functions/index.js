import {onCall} from "firebase-functions/v2/https";
import ogs from "open-graph-scraper";
import admin from 'firebase-admin';
import { logger } from "firebase-functions";

admin.initializeApp()

export const openGraph = onCall(async (request, response) => {
    const url = request.data.url;
    try{
        const result = await ogs({url
        })
        return {result: {
            ogTitle: result.result.ogTitle,
            ogDescription: result.result.ogDescription,
            requestUrl: result.result.requestUrl,
            ogImage: result.result.ogImage,
            favicon: result.result.favicon
        }, error: result.error}
    } catch(error) {
        return error
    }
  });

export const createAnonymousLifafa = onCall(async (request, response) => {
    const anonymousId = request.data.uid
    const lifafa = request.data.lifafaDoc
    const lifafaId = request.data.lifafaId
    try {
        const result = await admin.firestore().collection('lifafa').where("createdBy", "==", anonymousId).get();
        logger.log('result size is ', result.size)
        if (result.size) {
            return ({
                isSuccess: true,
                lifafaCount: result.size
            })
        } else {
            try {
                const res = await admin.firestore().doc(`lifafa/${lifafaId}`).create(lifafa);
                return ({
                    isSuccess: true,
                    result: res,
                })
            } catch(error) {
                return ({
                    isSuccess: false,
                    error,
                })
            }
        }
    } catch(error) {
        return ({
            isSuccess: false,
            error,
        })
    }
})

export const createAnonymousRatnaLifafa = onCall(async (request, response) => {
    const anonymousId = request.data.uid
    const ratna = request.data.ratna
    const lifafaId = request.data.lifafaId

    try {
        const result = await admin.firestore().collection(`lifafa/${lifafaId}/ratna`).where("createdBy", "==", anonymousId).get();
        if (result.size) {
            return ({
                isSuccess: true,
                ratnaCount: result.size,
            })
        } else {
            try {
                const res = await admin.firestore().collection(`lifafa/${lifafaId}/ratna`).add(ratna)
                return ({
                    isSuccess: true,
                    ratnaId: res.id
                })
            } catch(error) {
                return ({
                    isSuccess: false,
                    error,
                    error2: 'g ergfuksegkruf e'
                })
            }
        }
    } catch(error) {
        return ({
            isSuccess: false,
            error,
            error3: 'f rgfliugefiuwerlfiwh'
        })
    }
})