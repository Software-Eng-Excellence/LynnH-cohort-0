import { Book, IdentifiableBook } from "models/Book.models";
import { IMapper } from "./IMaper";
import { BookBuilder, IdentifiableBookBuilder } from "../models/builders/book.builder";

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

export interface PostgreSQLBook {
    id: string;
    title: string;
    author: string;
    genre: string;
    format: string;
    language: string;
    publisher: string;
    specialEdition: string;
    packaging: string;
}

export class PostgreSQLBookMapper implements IMapper<PostgreSQLBook, IdentifiableBook> {
    map(data: PostgreSQLBook): IdentifiableBook {
        return IdentifiableBookBuilder.newBuilder().setBook(
            BookBuilder.newBuilder()
                .setTitle(data.title)
                .setAuthor(data.author)
                .setGenre(data.genre)
                .setFormat(data.format)
                .setLanguage(data.language)
                .setPublisher(data.publisher)
                .setSpecialEdition(data.specialEdition)
                .setPackaging(data.packaging)
                .build()
        ).setId(data.id).build();
    }
    
    reverseMap(data: IdentifiableBook): PostgreSQLBook {
        return {
            id: data.getId(),
            title: data.getTitle(),
            author: data.getAuthor(),
            genre: data.getGenre(),
            format: data.getFormat(),
            language: data.getLanguage(),
            publisher: data.getPublisher(),
            specialEdition: data.getSpecialEdition(),
            packaging: data.getPackaging()
        };
    }
}

