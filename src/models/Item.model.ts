export interface Item{
    getCategory():ItemCategory
}


export enum ItemCategory{
    CAKE,
    BOOK,
    CLOTHING,
    FURNITURE,
    PET,
    TOY
}