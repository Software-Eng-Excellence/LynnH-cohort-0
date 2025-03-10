import fs from 'fs';
import parseXML from "../../src/util/parsers/xmlParser"

describe('XML Parser', () => {
    let xmlFilePath: string = './tests/data/dummy.xml';
    let originalXmlData: string;

    beforeAll(() => {
        // Store the original file content for cleanup
        originalXmlData = fs.readFileSync(xmlFilePath, 'utf-8');
    });
    afterEach(() => {
        fs.writeFileSync(xmlFilePath, originalXmlData);
    });
    let mockData: string;

    it('should parse a valid xml file correctly', async () => {
        
        const result = await parseXML(xmlFilePath);

        expect(result).toEqual([
            { id: ["1"], item: ["Toy Car"], quantity: ["2"] },
            { id: ["2"], item: ["Toy Train"], quantity: ["3"] }
        ]);
    });

    it('should reject the promise when the XML is malformed', async () => {

        mockData = `
            <data>
            <row>
                <id>1</id>
                <item>Toy Car</item>
                <quantity>2</quantity>
            </row>
            
                <id>2</id>
                <item>Toy Train</item>
                <quantity>3</quantity>
            </row>
            </data>`;
        fs.writeFileSync(xmlFilePath, mockData);
        await expect(parseXML(xmlFilePath)).rejects.toThrow(SyntaxError);
    });

    it('should throw an error when the file is not found', async () => {
        const nonExistentFilePath = "./src/data/invalid.xml";
        await expect(parseXML(nonExistentFilePath)).rejects.toThrow(/ENOENT: no such file or directory/);
    });


    it('should handle an empty XML file correctly', async () => {
        const mockData = ` <data>
            <row>
             </row>
             </data>`
        fs.writeFileSync(xmlFilePath, mockData);
        const result = await parseXML(xmlFilePath);
        expect(result).toEqual([ '\n             ' ]);
    });
})