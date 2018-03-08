import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'convertTimestamp'
})
export class ConvertTimestampPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const d = moment(value, 'x');
    const thaiDate = `${d.format('DD MMM')} ${d.get('year') + 543} ${d.format('HH:mm:ss')}`;
    return thaiDate;
  }

}
