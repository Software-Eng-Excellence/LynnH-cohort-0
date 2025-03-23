import logger from "../../util/logger";
import { Furniture, IdentifiableFurniture } from "../../models/Furniture.models";


export class FurnitureBuilder{
    private type!: string;
    private material!: string;
    private color!: string;
    private size!: string;
    private style!: string;
    private assemblyRequired!: boolean;
    private warranty!: string;

    public static newBuilder():FurnitureBuilder{
        return new FurnitureBuilder();
    }

    public setType(type: string): FurnitureBuilder {
        this.type = type;
        return this;
    }

    public setMaterial(material: string): FurnitureBuilder {
        this.material = material;
        return this;
    }

    public setColor(color: string): FurnitureBuilder {
        this.color = color;
        return this;
    }

    public setSize(size: string): FurnitureBuilder {
        this.size = size;
        return this;
    }

    public setStyle(style: string): FurnitureBuilder {
        this.style = style;
        return this;
    }

    public setAssemblyRequired(assemblyRequired: boolean): FurnitureBuilder {
        this.assemblyRequired = assemblyRequired;
        return this;
    }

    public setWarranty(warranty: string): FurnitureBuilder {
        this.warranty = warranty;
        return this;
    }


    build():Furniture{
        const requiredProperties = [
            this.type,
            this.material,
            this.color,
            this.size,
            this.style,
            this.assemblyRequired,
            this.warranty
        ];

        for (const property of requiredProperties) {
            if (property === undefined || property === null) {
                throw new Error('Missing required property');
            }
        }
        return new Furniture(
            this.type,
            this.material,
            this.color,
            this.size,
            this.style,
            this.assemblyRequired,
            this.warranty
        )
    }
}

export class IdentifiableFurnitureBuilder {
    private id!: string;
    private furniture!: Furniture;

     static newBuilder(): IdentifiableFurnitureBuilder {
        return new IdentifiableFurnitureBuilder();
    }

     setId(id: string): IdentifiableFurnitureBuilder {
        this.id = id;
        return this;
    }

     setFurniture(furniture: Furniture): IdentifiableFurnitureBuilder {
        this.furniture = furniture;
        return this;
    }

     build(): IdentifiableFurniture {
        if (!this.id || !this.furniture) {
            logger.error("Missing required properties, could not build an identifiable furniture");
            throw new Error("Missing required properties");
        }

        return new IdentifiableFurniture(
            this.id,
            this.furniture.getType(),
            this.furniture.getMaterial(),
            this.furniture.getColor(),
            this.furniture.getSize(),
            this.furniture.getStyle(),
            this.furniture.isAssemblyRequired(),
            this.furniture.getWarranty()
        );
    }
}