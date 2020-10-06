export interface Event {
    id: string;
    title: string;
    description: string;
    starttime: string;
}

export interface CreateEventData {
    createEvent: {
        event: Event;
    };
}

export interface GetEventsData {
    allEvents: Event[];
}
