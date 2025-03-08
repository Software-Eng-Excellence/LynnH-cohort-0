import fs from 'fs';
 import logger from '../logger';
import { isRowValid } from '../validators';

//to apply DIP principle : 
type CSVParserOptions = {
  createReadStream?: typeof fs.createReadStream; // Allow custom stream creation (useful for testing)
  customLogger?: typeof logger; // Use an injected logger for better flexibility
  validator?: typeof isRowValid; // Allow passing a custom row validation function
  includeHeader?: boolean; // Move includeHeader into the options for clarity
};

// parse CSV File
const parseCSV = (filePath: string, options: CSVParserOptions = {}): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const { createReadStream = fs.createReadStream, customLogger = logger, validator=isRowValid, includeHeader = false } = options;
    
    const results: string[][] = []; // Store parsed CSV rows as arrays
    const readStream = createReadStream(filePath, { encoding: 'utf-8' }); // Create a readable stream for the file

    readStream.on('data', (chunk: string | Buffer) => {

      const data = chunk.toString('utf-8');
      const lines = data.split('\n').filter(line => line.trim() !== ''); // Split data into lines and remove empty lines
      let headerLength = 0;
      lines.forEach((line, index) => {
        try {

          const columns = line.split(',').map(value => value.trim().replace(/^"(.*)"$/, '$1'));
          // Split line into columns, trim spaces, and remove quotes

          if (index === 0) {
            headerLength = columns.length
          }

          // Check if the line is valid
          if (validator(columns, headerLength, line, index, filePath)) {
            results.push(columns); // Add valid row to results
          }
        } catch (error) {
          customLogger.error("Error parsing line %d in file %s: %o", index + 1, filePath, error);
        }
      });
    });

    readStream.on('end', () => {
      if (!includeHeader) {
        results.shift();
      }
      resolve(results); // Resolve the promise with parsed data when done
    });

    readStream.on('error', (error) => {
      customLogger.error("Error while reading the stream of file %s, $o", filePath, error);
      reject(error); // Reject the promise if an error occurs
    });
  });
};

export default parseCSV;