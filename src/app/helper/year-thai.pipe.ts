import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'yearThai'
})
export class YearThaiPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const year: any = (+moment(value).format('YYYY') + 543);
    return year;
  }

}
