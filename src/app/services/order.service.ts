import { Injectable } from '@angular/core';
import {Order} from "../models/order";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageService} from "../messages/messages.service";
import {catchError, map, Observable, of, tap} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersUrl = 'api/orders';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Order[]>('getHeroes', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getOrderNo404<Data>(id: number): Observable<Order> {
    const url = `${this.ordersUrl}/?id=${id}`;
    return this.http.get<Order[]>(url)
      .pipe(
        map(orders => orders[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Order>(`getOrder id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getOrder(id: number): Observable<Order> {
    const url = `${this.ordersUrl}/${id}`;
    return this.http.get<Order>(url).pipe(
      tap(_ => this.log(`fetched order id=${id}`)),
      catchError(this.handleError<Order>(`getorder id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchOrders(term: string): Observable<Order[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Order[]>(`${this.ordersUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found Orders matching "${term}"`) :
        this.log(`no Orders matching "${term}"`)),
      catchError(this.handleError<Order[]>('searchOrders', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.ordersUrl, order, this.httpOptions).pipe(
      tap((newOrder: Order) => this.log(`added order w/ id=${newOrder.id}`)),
      catchError(this.handleError<Order>('addOrder'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteOrder(id: number): Observable<Order> {
    const url = `${this.ordersUrl}/${id}`;

    return this.http.delete<Order>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted order id=${id}`)),
      catchError(this.handleError<Order>('deleteOrder'))
    );
  }
  deleteOrderByCustemerId(customerId: number): Observable<Order> {
    return this.http.delete<Order>(`${this.ordersUrl}/${customerId}`, this.httpOptions).pipe(
      tap(_ => this.log(`deleted order by customer id=${customerId}`)),
      catchError(this.handleError<Order>('deleteOrderByCustomerId'))
    );
  }

  /** PUT: update the hero on the server */
  updateOrder(order: Order): Observable<any> {
    return this.http.put(this.ordersUrl, order, this.httpOptions).pipe(
      tap(_ => this.log(`updated order id=${order.id}`)),
      catchError(this.handleError<any>('updateOrder'))
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
