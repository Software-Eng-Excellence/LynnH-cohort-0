import { Clothing, IdentifiableClothing } from "models/Clothing.models";
import { IMapper } from "./IMaper";
import { ClothingBuilder, IdentifiableClothingBuilder } from "../models/builders/clothing.builder";

export class CSVClothingMapper implements IMapper<string[], Clothing> {
    map(data: string[]): Clothing {
        return ClothingBuilder.newBuilder()
            .setType(data[1])
            .setSize(data[2])
            .setColor(data[3])
            .setMaterial(data[4])
            .setPattern(data[5])
            .setBrand(data[6])
            .setGender(data[7])
            .setPackaging(data[8])
            .setSpecialRequest(data[9])
            .build();
    }

    reverseMap(clothing: Clothing): string[] {
        return [
            clothing.getType(),
            clothing.getSize(),
            clothing.getColor(),
            clothing.getMaterial(),
            clothing.getPattern(),
            clothing.getBrand(),
            clothing.getGender(),
            clothing.getPackaging(),
            clothing.getSpecialRequest()
        ];
    }
}

export interface PostgreSQLClothing {
    id: string;
    type: string;
    size: string;
    color: string;
    material: string;
    pattern: string;
    brand: string;
    gender: string;
    packaging: string;
    specialRequest: string;
}


export class PostgreSQLClothingMapper implements IMapper<PostgreSQLClothing, IdentifiableClothing> {

    map(data: PostgreSQLClothing): IdentifiableClothing {
        return IdentifiableClothingBuilder.newBuilder()
            .setClothing(
                ClothingBuilder.newBuilder()
                  
                    .setType(data.type)
                    .setSize(data.size)
                    .setColor(data.color)
                    .setMaterial(data.material)
                    .setPattern(data.pattern)
                    .setBrand(data.brand)
                    .setGender(data.gender)
                    .setPackaging(data.packaging)
                    .setSpecialRequest(data.specialRequest)
                    .build()
            )
            .setId(data.id)
            .build();
    }

    reverseMap(data: IdentifiableClothing): PostgreSQLClothing {
        return {
            id: data.getId(),
            type: data.getType(),
            size: data.getSize(),
            color: data.getColor(),
            material: data.getMaterial(),
            pattern: data.getPattern(),
            brand: data.getBrand(),
            gender: data.getGender(),
            packaging: data.getPackaging(),
            specialRequest: data.getSpecialRequest()
        };
    }
}