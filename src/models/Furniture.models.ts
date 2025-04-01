import { id } from "repository/IRepository";
import { IIdentifiableItem, IItem, ItemCategory } from "./IItem";

export class Furniture implements IItem {
   
    constructor(
        private type: string,
        private material: string,
        private color: string,
        private size: string,
        private style: string,
        private assemblyRequired: boolean,
        private warranty: string
    ) {
        this.type = type;
        this.material = material;
        this.color = color;
        this.size = size;
        this.style = style;
        this.assemblyRequired = assemblyRequired;
        this.warranty = warranty;
    }

    getCategory(): ItemCategory {
        return ItemCategory.FURNITURE;
    }
    getType(): string {
        return this.type;
    }

    getMaterial(): string {
        return this.material;
    }

    getColor(): string {
        return this.color;
    }

    getSize(): string {
        return this.size;
    }

    getStyle(): string {
        return this.style;
    }

    isAssemblyRequired(): boolean {
        return this.assemblyRequired;
    }

    getWarranty(): string {
        return this.warranty;
    }
}

export class IdentifiableFurniture extends Furniture implements IIdentifiableItem {
    

    constructor(
        private id: id,
        type: string,
        material: string,
        color: string,
        size: string,
        style: string,
        assemblyRequired: boolean,
        warranty: string
    ) {
        super(type, material, color, size, style, assemblyRequired, warranty);
      
    }

    getId(): id {
        return this.id;
    }
}
