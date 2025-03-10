// Function to check if the row is valid
export const isRowValid = (columns: string[], headerLength: number, line: string, index: number, filePath: string): boolean => {
    if (columns.some(column => column === '') || columns.length !== headerLength) {
      return false;
    }
    return true;
  }