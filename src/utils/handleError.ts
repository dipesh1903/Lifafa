/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiStatus } from "../constant"

export function handleError(error: any): ApiStatus {
    if(typeof error === 'string' && error.includes('permission')) {
        return ApiStatus.MISSING_PERMISSION
    } else {
        return ApiStatus.FAILED
    }
}