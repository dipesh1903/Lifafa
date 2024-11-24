import { Dispatch, Reducer, ReducerState } from "react"
import { LifafaDoc, LifafaDocUpdate } from "../../types/firebaseDocument"
import { createLifafa, fetchLifafa, getAllLifafa, updateLifafa } from "../../api/api"
import { LifafaFE, SharedUserFE } from "../../types/documentFETypes"
import { LifafaContextDataType } from "./context"
import { UserAccessReduxAction } from "../UsersAccess/actionCreator"


type state = (() => ReducerState<Reducer<LifafaContextDataType, LifafaReduxAction>>);

export const LifafaActions = {
    FETCH_ALL: 'lifafa/fetch_all' as const,
    CREATE: 'lifafa/create' as const,
    UPDATE: 'lifafa/update' as const,
    DELETE: 'lifafa/delete' as const,
    ACTION_STARTED: 'api/action_started' as const,
    ACTION_COMPLETED: 'api/action_completed' as const,
    ACTION_FAILED: 'api/action_failed' as const,
    FETCH_SINGLE: 'lifafa/fetch_single' as const
}


export const LifafaActionFactory = {
    lifafaActionStarted: () => ({
        type: LifafaActions.ACTION_STARTED
    }),
    lifafaActionFailed: () => ({
        type: LifafaActions.ACTION_FAILED
    }),

    fetchSingleLifafaCompleted: (lifafa: LifafaFE, access: SharedUserFE) => ({
        type: LifafaActions.FETCH_SINGLE,
        payload: {
            lifafa,
            access
        }
    }),

    fetchLifafa: (lifafaId: string, uid: string, force: boolean = false) => {
        return async function(dispatch: Dispatch<LifafaReduxAction | UserAccessReduxAction>, getState?: state) {
            try {
                if ((getState?.().data && !getState().data[lifafaId]) && !getState().data[lifafaId].userAccess[uid].id || !!force) {
                    dispatch(LifafaActionFactory.lifafaActionStarted());
                    const result = await fetchLifafa(lifafaId, uid);
                    if (result?.access.id)
                    dispatch(LifafaActionFactory.fetchSingleLifafaCompleted(result.lifafa, result.access));
                }
            } catch (error) {
                dispatch(LifafaActionFactory.lifafaActionFailed());
            }
        }
    },

    createLifafa: (payload: LifafaDoc, uid: string) => {
        return async function(dispatch: Dispatch<LifafaReduxAction>) {
            try {
                dispatch(LifafaActionFactory.lifafaActionStarted());
                const result = await createLifafa(payload, uid);
                dispatch(LifafaActionFactory.createLifafaCompleted(result));
            } catch (error) {
                dispatch(LifafaActionFactory.lifafaActionFailed());
            }
        }
    },

    updateLifafa: (payload: {update: LifafaDocUpdate, lifafaId: string}) => {
        return async function(dispatch: Dispatch<LifafaReduxAction>) {
            try {
                dispatch(LifafaActionFactory.lifafaActionStarted());
                const result = await updateLifafa(payload.update, payload.lifafaId, '');
                dispatch(LifafaActionFactory.updateLifafaCompleted(result.lifafa, result.lifafaId));
            } catch (error) {
                dispatch(LifafaActionFactory.lifafaActionFailed());
            }
        }
    },

    updateLifafaCompleted: (lifafa: LifafaDocUpdate, lifafaId: string) => ({
        type: LifafaActions.UPDATE,
        payload: {
            lifafa,
            lifafaId
        }
    }),

    fetchAllLifafaCompleted: (lifafa: LifafaFE[]) => ({
        type: LifafaActions.FETCH_ALL,
        payload: {
            lifafa
        }
    }),


    createLifafaCompleted: (lifafa: LifafaFE) => ({
        type: LifafaActions.CREATE,
        payload: {
            lifafa,
        }
    }),

    deleteLifafaCompleted: (lifafaId: string) => ({
        type: LifafaActions.DELETE,
        payload: {
            lifafaId
        }
    }),

    fetchAllLifafa: (uid: string, force?: boolean ) => {
        return async function(dispatch: Dispatch<LifafaReduxAction>, getState?: state) {
            try {
                if (!getState?.().isAllLoaded || !!force) {
                    dispatch(LifafaActionFactory.lifafaActionStarted());
                    const result = await getAllLifafa(uid);
                    dispatch(LifafaActionFactory.fetchAllLifafaCompleted(result));
                }
            } catch (error) {
                dispatch(LifafaActionFactory.lifafaActionFailed());
            }
        }
    },
}

export type LifafaReduxAction = ReturnType<typeof LifafaActionFactory.lifafaActionStarted> | 
ReturnType<typeof LifafaActionFactory.lifafaActionFailed> |
ReturnType<typeof LifafaActionFactory.createLifafaCompleted> |
ReturnType<typeof LifafaActionFactory.fetchAllLifafaCompleted> |
ReturnType<typeof LifafaActionFactory.updateLifafaCompleted> |
ReturnType<typeof LifafaActionFactory.deleteLifafaCompleted> |
ReturnType<typeof LifafaActionFactory.fetchSingleLifafaCompleted> |
UserAccessReduxAction
;

export type LifafaReduxPayloadType = LifafaCreate | LifafaFetch | LifafaDelete| LifafaUpdate | LifafaSingleFetch;

export type LifafaCreate = Parameters<typeof LifafaActionFactory.createLifafaCompleted>;
export type LifafaFetch = Parameters<typeof LifafaActionFactory.fetchAllLifafaCompleted>;
export type LifafaSingleFetch = Parameters<typeof LifafaActionFactory.fetchSingleLifafaCompleted>;
export type LifafaDelete = Parameters<typeof LifafaActionFactory.deleteLifafaCompleted>;
export type LifafaUpdate = Parameters<typeof LifafaActionFactory.updateLifafaCompleted>;