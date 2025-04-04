import logger from "../../util/logger";
import { IdentifiablePet, Pet } from "../../models/Pet.models";

export class PetBuilder {
    private productType!: string;
    private petType!: string;
    private brand!: string;
    private size!: string;
    private flavor!: string;
    private ecoFriendly!: string;

    public static newBuilder():PetBuilder{
        return new PetBuilder();
    }

    public setProductType(productType: string): PetBuilder {
        this.productType = productType;
        return this;
    }

    public setPetType(petType: string): PetBuilder {
        this.petType = petType;
        return this;
    }

    public setBrand(brand: string): PetBuilder {
        this.brand = brand;
        return this;
    }

    public setSize(size: string): PetBuilder {
        this.size = size;
        return this;
    }

    public setFlavor(flavor: string): PetBuilder {
        this.flavor = flavor;
        return this;
    }

    public setEcoFriendly(ecoFriendly: string): PetBuilder {
        this.ecoFriendly = ecoFriendly;
        return this;
    }

    public build(): Pet {
        const requiredProperties = [
            this.productType,
            this.petType,
            this.brand,
            this.size,
            this.flavor,
            this.ecoFriendly
        ];

        for (const property of requiredProperties) {
            if (property === undefined || property === null) {
                throw new Error('Missing required property');
            }
        }

        return new Pet(
            this.productType,
            this.petType,
            this.brand,
            this.size,
            this.flavor,
            this.ecoFriendly
        );
    }
}


export class IdentifiablePetBuilder {
    private id!: string;
    private pet!: Pet;

     static newBuilder(): IdentifiablePetBuilder {
        return new IdentifiablePetBuilder();
    }

     setId(id: string): IdentifiablePetBuilder {
        this.id = id;
        return this;
    }

     setPet(pet: Pet): IdentifiablePetBuilder {
        this.pet = pet;
        return this;
    }

     build(): IdentifiablePet {
        if (!this.id || !this.pet) {
            logger.error("Missing required properties, could not build an identifiable pet");
            throw new Error("Missing required properties");
        }

        return new IdentifiablePet(
            this.id,
            this.pet.getProductType(),
            this.pet.getPetType(),
            this.pet.getBrand(),
            this.pet.getSize(),
            this.pet.getFlavor(),
            this.pet.getEcoFriendly()
        );
    }
}