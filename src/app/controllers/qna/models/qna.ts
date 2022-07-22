import {maxLength, minLength, prop, required} from "@rxweb/reactive-form-validators";

export class Qna {
    @prop()
    id: string;

    @prop()
    number: number;

    @required()
    @minLength({value: 5})
    @maxLength({value: 50})
    question: string;

    @required()
    @minLength({value: 10})
    @maxLength({value: 100})
    answer: string;

    createdOn: Date;
    updatedOn: Date;
}

