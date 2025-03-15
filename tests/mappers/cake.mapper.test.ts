import { CSVCakeMapper } from "../../src/mappers/Cake.mapper";
import { Cake } from "../../src/models/Cake.models";

describe("CSVCakeMapper", () => {
    let mapper: CSVCakeMapper;

    beforeAll(() => {
        mapper = new CSVCakeMapper();
    });

    it("should correctly map valid CSV data to a Cake object", () => {
        const csvData = [
            "123",
            "Birthday",
            "Chocolate",
            "Strawberry",
            "10",
            "2",
            "Buttercream",
            "Vanilla",
            "Flowers",
            "Red",
            "Happy Birthday!",
            "Round",
            "Nuts",
            "Organic Sugar",
            "Box"
        ];

        const cake = mapper.map(csvData);

        expect(cake.getType()).toBe("Birthday");
        expect(cake.getFlavor()).toBe("Chocolate");
        expect(cake.getFilling()).toBe("Strawberry");
        expect(cake.getSize()).toBe(10);
        expect(cake.getLayers()).toBe(2);
        expect(cake.getFrostingType()).toBe("Buttercream");
        expect(cake.getFrostingFlavor()).toBe("Vanilla");
        expect(cake.getDecorationType()).toBe("Flowers");
        expect(cake.getDecorationColor()).toBe("Red");
        expect(cake.getCustomMessage()).toBe("Happy Birthday!");
        expect(cake.getShape()).toBe("Round");
        expect(cake.getAllergies()).toBe("Nuts");
        expect(cake.getSpecialIngredients()).toBe("Organic Sugar");
        expect(cake.getPackagingType()).toBe("Box");
    });

    it("should throw an error if required fields are missing", () => {
        const csvData = ["123", "Birthday"];

        expect(() => mapper.map(csvData)).toThrowError("Missing required property");
    });

    it("should throw an error if data types are incorrect", () => {
        const csvData = [
            "123",
            "Birthday",
            "Chocolate",
            "Strawberry",
            "ten", // should be a number
            "2",
            "Buttercream",
            "Vanilla",
            "Flowers",
            "Red",
            "Happy Birthday!",
            "Round",
            "Nuts",
            "Organic Sugar",
            "Box"
        ];

        expect(() => mapper.map(csvData)).toThrowError("Missing required property");
    });

    it("should throw an error if CSV data is malformed", () => {
        const csvData = [
            "123",
            "Birthday",
            "Chocolate",
            "Strawberry",
            "10",
            "2",
            "Buttercream",
            "Vanilla",
            "Flowers",
            "Red",
            "Happy Birthday!",
            "Round",
            "Nuts",
            "Organic Sugar"
            // Missing packaging type
        ];

        expect(() => mapper.map(csvData)).toThrowError("Missing required property");
    });

    it("should handle empty CSV data", () => {
        const csvData: string[] = [];

        expect(() => mapper.map(csvData)).toThrowError("Missing required property");
    });

   
});
