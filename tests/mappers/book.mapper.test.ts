import { JSONBookMapper } from "../../src/mappers/Book.mapper";

describe("JSONBookMapper", () => {
    let mapper: JSONBookMapper;

    beforeEach(() => {
        mapper = new JSONBookMapper();
    });

    it("should correctly map valid JSON data to a Book object", () => {
        const jsonData = {
            "Book Title": "The Lost Kingdom",
            "Author": "Dan Brown",
            "Genre": "Science Fiction",
            "Format": "Audiobook",
            "Language": "German",
            "Publisher": "Penguin Random House",
            "Special Edition": "Signed Copy",
            "Packaging": "Gift Wrap"
        };

        const book = mapper.map(jsonData);

        expect(book.getTitle()).toBe("The Lost Kingdom");
        expect(book.getAuthor()).toBe("Dan Brown");
        expect(book.getGenre()).toBe("Science Fiction");
        expect(book.getFormat()).toBe("Audiobook");
        expect(book.getLanguage()).toBe("German");
        expect(book.getPublisher()).toBe("Penguin Random House");
        expect(book.getSpecialEdition()).toBe("Signed Copy");
        expect(book.getPackaging()).toBe("Gift Wrap");
    });

    it("should throw an error when required fields are missing", () => {
        const jsonData = {
            "Book Title": "Inferno",
            "Author": "Dan Brown"
        };

        expect(() => mapper.map(jsonData)).toThrow("Missing required property");
    });

    it("should throw an error when an empty object is passed", () => {
        const jsonData = {};

        expect(() => mapper.map(jsonData)).toThrow("Missing required property");
    });


});
