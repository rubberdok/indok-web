export interface Listing {
    id: string;
    title: string;
    description: string;
    startDatetime: string;
    deadline: string;
    endDatetime: string;
    url: string;
    slug: string;
    organization?: Organization;
    responses?: Response[];
}

export interface Response {
    id: string;
    response: string;
    applicant: User;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    description: string;
    parent?: Organization;
    children?: Organization[];
}

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    year: string;
    email: string;
}
