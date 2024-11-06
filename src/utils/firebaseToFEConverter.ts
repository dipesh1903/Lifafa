import { DocumentData } from "firebase/firestore"
import { LifafaFE, RatnaFE, SharedUserFE } from "../types/documentFETypes"

export function convertLifafaToFE(id: string, data: DocumentData): LifafaFE {
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
            createdBy: data.createdBy
        }
    )
}

export function convertSharedUserToFE(id: string, data: DocumentData): SharedUserFE {
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