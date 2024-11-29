import { DocumentData, Timestamp } from "firebase/firestore"
import { LifafaFE, RatnaFE, SharedUserFE } from "../types/documentFETypes"

export function convertLifafaToFE(id: string, data: DocumentData): LifafaFE {
    if (!!data.createdAt && !!data.createdAt['seconds']) {
        data.createdAt = new Timestamp(data.createdAt['seconds'], data.createdAt['nanoseconds']);
    }
    return (
        {
            name: data.name,
            publicJoinedUserId: data.publicJoinedUserId || [],
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            id,
            description: data.description,
            sharedUserId: data.sharedUserId,
            tags: data.tags,
            accessType: data.accessType
        }
    );
}

export function convertRatnaToFE(id: string, data: DocumentData): RatnaFE {
    if (!!data.createdAt && !!data.createdAt['seconds']) {
        data.createdAt = new Timestamp(data.createdAt['seconds'], data.createdAt['nanoseconds']);
    }
    return (
        {
            name: data.name,
            content: data.content,
            description: data.description,
            tags: data.tags,
            isFavourite: data.isFavourite,
            info: data.info,
            id,
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            creatorName: data.creatorName,
            openGraphInfo: data.openGraphInfo
        }
    )
}

export function convertSharedUserToFE(id: string, data: DocumentData): SharedUserFE {
    if (!!data.joinedAt && !!data.joinedAt['seconds']) {
        data.joinedAt = new Timestamp(data.joinedAt['seconds'], data.joinedAt['nanoseconds']);
    }
    return (
        {
            accessType: data.accessType,
            name: data.name,
            photoUrl: data.photoUrl,
            joinedAt: data.joinedAt,
            password: data.password,
            id
        }
    )
}