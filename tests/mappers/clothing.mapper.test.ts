import { CSVClothingMapper } from "../../src/mappers/Clothing.mapper";


describe("CSVClothingMapper", () => {
    let mapper: CSVClothingMapper;

    beforeAll(() => {
        mapper = new CSVClothingMapper();
    });

    it("should correctly map valid CSV data to a Clothing object", () => {
        const csvData = [
            "123",
            "T-shirt",
            "M",
            "Red",
            "Cotton",
            "Plain",
            "Nike",
            "Unisex",
            "Box",
            "No special request"
        ];

        const clothing = mapper.map(csvData);

        expect(clothing.getType()).toBe("T-shirt");
        expect(clothing.getSize()).toBe("M");
        expect(clothing.getColor()).toBe("Red");
        expect(clothing.getMaterial()).toBe("Cotton");
        expect(clothing.getPattern()).toBe("Plain");
        expect(clothing.getBrand()).toBe("Nike");
        expect(clothing.getGender()).toBe("Unisex");
        expect(clothing.getPackaging()).toBe("Box");
        expect(clothing.getSpecialRequest()).toBe("No special request");
    });
    it("should throw an error when required fields are missing", () => {
        const csvData = ["123", "T-shirt"];

        expect(() => mapper.map(csvData)).toThrow("Missing required property");
    });
    it("should throw an error when an empty CSV array is passed", () => {
        const csvData: string[] = [];

        expect(() => mapper.map(csvData)).toThrow("Missing required property");
    });


});
