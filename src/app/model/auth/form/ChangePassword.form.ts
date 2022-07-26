import {compare, prop, required} from "@rxweb/reactive-form-validators";

export class ChangePasswordForm {
    @prop()
    username: string;

    @required()
    oldPassword: string;

    @required()
    newPassword: string;

    @compare({fieldName: 'newPassword', message: 'Password not matched'})
    @required()
    confirmNewPassword: string;
}
