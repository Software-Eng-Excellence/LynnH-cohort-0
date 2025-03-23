import logger from "util/logger";
import { Book, IdentifiableBook } from "../../models/Book.models";


export class BookBuilder{
    private title!: string;
    private author!: string;
    private genre!: string;
    private format!: string;
    private language!: string;
    private publisher!: string;
    private specialEdition!: string;
    private packaging!: string;

    public static newBuilder():BookBuilder{
        return new BookBuilder();
    }

    public setTitle(title: string): BookBuilder {
        this.title = title;
        return this;
    }

    public setAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    public setGenre(genre: string): BookBuilder {
        this.genre = genre;
        return this;
    }

    public setFormat(format: string): BookBuilder {
        this.format = format;
        return this;
    }

    public setLanguage(language: string): BookBuilder {
        this.language = language;
        return this;
    }

    public setPublisher(publisher: string): BookBuilder {
        this.publisher = publisher;
        return this;
    }

    public setSpecialEdition(specialEdition: string): BookBuilder {
        this.specialEdition = specialEdition;
        return this;
    }

    public setPackaging(packaging: string): BookBuilder {
        this.packaging = packaging;
        return this;
    }
    build():Book{
        const requiredProperties = [
            this.title,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        ];

        for (const property of requiredProperties) {
            if (property === undefined || property === null) {
                throw new Error('Missing required property');
            }
        }
       
        return new Book(
            this.title,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        );
        
    }
}
//The IdentifiableBookBuilder allows for adding an ID to a Book object in a separate phase

export class IdentifiableBookBuilder{
    private id!:string;
    private book !:Book;
    static newBuilder(): IdentifiableBookBuilder {
        return new IdentifiableBookBuilder();
    }

    
    setId(id: string): IdentifiableBookBuilder {
        this.id = id;
        return this;
    }

    setBook(book: Book): IdentifiableBookBuilder {
        this.book = book;
        return this;
    }
    build(): IdentifiableBook {
        if (!this.id || !this.book) {
            logger.error("Missing required properties, could not build an identifiable book");
            throw new Error("Missing required properties");
        }
        return new IdentifiableBook(
            this.id,
            this.book.getTitle(),
            this.book.getAuthor(),
            this.book.getGenre(),
            this.book.getFormat(),
            this.book.getLanguage(),
            this.book.getPublisher(),
            this.book.getSpecialEdition(),
            this.book.getPackaging()
        );
                }
}