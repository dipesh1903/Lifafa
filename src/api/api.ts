import { and, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, or, query, setDoc, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { COLLECTIONS } from "../config/firebaseCollection";
import { db } from "../config/firebase.config";
import IdGenerator from "../utils/generateId";
import { LifafaDoc, LifafaDocUpdate, SharedUserDoc } from "../types/firebaseDocument";
import { LifafaFE, SharedUserFE } from "../types/documentFETypes";
import { handleError } from "../utils/handleError";
import { convertLifafaToFE, convertSharedUserToFE } from "../utils/firebaseToFEConverter";
import { getCurrentUserLifafaAccess } from "./ratna";
import { LifafaAccessType } from "../constant";

export async function fetchLifafa(lifafaId: string, uid: string): Promise<{lifafa: LifafaFE, access: SharedUserFE} | null> {
    let lifafa = null;
    try {
        const docRef = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log('came here', docSnap.data());
            lifafa = convertLifafaToFE(docSnap.id, docSnap.data());
            console.log('lifafa fetched is ', lifafa, uid);
            let access = lifafa.createdBy === uid ? {accessType: LifafaAccessType.PRIVATE, id: uid} as SharedUserFE : {} as SharedUserFE
            try {
                if (!access.accessType) {
                    access = await getCurrentUserLifafaAccess(lifafaId, uid);
                    console.log('access is ', access);
                }
            } catch (error) {
                console.log('lError here again ',  error);
            }
            finally {
                return Promise.resolve({lifafa: convertLifafaToFE(docSnap.id, docSnap.data()), access: access as SharedUserFE});
            }
        } else {
            console.log('error here', lifafa, uid);
            return Promise.resolve({lifafa: {} as LifafaFE , access: {} as SharedUserFE});
        }
    } catch(error) {
        console.log('Error is ', error);
        return Promise.reject(handleError(error));
    }
}

export async function addLifafa(lifafa: LifafaDoc): Promise<LifafaFE> {
    try {
        const lifafaId = new IdGenerator().generate();
        const addRef = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        await setDoc(addRef, lifafa);
        return Promise.resolve({
            ...lifafa,
            id: lifafaId
        });
    } catch(error) {
        return Promise.reject(handleError(error));
    }
}

export async function updateLifafa(lifafa: LifafaDocUpdate, lifafaId: string, uid: string, password?: string): Promise<{lifafa: LifafaDocUpdate, lifafaId: string}> {
    try {
        const batch = writeBatch(db);
        const addRef = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        batch.update(addRef, {
            ...lifafa
        });
        if (lifafa.accessType === LifafaAccessType.PROTECTED) {
            if (!password) throw new Error();
            const addPrivate = doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.private, uid);
            batch.set(
                addPrivate, {
                    password
                }
            )
        } else {
            const addPrivate = doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.private, uid);
            batch.delete(addPrivate);
        }
        await batch.commit();
        return Promise.resolve({
            lifafa,
            lifafaId
        });
    } catch(error) {
        console.log('the error is random numbers', error);
        return Promise.reject(handleError(error));
    }
}

export async function createLifafa(lifafa: LifafaDoc, uid: string, password?: string): Promise<LifafaFE> {
    try {
        const batch = writeBatch(db);
        const lifafaId = new IdGenerator().generate();
        const addRef = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        batch.set(addRef, {
            ...lifafa
        } as LifafaDoc);
        if (lifafa.accessType === LifafaAccessType.PROTECTED) {
            if (!password) throw new Error();
            const addPrivate = doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.private, uid);
            batch.set(
                addPrivate, {
                    password
                }
            )
        }
        await batch.commit();
        return Promise.resolve(convertLifafaToFE(lifafaId, lifafa));
    } catch(error) {
        console.log('createLifafa', error);
        return Promise.reject(handleError(error));
    }
}

export async function addUser(uid: string , lifafaId: string, user: SharedUserDoc):
    Promise<SharedUserFE> {
    try {
        const batch = writeBatch(db);
        const addShared = doc(db, COLLECTIONS.LIFAFA.index, lifafaId , COLLECTIONS.LIFAFA.sharedUsers, uid);
        batch.set(addShared, {
            ...user
        } as SharedUserDoc);
        const addSharedInLifafa = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        batch.update(addSharedInLifafa, {
            updatedAt: Timestamp.fromDate(new Date()),
            sharedUserId: arrayUnion(uid)
        })
        await batch.commit();
        return Promise.resolve(convertSharedUserToFE(uid, user));
    } catch (error) {
        console.log('errors is for add user', error)
        return Promise.reject(handleError(error));
    }
}

export async function getAllLifafa(uid: string): Promise<LifafaFE[]> {
    try {
        const q =  query(collection(db, COLLECTIONS.LIFAFA.index), or(and(where("sharedUserId", "array-contains", uid), where("accessType", "==", "PROTECTED")), and(where("publicJoinedUserId", "array-contains", uid), where("accessType", "==", "PUBLIC")), where("createdBy", "==", uid)))
        const querySnapshot = await getDocs(q);
        const result: LifafaFE[] = [];
        querySnapshot.forEach((doc) => {
            result.push(convertLifafaToFE(doc.id, doc.data()));
        });
        return Promise.resolve(result);
    } catch (error) {
        console.log('get all lifafa', error);
        return Promise.reject(handleError(error));
    }
}

export async function getAllusersForLifafa(lifafaId: string): Promise<SharedUserFE[]> {
    try {
        const ref = query(collection(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.sharedUsers));
        const snapShot = await getDocs(ref);
        const result: SharedUserFE[] = [];
        snapShot.forEach((doc) => {
            result.push(convertSharedUserToFE(doc.id, doc.data()));
        });
        return Promise.resolve(result);
    } catch (error) {
        return Promise.reject(handleError(error))
    }
}

export async function getLifafaPassword(lifafaId: string, uid: string): Promise<string> {
    try {
        const passwordRef = doc(db, COLLECTIONS.LIFAFA.index , lifafaId ,COLLECTIONS.LIFAFA.private, uid);
        const result = await getDoc(passwordRef);
        if (result.exists()) {
            return Promise.resolve(result.data().password)
        } else {
            return Promise.resolve('')
        }
    } catch(error) {
        console.log(error);
        return Promise.reject(error);
    }
}


export async function deleteLifafa(lifafaId: string, uid: string) {
    try {
        const q2 = query(collection(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.ratna));
        const snapShot2 = await getDocs(q2);
        if(snapShot2.size > 10) return;
        snapShot2.forEach(async item => {
            await deleteDoc(doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.ratna, item.id))
        })

        const q = query(collection(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.sharedUsers));
        const snapShot = await getDocs(q);
        snapShot.forEach(async item => {
            try {
                console.log('delete counts ratnas');
                await deleteDoc(doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.sharedUsers, item.id))
            } catch (error) {
                console.log('error 234', error);
            }
        })
        await deleteDoc(doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.private, uid))
        await deleteDoc(doc(db, COLLECTIONS.LIFAFA.index, lifafaId));
    } catch (error) {
        console.log('error is ', error);
    }
}

export async function joinPublicLifafa(lifafaId: string, uid: string, access: SharedUserDoc):
    Promise<SharedUserFE> {
    try {
        const batch = writeBatch(db);
        const docRef = doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.sharedUsers, uid);
        batch.set(docRef, {
            ...access
        })
        const addSharedInLifafa = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        batch.update(addSharedInLifafa, {
            updatedAt: Timestamp.fromDate(new Date()),
            publicJoinedUserId: arrayUnion(uid)
        })
        await batch.commit();
        return Promise.resolve(convertSharedUserToFE(uid, access));
    } catch (err) {
        console.log('error is ', err);
        return Promise.reject(err);
    }
}

export async function leavePublicLifafa(lifafaId: string, uid: string): Promise<string> {
    try {
        const batch = writeBatch(db);
        const addSharedInLifafa = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        batch.update(addSharedInLifafa, {
            updatedAt: Timestamp.fromDate(new Date()),
            publicJoinedUserId: arrayRemove(uid)
        })
        const docRef = doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.sharedUsers, uid);
        batch.delete(docRef);
        await batch.commit();
        return Promise.resolve(lifafaId);
    } catch (err) {
        console.log('error is ', err);
        return Promise.reject(err);
    }
}

export async function leaveProtectedLifafa(uid: string , lifafaId: string): Promise<string> {
    try {
        const batch = writeBatch(db);
        const addSharedInLifafa = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        batch.update(addSharedInLifafa, {
            updatedAt: Timestamp.fromDate(new Date()),
            sharedUserId: arrayRemove(uid)
        })
        const addShared = doc(db, COLLECTIONS.LIFAFA.index, lifafaId , COLLECTIONS.LIFAFA.sharedUsers, uid);
        batch.delete(addShared);
        await batch.commit();
        return Promise.resolve(lifafaId);
    } catch (error) {
        console.log('errors is for add user', error)
        return Promise.reject(handleError(error));
    }
}
