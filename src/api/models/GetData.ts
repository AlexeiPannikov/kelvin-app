import {ClientModel} from "./responses/Clients/ClientModel";
import {IColumn} from "./IColumn";
import {PropertyModel} from "./responses/Properties/PropertyModel";
import {ResponseWithPagination} from "./responses/ResponseWithPagination";

export class GetData<T> {
  list = new ResponseWithPagination<T>();
  columns: IColumn = {};
  clients: ClientModel[] = new Array<ClientModel>();
  properties = new Array<PropertyModel>();
}
