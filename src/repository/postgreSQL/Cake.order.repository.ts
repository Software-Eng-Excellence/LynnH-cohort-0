import { IIdentifiableCake } from "../../models/Cake.models";
import { id, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import { ItemCategory } from "../../models/IItem";
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/Cake.mapper";

const tableName = ItemCategory.CAKE;
const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id Text PRIMARY KEY,
    type TEXT NOT NULL,
    flavor TEXT NOT NULL,
    filling TEXT NOT NULL,
    size INTEGER NOT NULL,
    layers INTEGER NOT NULL,
    frostingType TEXT NOT NULL,
    frostingFlavor TEXT NOT NULL,
    decorationType TEXT NOT NULL,
    decorationColor TEXT NOT NULL,
    customMessage TEXT,
    shape TEXT NOT NULL,
    allergies TEXT,
    specialIngredients TEXT,
    packagingType TEXT NOT NULL
);
`;

const INSERT_CAKE = `
INSERT INTO ${tableName} (
    id, type, flavor, filling, size, layers, frostingType, frostingFlavor, 
    decorationType, decorationColor, customMessage, shape, allergies, 
    specialIngredients, packagingType
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
`;

const SELECT_CAKE = `SELECT
    id,
    type,
    flavor,
    filling,
    size,
    layers,
    frostingtype AS "frostingType",
    frostingflavor AS "frostingFlavor",
    decorationtype AS "decorationType",
    decorationcolor AS "decorationColor",
    custommessage AS "customMessage",
    shape,
    allergies,
    specialingredients AS "specialIngredients",
    packagingtype AS "packagingType" FROM ${tableName} WHERE id= $1 `;

const SELECT_ALL = `SELECT
    id,
    type,
    flavor,
    filling,
    size,
    layers,
    frostingtype AS "frostingType",
    frostingflavor AS "frostingFlavor",
    decorationtype AS "decorationType",
    decorationcolor AS "decorationColor",
    custommessage AS "customMessage",
    shape,
    allergies,
    specialingredients AS "specialIngredients",
    packagingtype AS "packagingType"
FROM ${tableName}`;

const DELETE_ID = `DELETE FROM ${tableName} WHERE id=$1 `;
const UPDATE_ID = `
UPDATE ${tableName} 
SET 
    type = $1, 
    flavor = $2, 
    filling = $3, 
    size = $4, 
    layers = $5, 
    frostingType = $6, 
    frostingFlavor = $7, 
    decorationType = $8, 
    decorationColor = $9, 
    customMessage = $10, 
    shape = $11, 
    allergies = $12, 
    specialIngredients = $13, 
    packagingType = $14
WHERE id = $15;`;

export class CakeRepository implements IRepository<IIdentifiableCake>, Initializable {
    async init() {
        try {
            const conn = await ConnectionManager.getConnection();

            await conn.query(CREATE_TABLE);
            logger.info("Cake Table initialized")
        } catch (error: unknown) {
            logger.error("Failed to initialize cake table", error as Error)
            throw new InitializationException("Failed to initialize cake table", error as Error)

        }

    }

    async create(item: IIdentifiableCake): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();

            conn.query(INSERT_CAKE, [
                item.getId(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
            ]);

            return item.getId()

        } catch (error: unknown) {
            logger.error("Failed to create cake order", error as Error);

            throw new DbException("Failed to create cake order", error as Error)
        }

    }
    async get(id: id): Promise<IIdentifiableCake> {
        try {

            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<SQLiteCake>(SELECT_CAKE, [id]);

            if (!result.rows || result.rows.length === 0) {
                throw new ItemNotFoundException("Cake item not found");
            }

            const cakeData = result.rows[0];

            return new SQLiteCakeMapper().map(cakeData);
        } catch (error) {
            logger.error("Failed to get cake of id %s %o", id, error as Error);

            throw new DbException("Failed to get cake of id " + id, error as Error);

        }
    }
    async getAll(): Promise<IIdentifiableCake[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<SQLiteCake>(SELECT_ALL);

            if (!result.rows || result.rows.length === 0) {
                logger.warn("No cakes found in the database.");
                return [];
            }

            return result.rows.map((row) => new SQLiteCakeMapper().map(row));
        } catch (error) {
            logger.error("Failed to get all cakes %o", error as Error);
            throw new DbException("Failed to get all cakes", error as Error);
        }
    }
    async update(item: IIdentifiableCake): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            await conn.query("BEGIN");

            await conn.query(UPDATE_ID, [
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
                item.getId()
            ]);

            await conn.query("COMMIT");
            logger.info("cake order updated successfully")
        } catch (error: unknown) {
            logger.error("Failed to update cake order %s %o", item.getId(), error as Error);
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
            logger.error("Failed to dete cake of id %s %o", id, error as Error);

            throw new DbException("Failed to delete cake of id " + id, error as Error);

        }
    }



}