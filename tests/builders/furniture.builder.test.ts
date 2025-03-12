import { FurnitureBuilder } from "../../src/models/builders/furniture.builder";
import { Furniture } from "../../src/models/Furniture.models";

describe("FurnitureBuilder", () => {
    test("should build a Furniture object with all properties", () => {
        const furniture = new FurnitureBuilder()
            .setType("Sofa")
            .setMaterial("Leather")
            .setColor("Black")
            .setSize("Large")
            .setStyle("Modern")
            .setAssemblyRequired(true)
            .setWarranty("5 years")
            .build();

        expect(furniture).toBeInstanceOf(Furniture);
        expect(furniture.getType()).toBe("Sofa");
        expect(furniture.getMaterial()).toBe("Leather");
        expect(furniture.getColor()).toBe("Black");
        expect(furniture.getSize()).toBe("Large");
        expect(furniture.getStyle()).toBe("Modern");
        expect(furniture.isAssemblyRequired()).toBe(true);
        expect(furniture.getWarranty()).toBe("5 years");
    });

    test("should throw an error if required properties are missing", () => {
        expect(() => {
            new FurnitureBuilder().build();
        }).toThrow("Missing required property");
    });

    test("should support method chaining", () => {
        const builder = new FurnitureBuilder()
            .setType("Chair")
            .setMaterial("Wood");

        expect(builder).toBeInstanceOf(FurnitureBuilder);
    });

    test("should correctly set and retrieve properties", () => {
        const builder = new FurnitureBuilder();
        builder.setColor("Blue");
        expect(builder["color"]).toBe("Blue");

        builder.setWarranty("10 years");
        expect(builder["warranty"]).toBe("10 years");
    });

    test("should handle invalid input values", () => {
        const builder = new FurnitureBuilder();
        expect(() => builder.setType("")).not.toThrow(); // Assuming no validation
        expect(() => builder.setAssemblyRequired(null as unknown as boolean)).not.toThrow(); // Should be handled
    });
});
