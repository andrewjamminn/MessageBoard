interface User {
    id: string;
    username: string;
    password: string;
    favcolor?: string;
}

interface Comment {
    id: string;
    author: User;
    content: string;
    deleted?: boolean;
    edited?: boolean;
}

interface Post {
    id: string;
    author: User;
    title: string;
    timestamp: string;
    contents: string;
    comments: Comment[]
}

export type { User, Comment, Post };