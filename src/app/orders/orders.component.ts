import { Component } from '@angular/core';
import {Order} from "../models/order";
import {OrderService} from "../services/order.service";
import {catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, Subject, switchMap} from "rxjs";
import {Customer} from "../models/customer";
import {CustomerService} from "../services/customer.service";
import {StatusOrder} from "../models/status-order";

import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  orders: Order[] = [];
  selectedStatus: string = '';
  customers$!: Observable<Customer[]>;
  private searchTerms = new Subject<string>();

  constructor(private orderService: OrderService,private customerService: CustomerService,public dialog: MatDialog) { }





  // Push a search term into the observable stream.
  showResults: boolean = false;
  public selectedEmail= new Subject<string>();


  selectCustomer(email: string) {

    this.selectedEmail.next(email);
  }
  search(term: string): void {
    this.searchTerms.next(term);
    this.showResults = true;
  }
  ngOnInit(): void {
    this.getOrders();
    this.customers$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.customerService.searchEmail(term)),
    );

  }

  getOrders(): void {
    this.orderService.getOrders()
      .subscribe(orders => this.orders = orders);

  }

  add(numberOrder: string, dateOrder: string,emailOrder: string, value: number, status: string): void {
    if (!numberOrder || !dateOrder || !value || !status|| !emailOrder) {
      return;
    }
    numberOrder = numberOrder.trim();
    dateOrder = dateOrder.trim();

    status = status.trim();
    emailOrder = emailOrder.trim()
    this.customerService.getCustomers().pipe(
      map(customers => customers.find(customer => customer.email === emailOrder)),
      filter(customer => !!customer), // Фільтруємо, щоб перевірити, чи існує клієнт з введеним email
      map(customer => customer?.id), // Використовуємо операцію '?', щоб уникнути помилки, якщо 'customer' - 'undefined'
    ).subscribe(idCustomer => {
      if (idCustomer !== undefined) {
        const orderToAdd = {numberOrder, dateOrder, value, status, idCustomer} as Order;
        this.orderService.addOrder(orderToAdd)
          .subscribe((order: Order) => {
            this.orders.push(order);
          });
      }
    });


  }
  get filteredOrders(): Order[] {
    if (this.selectedStatus === '') {
      return this.orders; // Повертаємо всі замовлення, якщо статус не вибрано
    } else {
      return this.orders.filter(order => order.status === this.selectedStatus); // Фільтруємо замовлення за вибраним статусом
    }
  }
  delete(order: Order): void {
    this.orders = this.orders.filter(h => h !== order);
    this.orderService.deleteOrder(order.id).subscribe();
  }

  private stringToOrderStatus(statusString: string): StatusOrder {
    switch (statusString) {
      case 'nová':
        return StatusOrder.New;
      case 'přijatá':
        return StatusOrder.Accepted;
      case 'vyřízeno':
        return StatusOrder.Completed;
      default:
        throw new Error('Invalid status string');
    }
  }

  updateOrder(id: number, numberOrder: string, dateOrder: string, value: string, statusString: string, idCustomer: number): void {
    const valueOrder: number = parseInt(value, 10);
    const status: StatusOrder = this.stringToOrderStatus(statusString); // Convert string to OrderStatus enum

    this.orderService.updateOrder({ id, numberOrder, dateOrder, value: valueOrder, status, idCustomer } as Order).subscribe(
      () => {
        console.log('Order updated successfully.');
      },
      error => {
        console.error('Error updating order:', error);
      }
    );
  }


}
