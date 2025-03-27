import { IIdentifiableItem } from "../../models/IItem";
import { id, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException } from "../../util/exceptions/RepositoryException";
import { IIdentifiableOrderItem } from "../../models/IOrder";
import { PostgreSQLOrder, SQLiteOrder, SQLiteOrderMapper } from "../../mappers/Order.mapper";



const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "orders"(
    id Text PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    item_category TEXT NOT NULL,
    item_id TEXT NOT NULL
    )`;

const INSERT_ORDER = `INSERT INTO "orders" (id, quantity, price, item_category, item_id) VALUES ($1, $2, $3, $4, $5);`;

const SELECT_ORDER = `SELECT * FROM "orders" WHERE id=$1`;
const SELECT_ALL = `SELECT * FROM "orders" WHERE item_category=$1`;
const DELETE_ID = `DELETE FROM "orders" WHERE id=$1`;
const UPDATE_ID = `
UPDATE "orders"
SET 
    quantity = $1, 
    price = $2, 
    item_category = $3, 
    item_id = $4
WHERE id = $5;
`;

export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable {

    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable) {
    }

    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.query(CREATE_TABLE);
            await this.itemRepository.init()
            logger.info("Order Table initialized")
        } catch (error: unknown) {
            logger.error("Failed to initialize order table", error as Error)
            throw new InitializationException("Failed to initialize order table", error as Error)

        }

    }

    async create(order: IIdentifiableOrderItem): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.query("BEGIN TRANSACTION")
            const item_id = await this.itemRepository.create(order.getItem())

            await conn.query(INSERT_ORDER, [
                order.getId(),
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                item_id
            ]);

            await conn.query("COMMIT");

            return order.getId()
        } catch (error: unknown) {
            logger.error("Failed to create order", error as Error);
            if (conn) {
                await conn.query("ROLLBACK");
            }
            throw new DbException("Failed to create order", error as Error);
        }

    }

    async get(id: id): Promise<IIdentifiableOrderItem> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.query<SQLiteOrder>(SELECT_ORDER, [id]);
            if (!result.rows || result.rows.length === 0) {
                logger.error("Order of id %s not found", id);
                throw new Error("Order of id %s not found" + id);
            }
            const cakeData = result.rows[0]
            const cake = await this.itemRepository.get(cakeData.item_id);
            
            return new SQLiteOrderMapper().map({ data: cakeData, item: cake });
        } catch (error) {
            logger.error("Failed to get order of id %s %o", id, error as Error);

            throw new DbException("Failed to get order of id " + id, error as Error);

        }
    }
    async getAll(): Promise<IIdentifiableOrderItem[]> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            const items = await this.itemRepository.getAll();


            // Query all orders regardless of whether items exist
            const orders = (await conn.query<SQLiteOrder>(SELECT_ALL, [items.length ? items[0].getCategory() : ""])).rows;

            if (orders.length === 0 || items.length === 0) {
                return [];
            }

            // Map orders to corresponding items
            const bindOrders = orders.map((order) => {
                const item = items.find((item) => item.getId() === order.item_id);
                if (!item) {
                    throw new DbException("Item not found for order of id " + order.id, new Error("Item not found"));
                }
                return { order, item };
            });

            const mapper = new SQLiteOrderMapper();
            const identifiableOrders = bindOrders.map(({ order, item }) => mapper.map({ data: order, item }));
            return identifiableOrders;

        } catch (error) {
            logger.error("Failed to get all orders", error as Error);
            throw new DbException("Failed to get all orders", error as Error);
        }
    }
    async update(item: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.query("BEGIN")
            await this.itemRepository.update(item.getItem())



            await conn.query(UPDATE_ID,
                [item.getQuantity(), item.getPrice(), item.getItem().getCategory(), item.getItem().getId(), item.getId()]

            );

            await conn.query("COMMIT")

        } catch (error: unknown) {
            logger.error("Failed to update order", error as Error);
            conn && await conn.query("ROLLBACK")
            throw new DbException("Failed to update order", error as Error);
        }
    }
    async delete(id: id): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.query("BEGIN TRANSACTION")

            await conn.query(DELETE_ID,
                [id]
            );

            await conn.query("COMMIT")
            logger.info("Order deleted successfully")

        } catch (error: unknown) {
            logger.error("Failed to delete order", error as Error);
            conn && await conn.query("ROLLBACK")
            throw new DbException("Failed to delete order", error as Error);
        }
    }



}