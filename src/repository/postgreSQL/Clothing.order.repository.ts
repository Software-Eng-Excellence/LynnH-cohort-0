import { IdentifiableClothing } from "../../models/Clothing.models";
import { id, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import { ItemCategory } from "../../models/IItem";
import { PostgreSQLClothing, PostgreSQLClothingMapper } from "../../mappers/Clothing.mapper";

const tableName = ItemCategory.CLOTHING;

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    material TEXT NOT NULL,
    pattern TEXT NOT NULL,
    brand TEXT NOT NULL,
    gender TEXT NOT NULL,
    packaging TEXT NOT NULL,
    specialRequest TEXT
);
`;

const INSERT_CLOTHING = `
INSERT INTO ${tableName} (
    id, type, size, color, material, pattern, brand, gender, packaging, specialRequest
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
`;

const SELECT_CLOTHING = `
SELECT
    id,
    type,
    size,
    color,
    material,
    pattern,
    brand,
    gender,
    packaging,
    specialrequest AS "specialRequest"
FROM ${tableName} WHERE id = $1;
`;

const SELECT_ALL = `
SELECT
    id,
    type,
    size,
    color,
    material,
    pattern,
    brand,
    gender,
    packaging,
    specialrequest AS "specialRequest"
FROM ${tableName};
`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE id = $1;`;

const UPDATE_ID = `
UPDATE ${tableName} 
SET 
    type = $1, 
    size = $2, 
    color = $3, 
    material = $4, 
    pattern = $5, 
    brand = $6, 
    gender = $7, 
    packaging = $8, 
    specialRequest = $9
WHERE id = $10;
`;

export class ClothingRepository implements IRepository<IdentifiableClothing>, Initializable {
    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE);
            logger.info("Clothing table initialized");
        } catch (error: unknown) {
            logger.error("Failed to initialize clothing table", error as Error);
            throw new InitializationException("Failed to initialize clothing table", error as Error);
        }
    }

    async create(item: IdentifiableClothing): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query(INSERT_CLOTHING, [
                item.getId(),
                item.getType(),
                item.getSize(),
                item.getColor(),
                item.getMaterial(),
                item.getPattern(),
                item.getBrand(),
                item.getGender(),
                item.getPackaging(),
                item.getSpecialRequest(),
            ]);
            return item.getId();
        } catch (error: unknown) {
            logger.error("Failed to create clothing item", error as Error);
            throw new DbException("Failed to create clothing item", error as Error);
        }
    }

    async get(id: id): Promise<IdentifiableClothing> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<PostgreSQLClothing>(SELECT_CLOTHING, [id]);

            if (!result.rows || result.rows.length === 0) {
                throw new ItemNotFoundException("Clothing item not found");
            }

            const clothingData = result.rows[0];
            return new PostgreSQLClothingMapper().map(clothingData);
        } catch (error) {
            logger.error("Failed to get clothing item with id %s", id, error as Error);
            throw new DbException("Failed to get clothing item", error as Error);
        }
    }

    async getAll(): Promise<IdentifiableClothing[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<PostgreSQLClothing>(SELECT_ALL);

            if (!result.rows || result.rows.length === 0) {
                logger.warn("No clothing items found in the database.");
                return [];
            }

            return result.rows.map((row) => new PostgreSQLClothingMapper().map(row));
        } catch (error) {
            logger.error("Failed to get all clothing items", error as Error);
            throw new DbException("Failed to get all clothing items", error as Error);
        }
    }

    async update(item: IdentifiableClothing): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query("BEGIN");

            await conn.query(UPDATE_ID, [
                item.getType(),
                item.getSize(),
                item.getColor(),
                item.getMaterial(),
                item.getPattern(),
                item.getBrand(),
                item.getGender(),
                item.getPackaging(),
                item.getSpecialRequest(),
                item.getId(),
            ]);

            await conn.query("COMMIT");
            logger.info("Clothing item updated successfully");
        } catch (error: unknown) {
            logger.error("Failed to update clothing item with id %s", item.getId(), error as Error);
            if (conn) {
                await conn.query("ROLLBACK");
            }
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(DELETE_ID, [id]);
        } catch (error) {
            logger.error("Failed to delete clothing item with id %s", id, error as Error);
            throw new DbException("Failed to delete clothing item", error as Error);
        }
    }
}
