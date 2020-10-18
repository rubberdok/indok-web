export interface Listing {
    id: string;
    title: string;
    description: string;
    startDateTime: string;
    deadline: string;
    endDateTime: string;
    url: string;
    slug: string;
    organization?: Organization;
    responses?: Response[];
}

export interface Response {
    id: string;
    response: string;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    description: string;
    parent?: Organization;
    children?: Organization[];
}
