import { Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";



@Injectable({
    providedIn: 'root'
  })
export class FormValidator {

 validateForm(form: NgForm): boolean {
        const keys = Object.keys(form.value);
        let errors: any = [];
        const customControl = document.querySelector('#portada-name');
    
        for (let i = 0; i <= keys.length; i++) {
          const control = document.querySelector(`#${keys[i]}`);
         // Adding error class
          if (control && control.classList.contains('ng-invalid') && control.getAttribute('name') === keys[i] ) {
            if (control.getAttribute('name') === 'content') {
              control.classList.add('text-editor-error');
              errors.push(keys[i]);
            } else {
              control.classList.add('error');
              customControl?.classList.add('error');
              errors.push(keys[i]);

            }
          } 
          
        // Removing error class
          if (control && control.classList.contains('ng-valid') && control.getAttribute('name') === keys[i]) { 
            if (control.getAttribute('name') === 'content') {
              control.classList.remove('text-editor-error');
              for (let j = 0; j <= errors.length; j++) {
                if (errors[j] === keys[i]) {
                  errors[j] = null;
                }
              }
            } else {
              control?.classList.remove('error');
              customControl?.classList.remove('error');
              for (let j = 0; j <= errors.length; j++) {
                if (errors[j] === keys[i]) {
                  errors[j] = null;
                }
              }
            }
          } 
          
    }
          return errors.length > 0 ? false : true;
}
}


