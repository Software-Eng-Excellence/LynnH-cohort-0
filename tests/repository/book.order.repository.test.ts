import { BookRepository } from "../../src/repository/postgreSQL/Book.order.repository";
import { ConnectionManager } from "../../src/repository/postgreSQL/ConnectionManager";
import { IdentifiableBook } from "../../src/models/Book.models";
import { DbException, InitializationException } from "../../src/util/exceptions/RepositoryException";
import { Client } from "pg";
import logger from "../../src/util/logger";

jest.mock("../../src/repository/postgreSQL/ConnectionManager");

// Create a mock database client
const mockDb = {
    query: jest.fn(),
    end: jest.fn(),
    connect: jest.fn(),
    release: jest.fn(),
    port: 5432,
    host: "localhost",
    ssl: false,
    user: "test_user",
    database: "test_db",
    password: "test_password",
} as unknown as Client;

ConnectionManager.getConnection = jest.fn(() => Promise.resolve(mockDb));

const mockBook: IdentifiableBook = new IdentifiableBook(
    "book-123",      // id
    "The Great Gatsby",  // title
    "F. Scott Fitzgerald",  // author
    "Fiction",        // genre
    "Hardcover",      // format
    "English",        // language
    "Scribner",       // publisher
    "Yes",            // specialEdition
    "Box"            // packaging
);

describe("BookRepository", () => {
    let repository: BookRepository;

    beforeEach(() => {
        repository = new BookRepository();
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize the book table successfully and log the message", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => logger);
            await expect(repository.init()).resolves.not.toThrow();
            expect(infoSpy).toHaveBeenCalledWith("Book Table initialized");
            infoSpy.mockRestore();
        });

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.init()).rejects.toThrow(InitializationException);
        });
    });

    describe("Create Operation", () => {
        it("should create a new book entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.create(mockBook)).resolves.toEqual("book-123");
        });
    });

    describe("Read Operations", () => {
        it("should retrieve a book by ID successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockBook] });
            await expect(repository.get("book-123")).resolves.toEqual(expect.any(Object));
        });

        it("should throw DbException if book ID is not found", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.get("99")).rejects.toThrow(DbException);
        });

        it("should retrieve all books successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockBook, mockBook] });
            await expect(repository.getAll()).resolves.toHaveLength(2);
        });

        it("should return an empty array when no books exist", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.getAll()).resolves.toEqual([]);
        });
    });

    describe("Update Operation", () => {
        it("should update a book entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.update(mockBook)).resolves.not.toThrow();
        });
    });

    describe("Delete Operation", () => {
        it("should delete a book entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.delete("book-123")).resolves.not.toThrow();
        });

        it("should throw DbException if delete fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
            await expect(repository.delete("book-123")).rejects.toThrow(DbException);
        });
    });
});
