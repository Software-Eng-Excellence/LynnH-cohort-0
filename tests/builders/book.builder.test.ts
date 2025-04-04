import { BookBuilder } from "../../src/models/builders/book.builder";
import { Book } from "../../src/models/Book.models";

describe("BookBuilder", () => {
    test("should build a Book object with all properties", () => {
        const book = new BookBuilder()
            .setTitle("Clean Code")
            .setAuthor("Robert C. Martin")
            .setGenre("Programming")
            .setFormat("Hardcover")
            .setLanguage("English")
            .setPublisher("Prentice Hall")
            .setSpecialEdition("Yes")
            .setPackaging("Gift Wrapped")
            .build();

        expect(book).toBeInstanceOf(Book);
        expect(book.getTitle()).toBe("Clean Code");
        expect(book.getAuthor()).toBe("Robert C. Martin");
    });

    test("should throw an error if required properties are missing", () => {
        expect(() => {
            new BookBuilder().build();
        }).toThrow("Missing required property");
    });


    test("should correctly set and retrieve properties", () => {
        const builder = new BookBuilder();
        builder.setPublisher("O'Reilly");
        expect(builder["publisher"]).toBe("O'Reilly");

        builder.setLanguage("Spanish");
        expect(builder["language"]).toBe("Spanish");
    });

    test("should handle invalid input values", () => {
        const builder = new BookBuilder();
        builder.setTitle("");
        expect(() => builder.build()).toThrow("Missing required property");
    });
});
