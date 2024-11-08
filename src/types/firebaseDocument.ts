import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { LifafaAccessType } from "../constant";
import { UserInfo } from "./types";

export interface LifafaDoc extends DocCreaterInfo {
    name: string;
    sharedUserId: string[];
    tags: string[];
    accessType: LifafaAccessType;
    description: string;
    userInfo?: UserInfo;
    publicJoinedUserId?: string[];
}

interface DocCreaterInfo {
    createdBy: string;
    createdAt: Timestamp;
}

export interface DocUpdaterInfo {
    updatedAt: Timestamp;
}

export interface LifafaDocUpdate extends Partial<Omit<LifafaDoc, "createdBy" | "createdAt">>, DocUpdaterInfo{};

export type Action<TPayload> = {
    type: string;
    payload: TPayload;
}

export interface ReducerAction<P> {
    type: string;
    payload: P;
}

export interface RatnaDoc extends DocCreaterInfo {
    name?: string;
    content: string;
    description?: string;
    tags?: string[];
    isFavourite?: boolean;
    info?: string;
    creatorName: string
}

export interface RatnaDocUpdate extends Partial<Omit<RatnaDoc, "createdBy" | "createdAt">>, DocUpdaterInfo {}

export interface SharedUserDoc {
    accessType: LifafaAccessType,
    name: User["displayName"],
    photoUrl?: User["photoURL"],
    joinedAt: Timestamp,
    password?: string;
}

export interface SharedUserDocUpdate extends Pick<SharedUserDoc, "accessType" | "password">, DocUpdaterInfo {}