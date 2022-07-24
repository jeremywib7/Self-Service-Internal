import {compare, prop, required} from "@rxweb/reactive-form-validators";

export class ChangePassword {
    @prop()
    id: string;

    @required()
    oldPassword: string;

    @required()
    newPassword: string;

    @compare({fieldName: 'newPassword'})
    @required()
    confirmationNewPassword: string;
}
