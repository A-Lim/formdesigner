  
import { FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { FieldTypeID } from './fieldtype.model';

export default class ValidationUtil {
  
  // field will be required if currentFieldTypeID matches the specified fieldTypeID
  static requiredIfFieldTypeID(currentFieldTypeID: number, fieldTypeIDs: FieldTypeID | FieldTypeID[]): ValidatorFn {
    return (control: AbstractControl) => {
      // if control is empty
      // and currentFieldTypeID and specified fieldTypeID matched
      let conditionsMatch = false;
      if (fieldTypeIDs instanceof Array)
        conditionsMatch = fieldTypeIDs.includes(currentFieldTypeID);
      else 
        conditionsMatch = currentFieldTypeID === fieldTypeIDs

      if (control.value && conditionsMatch)
        return { requiredIfFieldTypeID: true };

      return null;
    }
  };
}