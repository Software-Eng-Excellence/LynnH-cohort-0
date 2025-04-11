import { ServiceException } from "../util/exceptions/ServiceException";
import { DBMode, RepositoryFactory } from "../repository/RepositoryFactory";
import config from "../config/index";
import { IIdentifiableOrderItem } from "../models/IOrder";
import { ItemCategory } from "../models/IItem";
import { IRepository } from "../repository/IRepository";

export class OrderManagmentService {
    //create an order


    public async createOrder(order: IIdentifiableOrderItem): Promise<IIdentifiableOrderItem> {
        //validation
        this.validateOrder(order);
        //persist new order
        const repo = await this.getRepo(order.getItem().getCategory());
        repo.create(order);
        return order;

    }
    //get order
    public async getOrder(orderId: string): Promise<IIdentifiableOrderItem> {
        const categories = Object.values(ItemCategory);
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const order = await repo.get(orderId);
            if (order) {
                return order;
            }
        }
        throw new ServiceException(`Order with id ${orderId} not found`);

    }
    //update order
    public async updateOrder(orderId: string, order: IIdentifiableOrderItem): Promise<void> {
        this.validateOrder(order);
        //persist new order
        const repo = await this.getRepo(order.getItem().getCategory());
        repo.update(order);

    }
    //delete order
    public async deleteOrder(orderId: string): Promise<void> {
        const categories = Object.values(ItemCategory);
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const order = await repo.get(orderId);
            if (order) {
                await repo.delete(orderId);
                return;
            }
        }
        throw new ServiceException(`Order with id ${orderId} not found`);

    }
    //get all orders
    public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
        const categories = Object.values(ItemCategory);
        let orders: IIdentifiableOrderItem[] = [];
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const order = await repo.getAll();
            orders = [...orders, ...order];
        }
        return orders;
    }

    //get total revenue
    public async getTotalRevenue(): Promise<number> {
        const orders= await this.getAllOrders();
        const revenues = orders.map(order => order.getPrice() * order.getQuantity());
        return revenues.reduce((acc, revenue) => acc + revenue, 0);

    }
    //get total order
    public async getTotalOrders(): Promise<number> {
        const orders = await this.getAllOrders();
        return orders.length;
    }

    //get volumne analytics
    public async getOrderVolumeAnalytics(): Promise<{
        totalOrderCount: number;
        orderCountsByItemType: Record<string, number>;
    }> {
        const orders = await this.getAllOrders();
    
        // Calculate total order count
        const totalOrderCount = orders.length;
    
        // Group order counts by item type
        const orderCountsByItemType: Record<string, number> = {};
        for (const order of orders) {
            const itemType = order.getItem().getCategory();
            orderCountsByItemType[itemType] = (orderCountsByItemType[itemType] || 0) + 1;
        }
    
        return { totalOrderCount, orderCountsByItemType };
    }

    // Revenue Analytics
public async getRevenueAnalytics(): Promise<{
    totalRevenue: number;
    revenueByItemType: Record<string, number>;
}> {
    const orders = await this.getAllOrders();

    // Calculate total revenue
    const totalRevenue = orders.reduce(
        (acc, order) => acc + order.getPrice() * order.getQuantity(),
        0
    );

    // Compute revenue breakdown by item type
    const revenueByItemType: Record<string, number> = {};
    for (const order of orders) {
        const itemType = order.getItem().getCategory();
        const orderRevenue = order.getPrice() * order.getQuantity();
        revenueByItemType[itemType] = (revenueByItemType[itemType] || 0) + orderRevenue;
    }

    return { totalRevenue, revenueByItemType };
}

    private async getRepo(category: ItemCategory): Promise<IRepository<IIdentifiableOrderItem>> {
        return RepositoryFactory.create(config.dbMode, category);
    }
    private validateOrder(order: IIdentifiableOrderItem): void {
        if (!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
            throw new ServiceException("Invalid order: item, price, and quantity must be valid.");
        }
    }
}