import { Pet } from "models/Pet.models";
import { IMapper } from "./IMaper";
import { PetBuilder } from "../models/builders/pet.builder";

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