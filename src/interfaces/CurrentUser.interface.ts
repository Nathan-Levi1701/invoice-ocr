import { User } from "firebase/auth";

export interface CurrentUser {
    user: User
    role?: string
}