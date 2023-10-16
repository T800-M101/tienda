import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    // if(value === '' || arg.length < 3) return value;
    const items = [];
    for (const item of value) {
      // Pipe for customers
      if (item.name && item.lastname && item.email && item.phone) {
        if (
          item.name.toLocaleLowerCase().indexOf(arg.toLocaleLowerCase()) > -1 ||
          item.lastname.toLocaleLowerCase().indexOf(arg.toLocaleLowerCase()) > -1 ||
          item.email.toLocaleLowerCase().indexOf(arg.toLocaleLowerCase()) > -1 ||
          item.phone.toLocaleLowerCase().indexOf(arg.toLocaleLowerCase()) > -1
        ) {
          items.push(item);
        }
      }
      // Pipe for products
      else if (item.name) {
        if (
          item.name.toLocaleLowerCase().indexOf(arg.toLocaleLowerCase()) > -1
        ) {
          items.push(item);
        }
      }
      // Pipe for coupons
      else if (item.code && item.type) {
        if (
          item.code.toLocaleLowerCase().indexOf(arg.toLocaleLowerCase()) > -1 ||
          item.type.toLocaleLowerCase().indexOf(arg.toLocaleLowerCase()) > -1
        ) {
          items.push(item);
        }
      }
    }

    return items;
  }
}
