import { ID } from "repository/IRepository";

export interface IItem{
    getCategory():ItemCategory
}
export interface IIdentifiableItem extends IItem ,ID {
    
}

export enum ItemCategory{
    CAKE = "cake",
    BOOK = "book",
    CLOTHING = "clothing",
    FURNITURE = "furniture",
    PET = "pet",
    TOY = "toy",
    Test="test"
}
