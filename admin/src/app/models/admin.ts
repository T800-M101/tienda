import { User } from "./user";

export class Admin extends User {
    
    constructor(name = '', lastname = '', email = '', phone = '', public role = '', public dni = ''){
        super(name, lastname, email, phone);
   
    }
    
}


