import { XMLToyMapper } from "../../src/mappers/toy.mapper";


describe("XMLToyMapper", () => {
    let mapper: XMLToyMapper;

    beforeEach(() => {
        mapper = new XMLToyMapper();
    });

    it("should correctly map valid XML data to a Toy object", () => {
        const xmlData = {
            "Type": "Doll",
            "AgeGroup": "4-7",
            "Brand": "FunTime",
            "Material": "Wood",
            "BatteryRequired": "true",
            "Educational": "false"
        };

        const toy = mapper.map(xmlData);

        expect(toy.getType()).toBe("Doll");
        expect(toy.getAgeGroup()).toBe("4-7");
        expect(toy.getBrand()).toBe("FunTime");
        expect(toy.getMaterial()).toBe("Wood");
        expect(toy.isBatteryRequired()).toBe(true);
        expect(toy.isEducational()).toBe(false);
    });
    it("should throw an error when required fields are missing", () => {
        const xmlData = {
            "Type": "Doll",
            "Brand": "FunTime",
            "Material": "Wood",
            "BatteryRequired": "true",
            "Educational": "false"
        };
    
        expect(() => mapper.map(xmlData)).toThrowError("Missing required property");
    });
    it("should throw an error when an empty XML object is passed", () => {
        const xmlData = {};
    
        expect(() => mapper.map(xmlData)).toThrowError("Missing required property");
    });
});
