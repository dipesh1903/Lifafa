import { LifafaFE, RatnaFE, SharedUserFE } from "../../types/documentFETypes"

export interface LifafaContextType extends LifafaFE {
    ratna: {
        [id: string]: Omit<RatnaFE , "id">
    },
    sharedUsers: {
        [id: string]: Omit<SharedUserFE , "id">
    }
}