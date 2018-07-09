import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ceil'
})
export class CeilPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Math.ceil(value);
  }

}
