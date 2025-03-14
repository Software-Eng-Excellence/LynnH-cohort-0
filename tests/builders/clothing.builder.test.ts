import { ClothingBuilder } from "../../src/models/builders/clothing.builder";
import { Clothing } from "../../src/models/Clothing.models";

describe("ClothingBuilder", () => {
    test("should build a Clothing object with all properties", () => {
        const clothing = new ClothingBuilder()
            .setType("T-Shirt")
            .setSize("M")
            .setColor("Blue")
            .setMaterial("Cotton")
            .setPattern("Striped")
            .setBrand("Nike")
            .setGender("Unisex")
            .setPackaging("Box")
            .setSpecialRequest("Gift Wrapped")
            .build();

        expect(clothing).toBeInstanceOf(Clothing);
        expect(clothing.getSize()).toBe("M");
        expect(clothing.getColor()).toBe("Blue");
    });

    test("should correctly set and retrieve properties", () => {
        const builder = new ClothingBuilder();
        builder.setBrand("Adidas");
        expect(builder["brand"]).toBe("Adidas");

        builder.setSize("S");
        expect(builder["size"]).toBe("S");
    });

    test("should handle invalid input values", () => {
        const builder = new ClothingBuilder();
        builder.setSize("");
        expect(() => builder.build()).toThrow("Missing required property");
    });
});
