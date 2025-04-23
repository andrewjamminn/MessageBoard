interface User {
    admin: boolean;
    id: number;
    username: string;
    password: string;
    favcolor?: string;
}

interface Comment {
    id: number;
    author: User;
    content: string;
    deleted?: boolean;
    edited?: boolean;
}

interface Post {
    id: number;
    author: User;
    title: string;
    timestamp: string;
    contents: string;
    comments: Comment[]
}

export type { User, Comment, Post };