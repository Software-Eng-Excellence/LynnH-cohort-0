import { Furniture, IdentifiableFurniture } from "models/Furniture.models";
import { IMapper } from "./IMaper";
import { FurnitureBuilder, IdentifiableFurnitureBuilder } from "../models/builders/furniture.builder";

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

export interface PostgreSQLFurniture {
    id: string;
    type: string;
    material: string;
    color: string;
    size: string;
    style: string;
    assemblyRequired: boolean;
    warranty: string;
}


export class PostgreSQLFurnitureMapper implements IMapper<PostgreSQLFurniture, IdentifiableFurniture> {

    // Method to map PostgreSQLFurniture to IdentifiableFurniture
    map(data: PostgreSQLFurniture): IdentifiableFurniture {
        return IdentifiableFurnitureBuilder.newBuilder()
            .setFurniture(
                FurnitureBuilder.newBuilder()
                    .setType(data.type)
                    .setMaterial(data.material)
                    .setColor(data.color)
                    .setSize(data.size)
                    .setStyle(data.style)
                    .setAssemblyRequired(data.assemblyRequired)
                    .setWarranty(data.warranty)
                    .build()
            )
            .setId(data.id)
            .build();
    }

    // Method to reverse map IdentifiableFurniture to PostgreSQLFurniture
    reverseMap(data: IdentifiableFurniture): PostgreSQLFurniture {
        return {
            id: data.getId(),
            type: data.getType(),
            material: data.getMaterial(),
            color: data.getColor(),
            size: data.getSize(),
            style: data.getStyle(),
            assemblyRequired: data.isAssemblyRequired(),
            warranty: data.getWarranty(),
        };
    }
}