import { Book } from "models/Book.models";
import { IMapper } from "./IMaper";
import { BookBuilder } from "../models/builders/book.builder";

export class JSONBookMapper implements IMapper<{ [key: string]: string }, Book> {
    map(data: { [key: string]: string }): Book {
        return BookBuilder.newBuilder()
            .setTitle(data["Book Title"])
            .setAuthor(data["Author"])
            .setGenre(data["Genre"])
            .setFormat(data["Format"])
            .setLanguage(data["Language"])
            .setPublisher(data["Publisher"])
            .setSpecialEdition(data["Special Edition"])
            .setPackaging(data["Packaging"])
            .build();
    }

    reverseMap(book: Book): { [key: string]: string } {
        return {
            "Book Title": book.getTitle(),
            "Author": book.getAuthor(),
            "Genre": book.getGenre(),
            "Format": book.getFormat(),
            "Language": book.getLanguage(),
            "Publisher": book.getPublisher(),
            "Special Edition": book.getSpecialEdition(),
            "Packaging": book.getPackaging()
        };
    }
}