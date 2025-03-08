import fs from 'fs';
import parseCSV from '../../src/util/parsers/csvParser';


describe('CSV Parser', () => {
    let csvFilePath:string = './src/data/cake orders.csv';
    let originalCsvData:string;
   
    beforeAll(() => {
        // Store the original file content for cleanup
        originalCsvData = fs.readFileSync(csvFilePath, 'utf-8');
    });
    afterAll(() => {
        fs.writeFileSync(csvFilePath, originalCsvData);
    });
    let mockData: string;

    it('should correctly parse a well-formed CSV file with valid rows', async () => {
        mockData = 'name,age\nJohn Doe,30\nJane Smith,25';
        fs.writeFileSync(csvFilePath, mockData);
        const filePath = csvFilePath;
        const data = await parseCSV(filePath);
        expect(data).toEqual([['John Doe', '30'], ['Jane Smith', '25']]);
    });
    it("should exclude invalid rows based on the validator function", async () => {
        const mockValidator = jest.fn().mockImplementation((columns) => columns[0] !== 'Invalid');
        mockData = 'name,age\nJohn Doe,30\nInvalid,45\nJane Smith,22';
        fs.writeFileSync(csvFilePath, mockData);
        const result = await parseCSV(csvFilePath, { validator: mockValidator });
        expect(result).toEqual([['John Doe', '30'], ['Jane Smith', '22']]);  // Assuming the second row is invalid
    })
    it('should exclude malformed input based on validator function', async () => {
        const mockValidator = jest.fn().mockImplementation((columns) => columns.length === 2);
        mockData = 'name,age\nJohn Doe,30\nJane Smith,22\n test';
        fs.writeFileSync(csvFilePath, mockData);
        const result = await parseCSV(csvFilePath, { validator: mockValidator });
        expect(result).toEqual([['John Doe', '30'], ['Jane Smith', '22']]);  // Assuming the second row is malformed
    })
    it('should return an empty array for an empty CSV file', async () => {
        mockData = '';
        fs.writeFileSync(csvFilePath, mockData);
        const result = await parseCSV(csvFilePath);
        expect(result).toEqual([]);
    });
    it('should exclude the header when includeHeader is false', async () => {
        mockData = 'name,age\nJohn Doe,30\nJane Smith,25';
        fs.writeFileSync(csvFilePath, mockData);
        const result = await parseCSV(csvFilePath, { includeHeader: false });
        expect(result).toEqual([['John Doe', '30'], ['Jane Smith', '25']]);  // Assuming the first row is the header
    });
    it('should show the header when includeHeader is true', async () => {
        mockData = 'name,age\nJohn Doe,30\nJane Smith,25';
        fs.writeFileSync(csvFilePath, mockData);
        const result = await parseCSV(csvFilePath, { includeHeader: true });
        expect(result).toEqual([['name', 'age'], ['John Doe', '30'], ['Jane Smith', '25']]);  // Assuming the first row is the header
    });

   


});