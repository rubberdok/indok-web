export interface BookingType {
    id: string;
    contactNum: number;
    contactPerson: string;
    startDay: string;
    endDay: string;
}

export interface QueryVariables {
    year: string;
    month: string;
}
