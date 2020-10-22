export interface ArchivedDocument {
    id: string;
    title: string;
    description: string;
    date: string;
    typeDoc: string;
    urls: {
        thumbnail: string;
        url: string;
    };
}
