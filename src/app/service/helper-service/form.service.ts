import {ElementRef, Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
  ) { }

    uppercaseFirstInput(value: any) {
        value ? value = value[0].toUpperCase() + value.slice(1): null;
        return value;
    }

    public validateFormFields(formGroup: FormGroup, el : ElementRef) {
        formGroup.markAllAsTouched();

        for (const key of Object.keys(formGroup.controls)) {

            if (formGroup.controls[key].invalid) {
                // option 1
                const invalidControl = el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                if (invalidControl) {
                    invalidControl.focus();
                }
                break;

                // option 2
                // let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
                // if ((invalidFields).length != 0) {
                //     invalidFields[1].focus();
                // break;
                // }
            }
        }
    }

}
