import { JSONPetMapper } from "../../src/mappers/pet.mapper";

describe("JSONPetMapper", () => {
    let mapper: JSONPetMapper;

    beforeAll(() => {
        mapper = new JSONPetMapper();
    });

    it("should correctly map valid JSON data to a Pet object", () => {
        const jsonData = {
            "Product Type": "Food",
            "Pet Type": "Dog",
            "Brand": "Pedigree",
            "Size": "Large",
            "Flavor": "Chicken",
            "Eco-Friendly": "Yes"
        };

        const pet = mapper.map(jsonData);

        expect(pet.getProductType()).toBe("Food");
        expect(pet.getPetType()).toBe("Dog");
        expect(pet.getBrand()).toBe("Pedigree");
        expect(pet.getSize()).toBe("Large");
        expect(pet.getFlavor()).toBe("Chicken");
        expect(pet.getEcoFriendly()).toBe("Yes");
    });
    it("should throw an error when required fields are missing", () => {
        const jsonData = {
            "Product Type": "Food",
            "Brand": "Pedigree",
            "Size": "Large",
            "Flavor": "Chicken",
            "Eco-Friendly": "Yes"
        };
    
        expect(() => mapper.map(jsonData)).toThrowError("Missing required property");
    });
   
    it("should throw an error when an empty JSON object is passed", () => {
        const jsonData = {};
    
        expect(() => mapper.map(jsonData)).toThrowError("Missing required property");
    });
    
});
