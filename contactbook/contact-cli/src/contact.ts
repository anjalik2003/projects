export enum Category {
    Family = 'Family',
    Friends = 'Friends',
    Work = 'Work',
  }
  
  export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    category: Category;
  }
  