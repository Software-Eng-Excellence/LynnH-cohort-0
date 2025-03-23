import { IdentifiableOrderItemBuilder, OrderBuilder } from "../models/builders/order.builder";
import { IOrder } from "../models/IOrder";
import { IMapper } from "./IMaper";
import { IIdentifiableItem, IItem } from "../models/IItem";
import { IdentifiableOrderItem, Order } from "models/Order.model";


export class CSVOrderMapper implements IMapper<string[], IOrder> {
  constructor(private ItemMapper: IMapper<string[], IItem>) {

  }
  map(data: string[]): IOrder {
    const item: IItem = this.ItemMapper?.map(data);
    return OrderBuilder.newBuilder().setId(data[0]).setItem(item).setPrice(parseInt(data[data.length - 2])).setQuantity(parseInt(data[data.length - 1])).build()
  }
  reverseMap(order: IOrder): string[] {
    const itemData = this.ItemMapper.reverseMap(order.getItem());
    return [
      order.getId(),
      ...itemData,
      order.getPrice().toString(),
      order.getQuantity().toString()
    ];
  }
}

export interface SQLiteOrder {
  id: string;
  quantity: number;
  price: number;
  item_category: string;
  item_id: string;
}



export class SQLiteOrderMapper implements IMapper<{data:SQLiteOrder,item:IIdentifiableItem}, IdentifiableOrderItem> {
  
  map({data,item}:{data:SQLiteOrder,item:IIdentifiableItem}): IdentifiableOrderItem {

    const order = OrderBuilder.newBuilder().setId(data.id).setPrice(data.price).setQuantity(data.quantity).setItem(item).build();
    return IdentifiableOrderItemBuilder.newBuilder().setOrder(order).setItem(item).build();
  }
  reverseMap(data: IdentifiableOrderItem): { data: SQLiteOrder, item: IIdentifiableItem } {
  return{
    data:{
      id:data.getId(),
      price:data.getPrice(),
      quantity:data.getQuantity(),
      item_category:data.getItem().getCategory(),
      item_id:data.getItem().getId()
    },
    item :data.getItem()
  }
  }
  
}