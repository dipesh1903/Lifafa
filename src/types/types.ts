import { User } from "firebase/auth";

export interface UserInfo {
    name: User['displayName'],
    photoUrl: User['photoURL'],
    email: User['email'],
    uid: User['uid']

}
