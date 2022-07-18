import {maxLength, minLength, required} from "@rxweb/reactive-form-validators";

export class QnaList {
    @required()
    @minLength({value: 5})
    @maxLength({value: 50})
    question: string;

    @required()
    @minLength({value: 10})
    @maxLength({value: 100})
    answer: string;
}
