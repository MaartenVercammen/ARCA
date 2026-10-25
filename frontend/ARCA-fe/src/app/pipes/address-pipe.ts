import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../interfaces/user-management.interface';

@Pipe({
  name: 'address',
})
export class AddressPipe implements PipeTransform {
  transform(address: Address): string {
    return `${address.street ?? ''} ${address.houseNumber ?? ''}\n ${address.zipCode ?? ''} ${address.city ?? ''}\n ${address.country ?? ''}`;
  }
}
