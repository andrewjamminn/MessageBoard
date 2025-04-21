interface User {
    id: string;
    username: string;
    password: string;
    favcolor?: string;
    posts?: Post[]
}

interface Comment {
    author: User;
    content: string;
}

interface Post {
    author: User;
    title: string;
    contents: string;
    comments?: Comment[]
}

export type { User, Comment, Post };