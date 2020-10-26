export interface Event {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    organization: { id: string; name: string };
    category: { id: string; name: string };
    image: string;
    isAttendable: string;
    deadline: string;
    publisher: string;
}

export interface Category {
    id: string;
    name: string;
}
