import { Furniture } from "models/Furniture.models";
import { IMapper } from "./IMaper";
import { FurnitureBuilder } from "../models/builders/furniture.builder";

export class XMLFurnitureMapper implements IMapper<{ [key: string]: string }, Furniture> {
    map(data: { [key: string]: string }): Furniture {
        return FurnitureBuilder.newBuilder()
            .setType(data["Type"])
            .setMaterial(data["Material"])
            .setColor(data["Color"])
            .setSize(data["Size"])
            .setStyle(data["Style"])
            .setAssemblyRequired(data["AssemblyRequired"] === "Yes")
            .setWarranty(data["Warranty"])
            .build();
    }

    reverseMap(furniture: Furniture): { [key: string]: string } {
        return {
            Type: furniture.getType(),
            Material: furniture.getMaterial(),
            Color: furniture.getColor(),
            Size: furniture.getSize(),
            Style: furniture.getStyle(),
            AssemblyRequired: furniture.isAssemblyRequired() ? "Yes" : "No",
            Warranty: furniture.getWarranty()
        };
    }
}