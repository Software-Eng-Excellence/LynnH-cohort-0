import fs from 'fs';
import logger from '../../util/logger';


//to apply DIP principle : 
type JSONParserOptions = {
    createReadStream?: typeof fs.createReadStream; // Allow custom stream creation (useful for testing)
    customLogger?: typeof logger; // Use an injected logger for better flexibility

};

// parse JSON File
const parseJSONFile = (filePath: string, options: JSONParserOptions = {}): Promise<Record<string, string>[]> => {
    return new Promise((resolve, reject) => {
        const { createReadStream = fs.createReadStream, customLogger = logger } = options;
        let jsonString: string = '';
        const readStream = createReadStream(filePath, { encoding: 'utf-8' });
        readStream.on('data', (chunk: string | Buffer) => {
            const data = chunk.toString('utf-8');
            jsonString += data;
        });
        readStream.on('end', () => {
            try {
                const parsedData = JSON.parse(jsonString);
                resolve(parsedData);
            }
            catch (e) {
                customLogger.error("error happened");
                reject(new SyntaxError("Malformed JSON"));
            }


        });
        readStream.on('error', (error) => {
            customLogger.error("Error while reading the stream of file %s, %o", filePath, error);
            reject(error);
        });
    });
}
export default parseJSONFile;


