export interface UserCreate {
    firstName: string;
    lastName: string;
    email: string;
    picture?: string;
    passwordHash: string;
    homeAddress: string;
}
