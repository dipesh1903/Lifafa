import { User } from "firebase/auth";
import { DocUpdaterInfo, LifafaDoc, RatnaDoc, SharedUserDoc } from "./firebaseDocument";

export interface LifafaFE extends LifafaDoc , Partial<DocUpdaterInfo>{
    id: string;
}

export type Action<TPayload> = {
    type: string;
    payload: TPayload;
}

export interface ReducerAction<P> {
    type: string;
    payload?: P;
}

export interface RatnaFE extends RatnaDoc , Partial<DocUpdaterInfo>{
    id: string;
}

export interface SharedUserFE extends SharedUserDoc , Partial<DocUpdaterInfo>{
    id: string;
}

export type loggedUser = User