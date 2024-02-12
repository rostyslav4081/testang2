import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of, tap } from "rxjs";

import {MessageService} from "../messages/messages.service";
import {Customer} from "../models/customer";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {



  private customersUrl = 'api/customers';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl)
      .pipe(
        tap(_ => this.log('fetched customers')),
        catchError(this.handleError<Customer[]>('getCustomers', []))
      );
  }


  /** GET hero by id. Return `undefined` when id not found */
  getCustomerNo404<Data>(id: number): Observable<Customer> {
    const url = `${this.customersUrl}/?id=${id}`;
    return this.http.get<Customer[]>(url)
      .pipe(
        map(customers => customers[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} customer id=${id}`);
        }),
        catchError(this.handleError<Customer>(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getCustomer(id: number): Observable<Customer> {
    const url = `${this.customersUrl}/${id}`;
    return this.http.get<Customer>(url).pipe(
      tap(_ => this.log(`fetched customer id=${id}`)),
      catchError(this.handleError<Customer>(`getCustomer id=${id}`))
    );
  }


  /* GET heroes whose name contains search term */
  searchEmail(term: string): Observable<Customer[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Customer[]>(`${this.customersUrl}/?email=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Customer[]>('searchCustomers', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.customersUrl, customer, this.httpOptions).pipe(
      tap((newCustomer: Customer) => this.log(`added customer w/ id=${newCustomer.id}`)),
      catchError(this.handleError<Customer>('addCustomer'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteCustomer(id: number): Observable<Customer> {
    const url = `${this.customersUrl}/${id}`;

    return this.http.delete<Customer>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted customer id=${id}`)),
      catchError(this.handleError<Customer>('deleteCustomer'))
    );
  }

  /** PUT: update the hero on the server */
  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(this.customersUrl, customer, this.httpOptions).pipe(
      tap(_ => this.log(`updated customer id=${customer.id}`)),
      catchError(this.handleError<any>('updateCustomer'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }


}
