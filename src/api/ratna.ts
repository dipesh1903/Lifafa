import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { COLLECTIONS } from "../config/firebaseCollection";
import { RatnaDoc, RatnaDocUpdate, SharedUserDoc } from "../types/firebaseDocument";
import { RatnaFE, SharedUserFE } from "../types/documentFETypes";
import { convertRatnaToFE } from "../utils/firebaseToFEConverter";
import { ApiStatus } from "../constant";
import { handleError } from "../utils/handleError";
import { toast } from "react-toastify";

export async function CreateRatna(ratna: RatnaDoc, lifafaId: string): Promise<RatnaFE> {
    try {
        const ref = collection(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.ratna)
        const addRef = await addDoc(ref, ratna);
        toast.success('Created Successfully !!')
        return Promise.resolve(convertRatnaToFE(addRef.id, ratna));
    } catch(error) {
        toast.error('Failed!!')
        return Promise.reject(handleError(error))
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