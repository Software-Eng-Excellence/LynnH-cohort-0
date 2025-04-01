import { id, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import { ItemCategory } from "../../models/IItem";
import { SQLPet,SQLPetMapper } from "../../mappers/pet.mapper";

const tableName = ItemCategory.PET;

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    productType TEXT NOT NULL,
    petType TEXT NOT NULL,
    brand TEXT NOT NULL,
    size TEXT NOT NULL,
    flavor TEXT NOT NULL,
    ecoFriendly TEXT NOT NULL
);
`;

const INSERT_PET = `
INSERT INTO ${tableName} (
    id, productType, petType, brand, size, flavor, ecoFriendly
) VALUES ($1, $2, $3, $4, $5, $6, $7);
`;

const SELECT_PET = `SELECT 
    id,
    producttype AS "productType",
    pettype AS "petType",
    brand,
    size,
    flavor,
    ecofriendly AS "ecoFriendly"
FROM ${tableName} WHERE id = $1`;

const SELECT_ALL = `SELECT 
    id,
    producttype AS "productType",
    pettype AS "petType",
    brand,
    size,
    flavor,
    ecofriendly AS "ecoFriendly"
FROM ${tableName}`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE id = $1`;
const UPDATE_ID = `
UPDATE ${tableName} 
SET 
    productType = $1,
    petType = $2,
    brand = $3,
    size = $4,
    flavor = $5,
    ecoFriendly = $6
WHERE id = $7;
`;

export class PetRepository implements IRepository<any>, Initializable {
    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE);
            logger.info("Pet Table initialized");
        } catch (error) {
            logger.error("Failed to initialize pet table", error);
            throw new InitializationException("Failed to initialize pet table", error as Error);
        }
    }

    async create(item: any): Promise<id> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(INSERT_PET, [
                item.getId(),
                item.getProductType(),
                item.getPetType(),
                item.getBrand(),
                item.getSize(),
                item.getFlavor(),
                item.getEcoFriendly()
            ]);
            return item.getId();
        } catch (error) {
            logger.error("Failed to create pet product", error);
            throw new DbException("Failed to create pet product", error as Error);
        }
    }

    async get(id: id): Promise<any> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<SQLPet>(SELECT_PET, [id]);
            if (!result.rows || result.rows.length === 0) {
                throw new ItemNotFoundException("Pet product not found");
            }
            return new SQLPetMapper().map(result.rows[0]);
        } catch (error) {
            logger.error("Failed to get pet product of id %s %o", id, error);
            throw new DbException("Failed to get pet product of id " + id, error as Error);
        }
    }

    async getAll(): Promise<any[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<SQLPet>(SELECT_ALL);
            if (!result.rows || result.rows.length === 0) {
                logger.warn("No pets found in the database.");
                return [];
            }
            return result.rows.map((row) => new SQLPetMapper().map(row));
        } catch (error) {
            logger.error("Failed to get all pet products", error);
            throw new DbException("Failed to get all pet products", error as Error);
        }
    }

    async update(item: any): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(UPDATE_ID, [
                item.getProductType(),
                item.getPetType(),
                item.getBrand(),
                item.getSize(),
                item.getFlavor(),
                item.getEcoFriendly(),
                item.getId()
            ]);
            logger.info("Pet product updated successfully");
        } catch (error) {
            logger.error("Failed to update pet product %s %o", item.getId(), error);
            throw new DbException("Failed to update pet product", error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(DELETE_ID, [id]);
        } catch (error) {
            logger.error("Failed to delete pet product of id %s %o", id, error);
            throw new DbException("Failed to delete pet product of id " + id, error as Error);
        }
    }
}
