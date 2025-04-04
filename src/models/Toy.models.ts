import { id } from "repository/IRepository";
import { IIdentifiableItem, IItem, ItemCategory } from "./IItem";

export class Toy implements IItem {

    private type: string;
    private ageGroup: string;
    private brand: string;
    private material: string;
    private batteryRequired: boolean;
    private educational: boolean;
    constructor(
        type: string,
        ageGroup: string,
        brand: string,
        material: string,
        batteryRequired: boolean,
        educational: boolean
    ) {
        this.type = type;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteryRequired = batteryRequired;
        this.educational = educational;
    }
    getCategory(): ItemCategory {
        return ItemCategory.TOY
    }

    getType(): string {
        return this.type;
    }

    getAgeGroup(): string {
        return this.ageGroup;
    }

    getBrand(): string {
        return this.brand;
    }

    getMaterial(): string {
        return this.material;
    }

    isBatteryRequired(): boolean {
        return this.batteryRequired;
    }

    isEducational(): boolean {
        return this.educational;
    }
}

export class IdentifiableToy extends Toy implements IIdentifiableItem {


    constructor(
        private id: id,
        type: string,
        ageGroup: string,
        brand: string,
        material: string,
        batteryRequired: boolean,
        educational: boolean
    ) {
        super(type, ageGroup, brand, material, batteryRequired, educational);
    
    }

    getId(): id {
        return this.id;
    }
}