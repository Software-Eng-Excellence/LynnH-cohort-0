import { IIdentifiableCake } from "../../models/Cake.models";
import { id, Initializable, IRepository } from "repository/IRepository";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import logger from "../../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { ItemCategory } from "../../models/IItem";
import { SQLiteCake, SQLCakeMapper } from "../../mappers/Cake.mapper";


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
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);
`;

const SELECT_CAKE = `SELECT * FROM ${tableName} WHERE id= ? `;
const SELECT_ALL = `SELECT * FROM ${tableName}`;
const DELETE_ID = `DELETE FROM ${tableName} WHERE id=? `;
const UPDATE_ID = `
UPDATE ${tableName} 
SET 
    type = ?, 
    flavor = ?, 
    filling = ?, 
    size = ?, 
    layers = ?, 
    frostingType = ?, 
    frostingFlavor = ?, 
    decorationType = ?, 
    decorationColor = ?, 
    customMessage = ?, 
    shape = ?, 
    allergies = ?, 
    specialIngredients = ?, 
    packagingType = ?
WHERE id = ?;
`;

export class CakeRepository implements IRepository<IIdentifiableCake>, Initializable {

    async init() {
        try {
            const conn = await ConnectionManager.getConnection();

            await conn.exec(CREATE_TABLE);
            logger.info("Cake Table initialized")
        } catch (error: unknown) {
            logger.error("Failed to initialize cake table", error as Error)
            throw new InitializationException("Failed to initialize cake table", error as Error)

        }

    }
    //it is expected that a transaction has been initaialized before this method is called
    async create(item: IIdentifiableCake): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();

            conn.run(INSERT_CAKE, [
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
            const result = await conn.get<SQLiteCake>(SELECT_CAKE, id);
            if (!result) {
                throw new ItemNotFoundException("Cake item not found");
            }

            return new SQLCakeMapper().map(result);
        } catch (error) {
            logger.error("Failed to get cake of id %s %o", id, error as Error);

            throw new DbException("Failed to get cake of id " + id, error as Error);

        }
    }
    async getAll(): Promise<IIdentifiableCake[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.all<SQLiteCake[]>(SELECT_ALL);
            const mapper = new SQLCakeMapper();
            if (!result) {
                return [];
            }

            return result.map((cake) => {

                return mapper.map(cake);
            });
        } catch (error) {
            logger.error("Failed to get all cakes ", error as Error);

            throw new DbException("Failed to get all cakes", error as Error);

        }
    }
    async update(item: IIdentifiableCake): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();

            conn.run(UPDATE_ID, [
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

        } catch (error: unknown) {
            logger.error("Failed to update cake order %s %o",item.getId(), error as Error);

            throw new DbException("Failed to update cake order %s %o"+item.getId(), error as Error)
        }
    }
    async delete(id: id): Promise<void> {
        try {

            const conn = await ConnectionManager.getConnection();
             await conn.run(DELETE_ID, id);
        
        } catch (error) {
            logger.error("Failed to dete cake of id %s %o", id, error as Error);

            throw new DbException("Failed to delete cake of id " + id, error as Error);

        }
    }


}