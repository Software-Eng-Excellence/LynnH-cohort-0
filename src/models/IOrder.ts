import { ID } from "repository/IRepository";
import { IIdentifiableItem, IItem } from "./IItem";

export interface IOrder{
    getItem():IItem;
    getPrice():number;
    getQuantity():number;
    getId():string;
}
export interface IIdentifiableOrderItem extends ID,IOrder {
    getItem():IIdentifiableItem;
}