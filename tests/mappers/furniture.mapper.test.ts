import { XMLFurnitureMapper } from "../../src/mappers/furniture.mapper";


describe("XMLFurnitureMapper", () => {
    let mapper: XMLFurnitureMapper;

    beforeEach(() => {
        mapper = new XMLFurnitureMapper();
    });

    it("should correctly map valid XML data to a Furniture object", () => {
        const xmlData = {
            "Type": "Sofa",
            "Material": "Leather",
            "Color": "Black",
            "Size": "Medium",
            "Style": "Modern",
            "AssemblyRequired": "Yes",
            "Warranty": "5 years"
        };

        const furniture = mapper.map(xmlData);

        expect(furniture.getType()).toBe("Sofa");
        expect(furniture.getMaterial()).toBe("Leather");
        expect(furniture.getColor()).toBe("Black");
        expect(furniture.getSize()).toBe("Medium");
        expect(furniture.getStyle()).toBe("Modern");
        expect(furniture.isAssemblyRequired()).toBe(true);
        expect(furniture.getWarranty()).toBe("5 years");
    });
    it("should throw an error when required fields are missing", () => {
        const xmlData = {
            "Type": "Sofa",
            "Material": "Leather",
            "Color": "Black",
            "Size": "Medium",
            "Style": "Modern",
            "AssemblyRequired": "Yes"
        };
    
        // Missing Warranty field
        expect(() => mapper.map(xmlData)).toThrowError("Missing required property");
    });
    it("should throw an error when an empty XML object is passed", () => {
        const xmlData = {};
    
        expect(() => mapper.map(xmlData)).toThrowError("Missing required property");
    });
    
    
});
