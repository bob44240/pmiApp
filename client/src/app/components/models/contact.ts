export class Contact {
  _id?: string;
  name: string;
  email: string;
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
