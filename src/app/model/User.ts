export class User {
    id: string;
    username: string;
    userFirstName: string;
    userLastName: string;
    userPassword: string;
    email: string;
    role: {
        roleName: string;
        roleDescription: string;
    };
    gender: string;
    dateJoined: Date;
    phoneNumber: number;
    address: string;
    imageUrl: string;
    userCode: string;
    bankAccount: number;
    accessToken: string;
}
