import { Toy } from "models/Toy.models";
import { IMapper } from "./IMaper";
import { ToyBuilder } from "../models/builders/toy.builder";

export class XMLToyMapper implements IMapper<{ [key: string]: string }, Toy> {
    map(data: { [key: string]: string }): Toy {
        return ToyBuilder.newBuilder()
            .setType(data["Type"])
            .setAgeGroup(data["AgeGroup"])
            .setBrand(data["Brand"])
            .setMaterial(data["Material"])
            .setBatteryRequired(data["BatteryRequired"] === 'true')
            .setEducational(data["Educational"] === 'true')
            .build();
    }

    reverseMap(toy: Toy): { [key: string]: string } {
        return {
            Type: toy.getType(),
            AgeGroup: toy.getAgeGroup(),
            Brand: toy.getBrand(),
            Material: toy.getMaterial(),
            BatteryRequired: toy.isBatteryRequired().toString(),
            Educational: toy.isEducational().toString()
        };
    }
}