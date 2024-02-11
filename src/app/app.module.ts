import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CustomersComponent } from './customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { MessagesComponent } from './messages/messages.component';
import {InMemoryDataService} from "./in-memory-data.service";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import {RouterLink} from "@angular/router";

import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";



import { CreateEditCustomerComponent } from './create-edit-customer/create-edit-customer.component';





@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    OrdersComponent,
    MessagesComponent,

    CreateEditCustomerComponent,





  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    ),
    RouterLink,
    FormsModule,

  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
