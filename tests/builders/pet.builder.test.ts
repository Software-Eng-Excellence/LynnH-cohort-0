import { PetBuilder } from "../../src/models/builders/pet.builder";
import { Pet } from "../../src/models/Pet.models";

describe("PetBuilder", () => {
    test("should build a Pet object with all properties", () => {
        const pet = new PetBuilder()
            .setProductType("Food")
            .setPetType("Dog")
            .setBrand("Purina")
            .setSize("Medium")
            .setFlavor("Chicken")
            .setEcoFriendly("Yes")
            .build();

        expect(pet).toBeInstanceOf(Pet);
        expect(pet.getProductType()).toBe("Food");
        expect(pet.getPetType()).toBe("Dog");
        expect(pet.getBrand()).toBe("Purina");
        expect(pet.getSize()).toBe("Medium");
        expect(pet.getFlavor()).toBe("Chicken");
        expect(pet.getEcoFriendly()).toBe("Yes");
    });

    test("should throw an error if required properties are missing", () => {
        expect(() => {
            new PetBuilder().build();
        }).toThrow("Missing required property");
    });

    test("should support method chaining", () => {
        const builder = new PetBuilder()
            .setProductType("Toy")
            .setPetType("Cat");

        expect(builder).toBeInstanceOf(PetBuilder);
    });

    test("should correctly set and retrieve properties", () => {
        const builder = new PetBuilder();
        builder.setFlavor("Beef");
        expect(builder["flavor"]).toBe("Beef");

        builder.setEcoFriendly("No");
        expect(builder["ecoFriendly"]).toBe("No");
    });

    test("should handle invalid input values", () => {
        const builder = new PetBuilder();
        expect(() => builder.setProductType("")).not.toThrow(); // Assuming no validation
        expect(() => builder.setEcoFriendly(null as unknown as string)).not.toThrow(); // Should be handled
    });
});
