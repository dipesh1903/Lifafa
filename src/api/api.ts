import { and, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, or, query, setDoc, Timestamp, where, writeBatch } from "firebase/firestore";
import { COLLECTIONS } from "../config/firebaseCollection";
import { db } from "../config/firebase.config";
import IdGenerator from "../utils/generateId";
import { LifafaDoc, LifafaDocUpdate, SharedUserDoc } from "../types/firebaseDocument";
import { LifafaFE, SharedUserFE } from "../types/documentFETypes";
import { handleError } from "../utils/handleError";
import { convertLifafaToFE, convertSharedUserToFE } from "../utils/firebaseToFEConverter";
import { getCurrentUserLifafaAccess } from "./ratna";
import { LifafaAccessType } from "../constant";
import { toast } from "react-toastify";
import { getFunctions, httpsCallable } from "firebase/functions";

export async function fetchLifafa(lifafaId: string, uid: string): Promise<{lifafa: LifafaFE, access: SharedUserFE} | null> {
    let lifafa = null;
    try {
        const docRef = doc(db, COLLECTIONS.LIFAFA.index, lifafaId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            lifafa = convertLifafaToFE(docSnap.id, docSnap.data());
            let access = lifafa.createdBy === uid ? {accessType: LifafaAccessType.PRIVATE, id: uid} as SharedUserFE : {} as SharedUserFE
            try {
                if (!access.accessType) {
                    access = await getCurrentUserLifafaAccess(lifafaId, uid);
                    
                }
            } catch (error) {
            }
            finally {
                return Promise.resolve({lifafa: convertLifafaToFE(docSnap.id, docSnap.data()), access: access as SharedUserFE});
            }
        } else {
            
            return Promise.resolve({lifafa: {} as LifafaFE , access: {} as SharedUserFE});
        }
    } catch(error) {
        
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
        toast.success('Updated Successfully!!')
        return Promise.resolve({
            lifafa,
            lifafaId
        });
    } catch(error) {
        toast.error('Failed!!')
        return Promise.reject(handleError(error));
    }
}

export async function createLifafa(lifafa: LifafaDoc, uid: string, isAnonymousUser: boolean, password?: string): Promise<LifafaFE> {
    try {
        const lifafaId = new IdGenerator().generate();
        let isLifafaCreated = false
        if (isAnonymousUser) {
            const functions = getFunctions();
            const createAnonymousLifafa = httpsCallable<{uid: string, lifafaDoc: LifafaDoc, lifafaId: string},
            {isSuccess: boolean, error?: any, result? : any, lifafaCount?: number}
                >(functions, "createAnonymousLifafa")
            const result = await createAnonymousLifafa({
                uid,
                lifafaDoc: lifafa,
                lifafaId
            })
            isLifafaCreated = !!(result.data.isSuccess && !result.data.lifafaCount)
            if (result.data.isSuccess && result.data.lifafaCount) {
                toast.info('Login to get complete access')
            }
        } else {
            const batch = writeBatch(db);
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
        }
        if (isLifafaCreated) {
            toast.success('Created Successfully!!')
        }
        return Promise.resolve(convertLifafaToFE(lifafaId, lifafa));
    } catch(error) {
        toast.error('Failed!!')
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
        toast.success('Joined Successfully!!')
        return Promise.resolve(convertSharedUserToFE(uid, user));
    } catch (error) {
        toast.error('Failed!!')
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
                await deleteDoc(doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.sharedUsers, item.id))
            } catch (error) {
                
            }
        })
        await deleteDoc(doc(db, COLLECTIONS.LIFAFA.index, lifafaId, COLLECTIONS.LIFAFA.private, uid))
        await deleteDoc(doc(db, COLLECTIONS.LIFAFA.index, lifafaId));
        toast.success('Deleted Successfully!!')
    } catch (error) {
        toast.error('Failed!!')
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
        toast.success('Joined Successfully!!')
        return Promise.resolve(convertSharedUserToFE(uid, access));
    } catch (err) {
        toast.error('Failed!!')
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
        toast.success('Left Successfully!!')
        return Promise.resolve(lifafaId);
    } catch (err) {
        toast.error('Failed!!')
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
        toast.success('Left Successfully!!')
        return Promise.resolve(lifafaId);
    } catch (error) {
        toast.error('Failed!!')
        return Promise.reject(handleError(error));
    }
}
