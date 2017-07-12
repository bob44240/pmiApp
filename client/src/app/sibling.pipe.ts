import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sibling'
})
export class SiblingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? 'yes' : 'no';
  }

}
