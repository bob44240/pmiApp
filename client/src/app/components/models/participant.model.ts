export class Participant {
    _id?: string;
    name: string;
    email: string;
    // Small change
    age: number;
    reviewed: number;
    siblings: boolean;
    exposures: string;
    lastUpdate: Date;
    created: Date;
    mutations: string;
    phone: {
        mobile: string;
        work: string;
    };
}
