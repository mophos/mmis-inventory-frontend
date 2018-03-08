import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'monthToTh'
})
export class MonthToThPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const month = moment(value).format('MMM');
    return month;
  }

}
