import { Dispatch } from "react"
import { LifafaDocUpdate, SharedUserDoc } from "../../types/firebaseDocument"
import { SharedUserFE } from "../../types/documentFETypes"
import { addUser, getAllusersForLifafa } from "../../api/api"
import { LifafaActionFactory, LifafaReduxAction } from "../lifafas/actionCreator"
import { getCurrentUserLifafaAccess } from "../../api/ratna"

export const UserAccessActions = {
    FETCH_ALL: 'userAccess/fetch_all' as const,
    CREATE: 'userAccess/create' as const,
    UPDATE: 'userAccess/update' as const,
    DELETE: 'userAccess/delete' as const,
    ACTION_STARTED: 'api/action_started' as const,
    ACTION_COMPLETED: 'api/action_completed' as const,
    ACTION_FAILED: 'api/action_failed' as const,
    FETCH_SINGLE: 'userAccess/fetch_single' as const
}

export const UserAccessActionFactory = {
    actionStarted: () => ({
        type: UserAccessActions.ACTION_STARTED
    }),
    actionFailed: () => ({
        type: UserAccessActions.ACTION_FAILED
    }),

    createActionCompleted: (user: SharedUserFE, lifafaId: string) => ({
        type: UserAccessActions.CREATE,
        payload: {
            user,
            lifafaId
        }
    }),

    addUserToLifafa: (userAccess: SharedUserDoc, uid: string, lifafaId: string) => {
        return async function(dispatch: Dispatch<UserAccessReduxAction | LifafaReduxAction>) {
            try {
                dispatch(UserAccessActionFactory.actionStarted());
                const result = await addUser(uid, lifafaId, userAccess);
                dispatch(LifafaActionFactory.updateLifafaCompleted({sharedUser: [uid],
                    updatedAt: userAccess.joinedAt} as LifafaDocUpdate, lifafaId));
                dispatch(UserAccessActionFactory.createActionCompleted(result, lifafaId));
            } catch (error) {
                dispatch(LifafaActionFactory.lifafaActionFailed());
            }
        }
    },

    fetchAllCompleted: (lifafaId: string, users: SharedUserFE[]) => ({
        type: UserAccessActions.FETCH_ALL,
        payload: {
            lifafaId,
            users
        }
    }),

    fetchSingleUserAccessCompleted: (lifafaId: string, users: SharedUserFE) => ({
        type: UserAccessActions.FETCH_SINGLE,
        payload: {
            lifafaId,
            users
        }
    }),

    fetchAllUserForLifafa: (lifafaId: string) => {
        return async function(dispatch: Dispatch<UserAccessReduxAction>) {
            try {
                dispatch(UserAccessActionFactory.actionStarted());
                const result = await getAllusersForLifafa(lifafaId);
                dispatch(UserAccessActionFactory.fetchAllCompleted(lifafaId, result));
            } catch (error) {
                dispatch(UserAccessActionFactory.actionFailed());
            }
        }
    },

    fetchUserForLifafa: (lifafaId: string, uid: string) => {
        return async function(dispatch: Dispatch<UserAccessReduxAction>) {
            try {
                dispatch(UserAccessActionFactory.actionStarted());
                const result = await getCurrentUserLifafaAccess(lifafaId, uid);
                dispatch(UserAccessActionFactory.fetchSingleUserAccessCompleted(lifafaId, result));
            } catch (error) {
                dispatch(UserAccessActionFactory.actionFailed());
            }
        }
    },
}

export type UserAccessReduxAction = ReturnType<typeof UserAccessActionFactory.actionFailed> |
ReturnType<typeof UserAccessActionFactory.actionStarted> |
ReturnType<typeof UserAccessActionFactory.fetchAllCompleted> |
ReturnType<typeof UserAccessActionFactory.createActionCompleted> |
ReturnType<typeof UserAccessActionFactory.fetchSingleUserAccessCompleted>

export type UserAccessPayloadType = UserAccessCreate | UserAccessFetch | UserAccessSingleFetch;

export type UserAccessCreate = Parameters<typeof UserAccessActionFactory.createActionCompleted>;
export type UserAccessFetch = Parameters<typeof UserAccessActionFactory.fetchAllCompleted>;
export type UserAccessSingleFetch = Parameters<typeof UserAccessActionFactory.fetchSingleUserAccessCompleted>;
