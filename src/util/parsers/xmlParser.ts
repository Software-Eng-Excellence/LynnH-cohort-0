import fs from 'fs';
import logger from '../logger';
import xml2js from 'xml2js';


//to apply DIP principle : 
type XMLParserOptions = {
    createReadStream?: typeof fs.createReadStream; // Allow custom stream creation (useful for testing)
    customLogger?: typeof logger; // Use an injected logger for better flexibility
};

// parse XML File
const parseXML = (filePath: string, options: XMLParserOptions = {}): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
        const { createReadStream = fs.createReadStream, customLogger = logger } = options;
        let xmlData: string = '';
        const readStream = createReadStream(filePath, { encoding: 'utf-8' });

        readStream.on('data', (chunk: string | Buffer) => {
            xmlData += chunk.toString('utf-8');
        });

        readStream.on('end', () => {
            xml2js.parseString(xmlData, (err, result) => {
                if (err || !result?.data?.row) {
                    customLogger.error("Error parsing XML file %s: %o", filePath, err);
                    return reject(new SyntaxError(`Malformed XML: ${err}`));
                }

                const rows = result.data.row;
                resolve(rows);
            });
        });

        readStream.on('error', (error) => {
            customLogger.error("Error while reading the stream of file %s, %o", filePath, error);
            reject(error);
        });
    });
};

export default parseXML;
