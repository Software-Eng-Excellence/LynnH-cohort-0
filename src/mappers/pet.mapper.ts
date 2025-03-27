import { IdentifiablePet, Pet } from "models/Pet.models";
import { IMapper } from "./IMaper";
import { IdentifiablePetBuilder, PetBuilder } from "../models/builders/pet.builder";

export class JSONPetMapper implements IMapper<{ [key: string]: string }, Pet> {
    map(data: { [key: string]: string }): Pet {
        return PetBuilder.newBuilder()
            .setProductType(data["Product Type"])
            .setPetType(data["Pet Type"])
            .setBrand(data["Brand"])
            .setSize(data["Size"])
            .setFlavor(data["Flavor"])
            .setEcoFriendly(data["Eco-Friendly"])
            .build();
    }

    reverseMap(pet: Pet): { [key: string]: string } {
        return {
            "Product Type": pet.getProductType(),
            "Pet Type": pet.getPetType(),
            "Brand": pet.getBrand(),
            "Size": pet.getSize(),
            "Flavor": pet.getFlavor(),
            "Eco-Friendly": pet.getEcoFriendly()
        };
    }
}

export interface PostgreSQLPet {
    id: string;
    productType: string;
    petType: string;
    brand: string;
    size: string;
    flavor: string;
    ecoFriendly: string;
}

export class PostgreSQLPetMapper implements IMapper<PostgreSQLPet, IdentifiablePet> {
    map(data: PostgreSQLPet): IdentifiablePet {
        return IdentifiablePetBuilder.newBuilder()
            .setPet(
                PetBuilder.newBuilder()
                    .setProductType(data.productType)
                    .setPetType(data.petType)
                    .setBrand(data.brand)
                    .setSize(data.size)
                    .setFlavor(data.flavor)
                    .setEcoFriendly(data.ecoFriendly)
                    .build()
            )
            .setId(data.id)
            .build();
    }

    reverseMap(data: IdentifiablePet): PostgreSQLPet {
        return {
            id: data.getId(),
            productType: data.getProductType(),
            petType: data.getPetType(),
            brand: data.getBrand(),
            size: data.getSize(),
            flavor: data.getFlavor(),
            ecoFriendly: data.getEcoFriendly(),
        };
    }
}