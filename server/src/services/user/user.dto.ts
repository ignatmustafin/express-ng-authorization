export default class UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;

    constructor(model: any) {
        this.id = model.id;
        this.email = model.email;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
    }
}