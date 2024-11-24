import { Dispatch } from "react"
import { RatnaDocUpdate } from "../../types/firebaseDocument"
import { RatnaFE } from "../../types/documentFETypes"
import { deleteRatna, getRatnas, updateRatna } from "../../api/ratna"

export const RatnaActions = {
    FETCH_ALL: 'ratna/fetch_all' as const,
    CREATE: 'ratna/create' as const,
    UPDATE: 'ratna/update' as const,
    DELETE: 'ratna/delete' as const,
    ACTION_STARTED: 'api/action_started' as const,
    ACTION_COMPLETED: 'api/action_completed' as const,
    ACTION_FAILED: 'api/action_failed' as const,
}

export const RatnaActionFactory = {
    actionStarted: () => ({
        type: RatnaActions.ACTION_STARTED
    }),
    actionFailed: () => ({
        type: RatnaActions.ACTION_FAILED
    }),

    createActionCompleted: (ratna: RatnaFE, lifafaId: string) => ({
        type: RatnaActions.CREATE,
        payload: {
            ratna,
            lifafaId
        }
    }),

    fetchAllRatnasCompleted: (lifafaId: string, ratnas: RatnaFE[]) => ({
        type: RatnaActions.FETCH_ALL,
        payload: {
            lifafaId,
            ratnas
        }
    }),

    fetchAllRatna: (lifafaId: string) => {
        return async function(dispatch: Dispatch<RatnaReduxAction>) {
            try {
                dispatch(RatnaActionFactory.actionStarted());
                const result = await getRatnas(lifafaId);
                dispatch(RatnaActionFactory.fetchAllRatnasCompleted(lifafaId, result));
            } catch (error) {
                dispatch(RatnaActionFactory.actionFailed());
            }
        }
    },

    deleteRatna: (lifafaId: string, ratnaId: string) => {
        return async function(dispatch: Dispatch<RatnaReduxAction>) {
            try {
                dispatch(RatnaActionFactory.actionStarted());
                await deleteRatna(lifafaId, ratnaId);
                dispatch(RatnaActionFactory.deleteRatnaCompleted(lifafaId, ratnaId));
            } catch (error) {
                dispatch(RatnaActionFactory.actionFailed());
            }
        }
    },

    deleteRatnaCompleted: (lifafaId: string, ratnaId: string) => ({
        type: RatnaActions.DELETE,
        payload: {
            lifafaId,
            ratnaId
        }
    }),

    updateRatnaCompleted: (ratna: RatnaDocUpdate, lifafaId: string, ratnaId: string) => ({
        type: RatnaActions.UPDATE,
        payload: {
            ratna,
            lifafaId,
            ratnaId
        }
    }),

    updateRatna: (ratna: RatnaDocUpdate, lifafaId: string, ratnaId: string) => {
        return async function(dispatch: Dispatch<RatnaReduxAction>) {
            try {
                dispatch(RatnaActionFactory.actionStarted());
                const result = await updateRatna(ratna, lifafaId, ratnaId);
                dispatch(RatnaActionFactory.updateRatnaCompleted(result, lifafaId, ratnaId));
            } catch (error) {
                dispatch(RatnaActionFactory.actionFailed());
            }
        }
    },
}

export type RatnaReduxAction = ReturnType<typeof RatnaActionFactory.actionFailed> |
ReturnType<typeof RatnaActionFactory.actionStarted> |
ReturnType<typeof RatnaActionFactory.updateRatnaCompleted> |
ReturnType<typeof RatnaActionFactory.deleteRatnaCompleted> |
ReturnType<typeof RatnaActionFactory.fetchAllRatnasCompleted> |
ReturnType<typeof RatnaActionFactory.createActionCompleted>

export type RatnaReduxPayloadType = RatnaCreate | RatnaFetch | RatnaDelete | RatnaUpdate;

export type RatnaCreate = Parameters<typeof RatnaActionFactory.createActionCompleted>;
export type RatnaFetch = Parameters<typeof RatnaActionFactory.fetchAllRatnasCompleted>;
export type RatnaDelete = Parameters<typeof RatnaActionFactory.deleteRatnaCompleted>;
export type RatnaUpdate = Parameters<typeof RatnaActionFactory.updateRatnaCompleted>

