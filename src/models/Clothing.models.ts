import { id } from "repository/IRepository";
import { IIdentifiableItem, IItem, ItemCategory } from "./IItem";

export class Clothing implements IItem {
    
    private type: string;
    private size: string;
    private color: string;
    private material: string;
    private pattern: string;
    private brand: string;
    private gender: string;
    private packaging: string;
    private specialRequest: string;

    constructor(
        type: string,
        size: string,
        color: string,
        material: string,
        pattern: string,
        brand: string,
        gender: string,
        packaging: string,
        specialRequest: string
    ) {
        this.type = type;
        this.size = size;
        this.color = color;
        this.material = material;
        this.pattern = pattern;
        this.brand = brand;
        this.gender = gender;
        this.packaging = packaging;
        this.specialRequest = specialRequest;
    }
    getCategory(): ItemCategory {
        return ItemCategory.CLOTHING
    }

    getType(): string {
        return this.type;
    }

    getSize(): string {
        return this.size;
    }

    getColor(): string {
        return this.color;
    }

    getMaterial(): string {
        return this.material;
    }

    getPattern(): string {
        return this.pattern;
    }

    getBrand(): string {
        return this.brand;
    }

    getGender(): string {
        return this.gender;
    }

    getPackaging(): string {
        return this.packaging;
    }

    getSpecialRequest(): string {
        return this.specialRequest;
    }

}

export class IdentifiableClothing extends Clothing implements IIdentifiableItem {
    

    constructor(
        private id: id,
        type: string,
        size: string,
        color: string,
        material: string,
        pattern: string,
        brand: string,
        gender: string,
        packaging: string,
        specialRequest: string
    ) {
        super(type, size, color, material, pattern, brand, gender, packaging, specialRequest);
        
    }

    getId(): id {
        return this.id;
    }
}