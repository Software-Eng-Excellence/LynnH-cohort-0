import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/RepositoryException";
import { id, ID, IRepository } from "repository/IRepository";
import logger from "../../util/logger";
import { IOrder } from "../../models/IOrder";


export abstract class OrderRepository implements IRepository<IOrder> {

    protected abstract load(): Promise<IOrder[]>;
    protected abstract save(orders: IOrder[]): Promise<void>;

    async create(item: IOrder): Promise<id> {
        //validate the order
        if (!item) {
            throw new InvalidItemException("Order can't be null");
        }
        //load all orders 
        const orders = await this.load();
        //add the new order
        const id = orders.push(item)
        //save all orders
        await this.save(orders);
        logger.info("Successfully created order of id %d", id)
        return String(id);
    }
    async get(id: id): Promise<IOrder> {
        const orders = await this.load();
        const foundOrder = orders.find(o => o.getId() === id)
        if (!foundOrder) {
            logger.error("Failed to find order of id %s", id)
            throw new ItemNotFoundException("Failed to find the element");
        }
        return foundOrder;
    }
    async getAll(): Promise<IOrder[]> {
        return this.load();
    }
    async update(item: IOrder): Promise<void> {
        if (!item) {
            logger.error("IOrder can't be null")
            throw new InvalidItemException("IOrder can't be null");
        }
        const orders = await this.load();
        const index = orders.findIndex(o => o.getId() === item.getId())

        if (index === -1) {
            logger.error("Failed to find order of id %s", item.getId())
            throw new ItemNotFoundException("Failed to find the element")
        }
        orders[index] = item;
        await this.save(orders);

    }

    async delete(id: string): Promise<void> {
        const orders = await this.load();
        const index = orders.findIndex(o => o.getId() === id);
        if (index === -1) {
            logger.error("Failed to find order of id %s", id);
            throw new ItemNotFoundException("Failed to find the element");
        }
        orders.splice(index, 1);
        await this.save(orders);
        logger.info("Successfully deleted order of id %s", id);
    }

}