import { ToyBuilder } from "../../src/models/builders/toy.builder";
import { Toy } from "../../src/models/Toy.models";

describe("ToyBuilder", () => {
    test("should build a Toy object with all properties", () => {
        const toy = new ToyBuilder()
            .setType("Action Figure")
            .setAgeGroup("3-5 years")
            .setBrand("Hasbro")
            .setMaterial("Plastic")
            .setBatteryRequired(true)
            .setEducational(true)
            .build();

        expect(toy).toBeInstanceOf(Toy);
        expect(toy.getType()).toBe("Action Figure");
        expect(toy.getAgeGroup()).toBe("3-5 years");
        expect(toy.getBrand()).toBe("Hasbro");
        expect(toy.getMaterial()).toBe("Plastic");
        expect(toy.isBatteryRequired()).toBe(true);
        expect(toy.isEducational()).toBe(true);
    });

    test("should throw an error if required properties are missing", () => {
        expect(() => {
            new ToyBuilder().build();
        }).toThrow("Missing required property");
    });

    test("should correctly set and retrieve properties", () => {
        const builder = new ToyBuilder();
        builder.setMaterial("Wood");
        expect(builder["material"]).toBe("Wood");

        builder.setBatteryRequired(false);
        expect(builder["batteryRequired"]).toBe(false);
    });

    test("should handle invalid input values", () => {
        const builder = new ToyBuilder();
        builder.setType("");
        expect(() => builder.build()).toThrow("Missing required property");
    });
});
