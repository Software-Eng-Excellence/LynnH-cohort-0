import logger from "../../util/logger";
import { IdentifiableToy, Toy } from "../../models/Toy.models";


export class ToyBuilder {
    private type!: string ;
    private ageGroup!: string ;
    private brand!: string ;
    private material!: string ;
    private batteryRequired!: boolean;
    private educational!: boolean;

    public static newBuilder():ToyBuilder{
        return new ToyBuilder();
    }

    setType(type: string): ToyBuilder {
        this.type = type;
        return this;
    }

    setAgeGroup(ageGroup: string): ToyBuilder {
        this.ageGroup = ageGroup;
        return this;
    }

    setBrand(brand: string): ToyBuilder {
        this.brand = brand;
        return this;
    }

    setMaterial(material: string): ToyBuilder {
        this.material = material;
        return this;
    }

    setBatteryRequired(batteryRequired: boolean): ToyBuilder {
        this.batteryRequired = batteryRequired;
        return this;
    }

    setEducational(educational: boolean): ToyBuilder {
        this.educational = educational;
        return this;
    }

    build(): Toy {
        const requiredProperties = [
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational
        ];

        for (const property of requiredProperties) {
            if (property === undefined || property === null) {
                throw new Error('Missing required property');
            }
        }
        return new Toy(
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational
        )
    }
}


export class IdentifiableToyBuilder {
    private id!: string;
    private toy!: Toy;

     static newBuilder(): IdentifiableToyBuilder {
        return new IdentifiableToyBuilder();
    }

     setId(id: string): IdentifiableToyBuilder {
        this.id = id;
        return this;
    }

     setToy(toy: Toy): IdentifiableToyBuilder {
        this.toy = toy;
        return this;
    }

     build(): IdentifiableToy {
        if (!this.id || !this.toy) {
            logger.error("Missing required properties, could not build an identifiable toy");
            throw new Error("Missing required properties");
        }

        return new IdentifiableToy(
            this.id,
            this.toy.getType(),
            this.toy.getAgeGroup(),
            this.toy.getBrand(),
            this.toy.getMaterial(),
            this.toy.isBatteryRequired(),
            this.toy.isEducational()
        );
    }
}


