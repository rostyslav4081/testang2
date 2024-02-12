import { Component } from '@angular/core';
import {Customer} from "../models/customer";
import {ModalReference} from "@developer-partners/ngx-modal-dialog";


@Component({
  selector: 'app-create-edit-customer',
  templateUrl: './create-edit-customer.component.html',
  styleUrl: './create-edit-customer.component.css'
})
export class CreateEditCustomerComponent {
  public customer!: Customer;

  constructor(private readonly modalReference: ModalReference<Customer>) {
  }

  public cancel(): void {
    this.modalReference.cancel();
  }

  public saveData(): void {
    this.modalReference.closeSuccess(this.customer);

  }

}
