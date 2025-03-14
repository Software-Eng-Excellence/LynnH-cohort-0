import { Clothing } from "../../models/Clothing.models";
import logger from "../../util/logger";

export class ClothingBuilder {
    private type!: string;
    private size!: string;
    private color!: string;
    private material!: string;
    private pattern!: string;
    private brand!: string;
    private gender!: string;
    private packaging!: string;
    private specialRequest!: string;

    public static newBuilder():ClothingBuilder{
        return new ClothingBuilder();
    }

    public setType(type: string): ClothingBuilder {
        this.type = type;
        return this;
    }

    public setSize(size: string): ClothingBuilder {
        this.size = size;
        return this;
    }

    public setColor(color: string): ClothingBuilder {
        this.color = color;
        return this;
    }

    public setMaterial(material: string): ClothingBuilder {
        this.material = material;
        return this;
    }

    public setPattern(pattern: string): ClothingBuilder {
        this.pattern = pattern;
        return this;
    }

    public setBrand(brand: string): ClothingBuilder {
        this.brand = brand;
        return this;
    }

    public setGender(gender: string): ClothingBuilder {
        this.gender = gender;
        return this;
    }

    public setPackaging(packaging: string): ClothingBuilder {
        this.packaging = packaging;
        return this;
    }

    public setSpecialRequest(specialRequest: string): ClothingBuilder {
        this.specialRequest = specialRequest;
        return this;
    }
    build(): Clothing {
        const requiredProperties = [
            this.type,
            this.size,
            this.color,
            this.material,
            this.pattern,
            this.brand,
            this.gender,
            this.packaging,
            this.specialRequest
        ];

        for (const property of requiredProperties) {
           if (property === undefined || property === null) {
                throw new Error('Missing required property');
            }
        }
        return new Clothing(
            this.type,
            this.size,
            this.color,
            this.material,
            this.pattern,
            this.brand,
            this.gender,
            this.packaging,
            this.specialRequest
        )
    }

}