export interface Booking {
    id: string;
    firstname: string;
    surname: string;
    phone: number;
    receiverEmail: string;
    bookFrom: string;
    bookTo: string;
    price: number;
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
