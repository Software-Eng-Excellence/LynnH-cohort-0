import { IdentifiableBook } from "../../models/Book.models";
import { id, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import { ItemCategory } from "../../models/IItem";
import { PostgreSQLBook, PostgreSQLBookMapper } from "../../mappers/Book.mapper";

const tableName = ItemCategory.BOOK;
const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    format TEXT NOT NULL,
    language TEXT NOT NULL,
    publisher TEXT NOT NULL,
    specialEdition TEXT,
    packaging TEXT NOT NULL
);
`;

const INSERT_BOOK = `
INSERT INTO ${tableName} (
    id, title, author, genre, format, language, publisher, specialEdition, packaging
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
`;

const SELECT_BOOK = `
SELECT 
    id, 
    title, 
    author, 
    genre, 
    format, 
    language, 
    publisher, 
    specialEdition AS "specialEdition", 
    packaging 
FROM ${tableName} 
WHERE id = $1`;

const SELECT_ALL = `
SELECT 
    id, 
    title, 
    author, 
    genre, 
    format, 
    language, 
    publisher, 
    specialEdition AS "specialEdition", 
    packaging 
FROM ${tableName}`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE id = $1`;
const UPDATE_ID = `
UPDATE ${tableName} 
SET 
    title = $1, 
    author = $2, 
    genre = $3, 
    format = $4, 
    language = $5, 
    publisher = $6, 
    specialEdition = $7, 
    packaging = $8
WHERE id = $9;`;

export class BookRepository implements IRepository<IdentifiableBook>, Initializable {
    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE);
            logger.info("Book Table initialized");
        } catch (error: unknown) {
            logger.error("Failed to initialize book table", error as Error);
            throw new InitializationException("Failed to initialize book table", error as Error);
        }
    }

    async create(item: IdentifiableBook): Promise<id> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(INSERT_BOOK, [
                item.getId(),
                item.getTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging()
            ]);
            return item.getId();
        } catch (error: unknown) {
            logger.error("Failed to create book", error as Error);
            throw new DbException("Failed to create book", error as Error);
        }
    }

    async get(id: id): Promise<IdentifiableBook> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<PostgreSQLBook>(SELECT_BOOK, [id]);
            if (!result.rows || result.rows.length === 0) {
                throw new ItemNotFoundException("Book not found");
            }
            return new PostgreSQLBookMapper().map(result.rows[0]);
        } catch (error) {
            logger.error("Failed to get book of id %s %o", id, error as Error);
            throw new DbException("Failed to get book of id " + id, error as Error);
        }
    }

    async getAll(): Promise<IdentifiableBook[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<PostgreSQLBook>(SELECT_ALL);
            if (!result.rows || result.rows.length === 0) {
                logger.warn("No books found in the database.");
                return [];
            }
            return result.rows.map((row) => new PostgreSQLBookMapper().map(row));
        } catch (error) {
            logger.error("Failed to get all books %o", error as Error);
            throw new DbException("Failed to get all books", error as Error);
        }
    }

    async update(item: IdentifiableBook): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query("BEGIN");
            await conn.query(UPDATE_ID, [
                item.getTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging(),
                item.getId()
            ]);
            await conn.query("COMMIT");
            logger.info("Book updated successfully");
        } catch (error: unknown) {
            logger.error("Failed to update book %s %o", item.getId(), error as Error);
            throw new DbException("Failed to update book", error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(DELETE_ID, [id]);
        } catch (error) {
            logger.error("Failed to delete book of id %s %o", id, error as Error);
            throw new DbException("Failed to delete book of id " + id, error as Error);
        }
    }
}
