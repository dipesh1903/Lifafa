import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { COLLECTIONS } from "../config/firebaseCollection";
import { RatnaDoc, RatnaDocUpdate, SharedUserDoc } from "../types/firebaseDocument";
import { RatnaFE, SharedUserFE } from "../types/documentFETypes";
import { convertRatnaToFE } from "../utils/firebaseToFEConverter";
import { ApiStatus } from "../constant";
import { handleError } from "../utils/handleError";
import { toast } from "react-toastify";
import { getFunctions, httpsCallable } from "firebase/functions";
import { User } from "firebase/auth";

export async function CreateRatna(ratna: RatnaDoc, lifafaId: string, user: User): Promise<RatnaFE | void> {
    try {
        let ratnaId = '';
        let isRatnaCreated = false;
        let anonymousResultSuccess = true;
        if (user.isAnonymous) {
            const functions = getFunctions();
            const createAnonymousRatnaLifafa = httpsCallable<{ratna: RatnaDoc, lifafaId: string, uid: string}, {error: any, ratnaId?: string,
                ratnaCount?: number, isSuccess: boolean
            }
                >(functions, "createAnonymousRatnaLifafa")

            const result = await createAnonymousRatnaLifafa({
                ratna: ratna,
                lifafaId,
                uid: user.uid
            })
            const {
                isSuccess,
            } = result.data;
            if (result.data.ratnaId) {
                ratnaId = result.data.ratnaId
            }
            anonymousResultSuccess = isSuccess;
            isRatnaCreated = !!(isSuccess && !result.data.ratnaCount);
        } else {
            const ref = collection(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.ratna)
            const addRef = await addDoc(ref, ratna);
            isRatnaCreated = true
            ratnaId = addRef.id
        }
        if (!anonymousResultSuccess) {
            toast.error('Failed!!')
            return Promise.reject()
        }
        if (isRatnaCreated) {
            toast.success('Created Successfully !!')
            return Promise.resolve(convertRatnaToFE(ratnaId, ratna));
        } else {
            toast.info('Login to get complete access')
            return Promise.resolve();
        }
    } catch(error) {

    }
}

export async function updateRatna(ratna: RatnaDocUpdate, lifafaId: string, ratnaId: string): Promise<RatnaDocUpdate> {
    try {
        const ref = doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.ratna, ratnaId)
        await updateDoc(ref, {...ratna});
        toast.success('Updated Successfully !!')
        return Promise.resolve(ratna);
    } catch(error) {
        toast.error('Failed!!')
        return Promise.reject(handleError(error))
    }
}

export async function deleteRatna(lifafaId: string, ratnaId: string): Promise<ApiStatus> {
    try {
        const ref = doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.ratna, ratnaId)
        await deleteDoc(ref);
        toast.success('Deleted Successfully !!')
        return Promise.resolve(ApiStatus.SUCCESS);
    } catch(error) {
        toast.error('Failed!!')
        return Promise.reject(handleError(error))
    }
}

export async function getRatnas(lifafaId: string): Promise<RatnaFE[]> {
    try {
        const ref = query(collection(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.ratna))
        const snapShot = await getDocs(ref);
        const result: RatnaFE[] = [];
        snapShot.forEach(doc => {
            result.push(convertRatnaToFE(doc.id, doc.data()))
        })
        return Promise.resolve(result);
    } catch(err) {
        
        return Promise.reject(err);
    }
}

export async function getCurrentUserLifafaAccess(lifafaId: string, uid: string): Promise<SharedUserFE> {
    try {
        const ref = doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.sharedUsers, uid);
        const result = await getDoc(ref);
        if (result.exists()) {
            return Promise.resolve({
                ...result.data() as SharedUserDoc,
                id: result.id
            });
        } else {
            return Promise.reject();
        }
    } catch(error) {
        return Promise.reject(error)
    }
}