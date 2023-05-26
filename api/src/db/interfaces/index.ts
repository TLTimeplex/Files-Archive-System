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

export interface report {
    id: number;
    title: string;
    description?: string;
    author_id: number;
    date_created: Date;
    date_modified: Date;
    restrictions?: string;
}
