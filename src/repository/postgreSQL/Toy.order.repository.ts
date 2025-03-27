import { IdentifiableToy } from "../../models/Toy.models";
import { id, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import { ItemCategory } from "../../models/IItem";
import { PostgreSQLiteToy, PostgreSQLiteToyMapper } from "../../mappers/toy.mapper";

const tableName = ItemCategory.TOY;
const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    ageGroup TEXT NOT NULL,
    brand TEXT NOT NULL,
    material TEXT NOT NULL,
    batteryRequired BOOLEAN NOT NULL,
    educational BOOLEAN NOT NULL
);
`;

const INSERT_TOY = `
INSERT INTO ${tableName} (
    id, type, ageGroup, brand, material, batteryRequired, educational
) VALUES ($1, $2, $3, $4, $5, $6, $7);
`;

const SELECT_TOY = `SELECT
    id,
    type,
    ageGroup AS "ageGroup",
    brand,
    material,
    batteryRequired AS "batteryRequired",
    educational
FROM ${tableName} WHERE id = $1;`;

const SELECT_ALL = `SELECT
    id,
    type,
    ageGroup AS "ageGroup",
    brand,
    material,
    batteryRequired AS "batteryRequired",
    educational
FROM ${tableName}`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE id = $1;`;
const UPDATE_ID = `
UPDATE ${tableName} 
SET 
    type = $1, 
    ageGroup = $2, 
    brand = $3, 
    material = $4, 
    batteryRequired = $5, 
    educational = $6
WHERE id = $7;
`;

export class ToyRepository implements IRepository<IdentifiableToy>, Initializable {
    async init() {
        try {
            const conn = await ConnectionManager.getConnection();

            await conn.query(CREATE_TABLE);
            logger.info("Toy Table initialized");
        } catch (error: unknown) {
            logger.error("Failed to initialize toy table", error as Error);
            throw new InitializationException("Failed to initialize toy table", error as Error);
        }
    }

    async create(item: IdentifiableToy): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();

            await conn.query(INSERT_TOY, [
                item.getId(),
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.isBatteryRequired(),
                item.isEducational()
            ]);

            return item.getId();
        } catch (error: unknown) {
            logger.error("Failed to create toy", error as Error);
            throw new DbException("Failed to create toy", error as Error);
        }
    }

    async get(id: id): Promise<IdentifiableToy> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<PostgreSQLiteToy>(SELECT_TOY, [id]);

            if (!result.rows || result.rows.length === 0) {
                throw new ItemNotFoundException("Toy item not found");
            }

            const toyData = result.rows[0];
            return new PostgreSQLiteToyMapper().map(toyData);
        } catch (error) {
            logger.error("Failed to get toy with id %s %o", id, error as Error);
            throw new DbException("Failed to get toy with id " + id, error as Error);
        }
    }

    async getAll(): Promise<IdentifiableToy[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<PostgreSQLiteToy>(SELECT_ALL);

            if (!result.rows || result.rows.length === 0) {
                logger.warn("No toys found in the database.");
                return [];
            }

            return result.rows.map((row) => new PostgreSQLiteToyMapper().map(row));
        } catch (error) {
            logger.error("Failed to get all toys %o", error as Error);
            throw new DbException("Failed to get all toys", error as Error);
        }
    }

    async update(item: IdentifiableToy): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query("BEGIN");

            await conn.query(UPDATE_ID, [
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.isBatteryRequired(),
                item.isEducational(),
                item.getId()
            ]);

            await conn.query("COMMIT");
            logger.info("Toy updated successfully");
        } catch (error: unknown) {
            logger.error("Failed to update toy %s %o", item.getId(), error as Error);
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
            logger.error("Failed to delete toy with id %s %o", id, error as Error);
            throw new DbException("Failed to delete toy with id " + id, error as Error);
        }
    }
}
