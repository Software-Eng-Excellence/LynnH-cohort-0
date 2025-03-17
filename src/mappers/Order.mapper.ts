import { OrderBuilder } from "../models/builders/order.builder";
import { IOrder } from "../models/IOrder";
import { IMapper } from "./IMaper";
import { IItem } from "../models/IItem";


export class CSVOrderMapper implements IMapper<string[], IOrder> {
    constructor(private ItemMapper:IMapper<string[],IItem>){

    }
    map(data: string[]): IOrder {
      const item:IItem=this.ItemMapper?.map(data);
        return OrderBuilder.newBuilder().setId(data[0]).setItem(item).setPrice(parseInt(data[data.length-2])).setQuantity(parseInt(data[data.length-1])).build()
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