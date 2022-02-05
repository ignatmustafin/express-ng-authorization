export default class UserDto {
    email: any;
    id: any;

    constructor(model: any) {
        this.email = model.email;
        this.id = model.id;
    }
}