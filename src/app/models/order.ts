import {StatusOrder} from "./status-order";


export interface Order {
  id: number;
  numberOrder: string;
  dateOrder: string;
  value: number;
  status: StatusOrder;
  idCustomer: number;
}
