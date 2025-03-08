import fs from 'fs';
import parseJSONFile from "../../src/util/parsers/jsonParser"


describe('JSON Parser', () => {
    let jsonFilePath: string = './src/data/book orders.json';
    let originalJsonData: string;

    beforeAll(() => {
        // Store the original file content for cleanup
        originalJsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    });
    afterAll(() => {
        fs.writeFileSync(jsonFilePath, originalJsonData);
    });

    let mockData: string;
    it('should parse a valid JSON file correctly', async () => {

        mockData = '{"name": "John", "age": 30}';
        fs.writeFileSync(jsonFilePath, mockData);
        const result = await parseJSONFile(jsonFilePath);
        expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should reject the promise when the JSON is malformed', async () => {
    
        const mockData = '{"name": "John", "age": 30';  // Invalid JSON (missing closing bracket)
        fs.writeFileSync(jsonFilePath, mockData);
        await expect(parseJSONFile(jsonFilePath)).rejects.toThrow(SyntaxError);
    });


    it('should throw an error when the file is not found', async () => {
        const nonExistentFilePath ="./src/data/invalid.json";
        await expect(parseJSONFile(nonExistentFilePath)).rejects.toThrow(/ENOENT: no such file or directory/);
    });

    it('should handle an empty JSON file correctly', async () => {
        const mockData = '{}'
        fs.writeFileSync(jsonFilePath, mockData);
        const result = await parseJSONFile(jsonFilePath);
        expect(result).toEqual({});
    });
      
})    
