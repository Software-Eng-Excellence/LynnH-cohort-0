import { Clothing } from "models/Clothing.models";
import { IMapper } from "./IMaper";
import { ClothingBuilder } from "../models/builders/clothing.builder";

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