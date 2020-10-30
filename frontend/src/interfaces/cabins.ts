export interface Booking {
    id: string;
    contactNum: number;
    contactPerson: string;
    startDay: string;
    endDay: string;
}

export interface Cabin {
    name: string;
}

export interface BookingFromTo {
    from: Date;
    to: Date;
}

export interface QueryVariables {
    year: string;
    month: string;
    start?: string;
    end?: string;
}
