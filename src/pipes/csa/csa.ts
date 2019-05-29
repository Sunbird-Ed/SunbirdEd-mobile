import { Pipe, PipeTransform } from '@angular/core';

/**
  Comma seperated array pipe
  Checks the value and if it is array returns a comma separated string
 */

@Pipe({
  name: 'csa',
})
export class CSAPipe implements PipeTransform {

  transform(value: string | string[]) {
    if (typeof value === 'string') {
        return value;
    } else if (value instanceof Array) {
        return value.join(', ');
    } else {
        return value;
    }
  }
}
