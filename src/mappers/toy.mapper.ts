import { IdentifiableToy, Toy } from "models/Toy.models";
import { IMapper } from "./IMaper";
import { IdentifiableToyBuilder, ToyBuilder } from "../models/builders/toy.builder";

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

export interface PostgreSQLiteToy {
    id: string;
    type: string;
    ageGroup: string;
    brand: string;
    material: string;
    batteryRequired: boolean;
    educational: boolean;

}


export class PostgreSQLiteToyMapper implements IMapper<PostgreSQLiteToy, IdentifiableToy> {
    // Maps SQLiteToy data to IdentifiableToy
    map(data: PostgreSQLiteToy): IdentifiableToy {
        return IdentifiableToyBuilder.newBuilder()
            .setToy(
                ToyBuilder.newBuilder()
                    .setType(data.type)
                    .setAgeGroup(data.ageGroup)
                    .setBrand(data.brand)
                    .setMaterial(data.material)
                    .setBatteryRequired(data.batteryRequired)
                    .setEducational(data.educational)
                    .build()
            )
            .setId(data.id)
            .build();
    }
    reverseMap(data: IdentifiableToy): PostgreSQLiteToy {
        return {
            id: data.getId(),
            type: data.getType(),
            ageGroup: data.getAgeGroup(),
            brand: data.getBrand(),
            material: data.getMaterial(),
            batteryRequired: data.isBatteryRequired(),
            educational: data.isEducational(),
        };
    }}

