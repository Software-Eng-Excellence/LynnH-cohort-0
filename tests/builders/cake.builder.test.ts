import { CakeBuilder } from "../../src/models/builders/cake.builder";
import { Cake } from "../../src/models/Cake.models";

describe("CakeBuilder", () => {
    test("should build a Cake with all properties", () => {
        const cake = new CakeBuilder()
            .setType("Birthday")
            .setFlavor("Vanilla")
            .setFilling("Chocolate")
            .setSize(10)
            .setLayers(3)
            .setFrostingType("Buttercream")
            .setFrostingFlavor("Chocolate")
            .setDecorationType("Sprinkles")
            .setDecorationColor("Red")
            .setCustomMessage("Happy Birthday!")
            .setShape("Round")
            .setAllergies("Nuts")
            .setSpecialIngredients("Organic Flour")
            .setPackagingType("Box")
            .build();

        expect(cake).toBeInstanceOf(Cake);
        expect(cake.getSize()).toBe(10);
        expect(cake.getFlavor()).toBe("Vanilla");
    });

    test("should throw an error if required properties are missing", () => {
        expect(() => {
            new CakeBuilder().setType("Birthday").build();
        }).toThrow("Missing required property");
    });

    test("should support method chaining", () => {
        const builder = new CakeBuilder()
            .setType("Wedding")
            .setFlavor("Strawberry");

        expect(builder).toBeInstanceOf(CakeBuilder);
    });

    test("should correctly set and retrieve properties", () => {
        const builder = new CakeBuilder();
        builder.setType("Birthday");
        expect(builder["type"]).toBe("Birthday");
        
        builder.setSize(8);
        expect(builder["size"]).toBe(8);
    });

    test("should handle invalid input values", () => {
        const builder = new CakeBuilder();
        expect(() => builder.setSize(-5)).not.toThrow(); // Assuming no validation in place
    });
});
