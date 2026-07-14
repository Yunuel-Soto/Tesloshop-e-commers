export interface User {
    id: string;
    name: string;
    email: string;
    emailverify?: Date | null;    
    password: string;
    role: string;
    image?: string | null;
}