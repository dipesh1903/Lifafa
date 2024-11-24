import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LifafaDataType } from '../store/lifafas/context';
import { LifafaAccessType } from '../constant';
import { LifafaFE, RatnaFE, SharedUserFE } from '../types/documentFETypes';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(urlString: string): boolean {
    let url;
    try { 
          url =new URL(urlString); 
    }
    catch(e){ 
      return false; 
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

export function categorizeLifafa(lifafaData: LifafaDataType, uid: string): {
  protectedLifafas: LifafaDataType,
  privateLifafas: LifafaDataType,
  publicLifafas: LifafaDataType
} {
  const protectedLifafas: LifafaDataType = {}

  const privateLifafas: LifafaDataType = {}

  const publicLifafas: LifafaDataType = {}

  Object.keys(lifafaData).forEach(lifafaId => {
    const { accessType, createdBy, publicJoinedUserId, sharedUserId } = lifafaData[lifafaId].lifafa;
    if (accessType === LifafaAccessType.PRIVATE) {
      privateLifafas[lifafaId] = {...lifafaData[lifafaId]}
    } else if (accessType === LifafaAccessType.PUBLIC && (createdBy === uid || (publicJoinedUserId && publicJoinedUserId.includes(uid)))) {
      publicLifafas[lifafaId] = {...lifafaData[lifafaId]}
    } else if (accessType === LifafaAccessType.PROTECTED && (createdBy === uid || (sharedUserId && sharedUserId.includes(uid)))) {
      protectedLifafas[lifafaId] = {...lifafaData[lifafaId]}
    }
  })

  return {
    publicLifafas,
    protectedLifafas,
    privateLifafas
  }
}

export function isUserHasPublicAccess(lifafa: LifafaFE, uid: string): boolean {
  const { accessType, publicJoinedUserId } = lifafa;
  return !!(accessType === LifafaAccessType.PUBLIC && (isLifafaOwner(lifafa, uid) || (publicJoinedUserId && publicJoinedUserId.includes(uid))));
}

export function isUserHasProtectedAccess(lifafa: LifafaFE, uid: string): boolean {
  const { accessType, sharedUserId } = lifafa;
  return !!(accessType === LifafaAccessType.PROTECTED && (isLifafaOwner(lifafa, uid) || (sharedUserId && sharedUserId.includes(uid))));
}

export function isLifafaOwner(lifafa: LifafaFE, uid: string): boolean {
  return !!(lifafa.createdBy === uid)
}

export function isUserHasPrivateAccess(lifafa: LifafaFE, uid: string): boolean {
  const { accessType } = lifafa;
  return !!(accessType === LifafaAccessType.PRIVATE && isLifafaOwner(lifafa, uid))
}

export function isPasswordMatching(access: SharedUserFE): boolean {
  return !!(access && access.password)
}

export function isProtectedLifafaPasswordChanged(lifafa: LifafaFE, access: SharedUserFE): boolean {
  return !!(!isPasswordMatching(access) && lifafa.sharedUserId.includes(access.id));
}

export function isUserHasLifafaAccess(lifafa: LifafaFE, uid: string): boolean {
  return (isLifafaOwner(lifafa, uid) || isUserHasProtectedAccess(lifafa, uid) || isUserHasPublicAccess(lifafa, uid));
}

export function isRatnaCreator(ratna: RatnaFE, uid: string): boolean {
  return !!(ratna.createdBy === uid);
}

export function getDisplayName(name: string): string {
  if (!!name) {
    const arr = name.trim().split(/\s+/)
    return arr.map(item => item[0].toUpperCase()).join('')
  } else {
    return 'MR'
  }
}