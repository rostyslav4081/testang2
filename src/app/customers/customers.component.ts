import { Component } from '@angular/core';
import {Customer} from "../models/customer";
import {CustomerService} from "../services/customer.service";
import {OrderService} from "../services/order.service";
import {ModalService} from "@developer-partners/ngx-modal-dialog";
import {CreateEditCustomerComponent} from "../create-edit-customer/create-edit-customer.component";




@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers: Customer[] = [];

  constructor(private customerService: CustomerService,private orderService: OrderService,private readonly modalService: ModalService) { }
  public createCustomer():void{
    this.modalService.show<Customer>(CreateEditCustomerComponent,{title:"Create Customer"}).result().subscribe((customer: Customer) => {
      this.customers?.push(customer);
    });
  }
  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customerService.getCustomers()
      .subscribe(customers => this.customers = customers);
  }

  add(firstName: string, lastName: string, email: string, phone: string): void {
    if (!firstName || !lastName || !email || !phone) {
      return;
    }
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    phone = phone.trim();


    this.customerService.addCustomer({firstName, lastName, email, phone} as Customer)
      .subscribe((customer: Customer) => {
        this.customers.push(customer);
      });
  }


  delete(customer: Customer): void {
    this.customers = this.customers.filter(c => c !== customer);
    this.customerService.deleteCustomer(customer.id).subscribe(
      () => {
        console.log('Customer deleted successfully.');
      },
      error => {
        console.error('Error deleting customer:', error);
      }
    );
    this.orderService.deleteOrderByCustemerId(customer.id).subscribe(
      () => {
        console.log('Orders deleted successfully.');
      },
      error => {
        console.error('Error deleting orders:', error);
      }
    );
  }

}
