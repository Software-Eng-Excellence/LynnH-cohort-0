import { IdentifiableFurniture } from "../../models/Furniture.models";
import { id, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import { ItemCategory } from "../../models/IItem";
import { PostgreSQLFurniture, PostgreSQLFurnitureMapper } from "../../mappers/furniture.mapper";


const tableName = ItemCategory.FURNITURE;
const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    material TEXT NOT NULL,
    color TEXT NOT NULL,
    size TEXT NOT NULL,
    style TEXT NOT NULL,
    assemblyRequired BOOLEAN NOT NULL,
    warranty TEXT NOT NULL
);
`;

const INSERT_FURNITURE = `
INSERT INTO ${tableName} (
    id, type, material, color, size, style, assemblyRequired, warranty
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
`;

const SELECT_FURNITURE = `SELECT
    id,
    type,
    material,
    color,
    size,
    style,
    assemblyrequired AS "assemblyRequired",
    warranty FROM ${tableName} WHERE id = $1`;

const SELECT_ALL = `SELECT
    id,
    type,
    material,
    color,
    size,
    style,
    assemblyrequired AS "assemblyRequired",
    warranty FROM ${tableName}`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE id = $1`;

const UPDATE_ID = `
UPDATE ${tableName} 
SET 
    type = $1, 
    material = $2, 
    color = $3, 
    size = $4, 
    style = $5, 
    assemblyRequired = $6, 
    warranty = $7
WHERE id = $8;
`;

export class FurnitureRepository implements IRepository<IdentifiableFurniture>, Initializable {
    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE);
            logger.info("Furniture Table initialized");
        } catch (error: unknown) {
            logger.error("Failed to initialize furniture table", error as Error);
            throw new InitializationException("Failed to initialize furniture table", error as Error);
        }
    }

    async create(item: IdentifiableFurniture): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query(INSERT_FURNITURE, [
                item.getId(),
                item.getType(),
                item.getMaterial(),
                item.getColor(),
                item.getSize(),
                item.getStyle(),
                item.isAssemblyRequired(),
                item.getWarranty()
            ]);
            return item.getId();
        } catch (error: unknown) {
            logger.error("Failed to create furniture", error as Error);
            throw new DbException("Failed to create furniture", error as Error);
        }
    }

    async get(id: id): Promise<IdentifiableFurniture> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<PostgreSQLFurniture>(SELECT_FURNITURE, [id]);

            if (!result.rows || result.rows.length === 0) {
                throw new ItemNotFoundException("Furniture item not found");
            }

            const furnitureData = result.rows[0];
            return new PostgreSQLFurnitureMapper().map(furnitureData);
        } catch (error) {
            logger.error("Failed to get furniture with id %s %o", id, error as Error);
            throw new DbException("Failed to get furniture with id " + id, error as Error);
        }
    }

    async getAll(): Promise<IdentifiableFurniture[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<PostgreSQLFurniture>(SELECT_ALL);

            if (!result.rows || result.rows.length === 0) {
                logger.warn("No furniture found in the database.");
                return [];
            }

            return result.rows.map((row) => new PostgreSQLFurnitureMapper().map(row));
        } catch (error) {
            logger.error("Failed to get all furniture %o", error as Error);
            throw new DbException("Failed to get all furniture", error as Error);
        }
    }

    async update(item: IdentifiableFurniture): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query("BEGIN");

            await conn.query(UPDATE_ID, [
                item.getType(),
                item.getMaterial(),
                item.getColor(),
                item.getSize(),
                item.getStyle(),
                item.isAssemblyRequired(),
                item.getWarranty(),
                item.getId()
            ]);

            await conn.query("COMMIT");
            logger.info("Furniture updated successfully");
        } catch (error: unknown) {
            logger.error("Failed to update furniture %s %o", item.getId(), error as Error);
            if (conn) {
                await conn.query("ROLLBACK");
            }
            throw new DbException("Failed to update furniture", error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(DELETE_ID, [id]);
        } catch (error) {
            logger.error("Failed to delete furniture with id %s %o", id, error as Error);
            throw new DbException("Failed to delete furniture with id " + id, error as Error);
        }
    }
}
