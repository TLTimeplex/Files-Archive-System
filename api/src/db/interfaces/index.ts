export interface users {
    id: number;
    username: string;
    password: string;
}

export interface session {
    token: string;
    user_id: number;
    date_created: Date;
    date_expires: Date;
}