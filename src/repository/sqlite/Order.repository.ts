import { id, Initializable, IRepository } from "repository/IRepository";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import logger from "../../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { IIdentifiableItem } from "models/IItem";
import { IIdentifiableOrderItem } from "models/IOrder";
import { SQLOrder, SQLOrderMapper } from "../../mappers/Order.mapper";


const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "orders"(
    id Text PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    item_category TEXT NOT NULL,
    item_id TEXT NOT NULL
    )`;

const INSERT_ORDER = `INSERT INTO "orders" (id, quantity, price, item_category, item_id) VALUES (?, ?, ?, ?, ?);`;

const SELECT_ORDER = `SELECT * FROM "orders" WHERE id=?`;
const SELECT_ALL = `SELECT * FROM "orders" WHERE item_category=?`;
const DELETE_ID = `DELETE FROM "orders" WHERE id=?`;
const UPDATE_ID = `
UPDATE "orders"
SET 
    quantity = ?, 
    price = ?, 
    item_category = ?, 
    item_id = ?
WHERE id = ?;
`;


export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable {

    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable) {
    }
    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
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
            conn.exec("BEGIN TRANSACTION")
            const item_id = await this.itemRepository.create(order.getItem())

            await conn.run(INSERT_ORDER, [
                order.getId(),
                order.getQuantity(),
                order.getPrice(),
                order.getItem().getCategory(),
                item_id
            ]);

            await conn.exec("COMMIT")
            return order.getId()
        } catch (error: unknown) {
            logger.error("Failed to create order", error as Error);
            conn && await conn.exec("ROLLBACK")
            throw new DbException("Failed to create order", error as Error);
        }
        //transaction
        //insert data into order table
        //insert data into 'item' table
        //commit
        //return order id
        //if error , log and rollback
    }
    async get(id: id): Promise<IIdentifiableOrderItem> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLOrder>(SELECT_ORDER, id);
            if (!result) {
                logger.error("Order of id %s not found", id);
                throw new Error("Order of id %s not found" + id);
            }
            const cake = await this.itemRepository.get(result.item_id);

            return new SQLOrderMapper().map({ data: result, item: cake });
        } catch (error) {
            logger.error("Failed to get order of id %s %o", id, error as Error);

            throw new DbException("Failed to get order of id " + id, error as Error);

        }
    }
    async getAll(): Promise<IIdentifiableOrderItem[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const items = await this.itemRepository.getAll();

            if (items.length === 0) {
                return [];
            }

            const orders = await conn.all<SQLOrder[]>(SELECT_ALL, items[0].getCategory());

            const bindOrders = orders.map((order) => {
                const item = items.find((item) => item.getId() === order.item_id);
                if (!item) {
                    throw new DbException("Item not found for order of id " + order.id, new Error("Item not found"));
                }
                return { order, item };
            });

            const mapper = new SQLOrderMapper();
            const identifiableOrders = bindOrders.map(({ order, item }) => {
                return mapper.map({ data: order, item });
            });
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
            conn.exec("BEGIN TRANSACTION")
            await this.itemRepository.update(item.getItem())



            await conn.run(UPDATE_ID,
                [item.getId(), item.getItem().getCategory(), item.getItem().getId(), item.getPrice(), item.getQuantity()]
            );

            await conn.exec("COMMIT")

        } catch (error: unknown) {
            logger.error("Failed to update order", error as Error);
            conn && await conn.exec("ROLLBACK")
            throw new DbException("Failed to update order", error as Error);
        }
    }
    async delete(id: id): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.exec("BEGIN TRANSACTION")
            const item_id = await this.itemRepository.delete(id)
            await conn.run(DELETE_ID,
                id
            );
            await conn.exec("COMMIT")

        } catch (error: unknown) {
            logger.error("Failed to delete order", error as Error);
            conn && await conn.exec("ROLLBACK")
            throw new DbException("Failed to delete order", error as Error);
        }
    }

}