import logger from "./util/logger";

//ensure type safety by using interface for Order
export interface Order {
    id: number,
    price: number,
    item: string
}

interface ICalculator {
    getRevenue(orders: Order[]): number;
    getAverageBuyPower(orders: Order[]): number;
}

//Class OrderManagement for get orders , add order and get order by id 
//high-level module
export class OrderManagement {
    private orders: Order[] = [];
    //it means each order should pass through validation before adding it to the orders
    constructor(private validator: IValidator, private calculator: ICalculator) {
        logger.debug("OrderManagement created")
    }
    getOrders() {
        return this.orders;
    }
    addOrder(price: number, item: string) {
        try {
            const order: Order = { id: this.orders.length + 1, price: price, item: item }
            //low-level module
            //here hight-level module depends on the low-level module DSP it shouldn't depend on the low-level module

            //new Validator().validate(order)
            //instead use constructor to get the validator DIP
            this.validator.validate(order);
            this.orders.push(order);
        } catch (e) {
            //throw new Error('Order is not valid' + e.message);
        }

    }
    getOrder(id: number) {
        const order = this.orders.find(order => order.id === id);
        if (!order) {
            logger.warn(`Order with ID ${id} not found`);
        }
        //this.orders so get getOrders , in case we change it , it will be changed here too
        return order;
    }
    getTotalRevenue() {
        //return FinancialCalculator.getRevenue(this.orders);
        //instead use the constructor to get the calculator DIP
        return this.calculator.getRevenue(this.orders);
    }
    getTotalAvarageBuyPower() {
        //return FinancialCalculator.getAverageBuyPower(this.orders);
        //instead use the constructor to get the calculator DIP
        return this.calculator.getAverageBuyPower(this.orders);
    }
}
export class PremiumOrderManagment extends OrderManagement {
    getOrder(id: number): Order | undefined {
        console.log("ALert premium order being fetched!");
        return super.getOrder(id);
    }
    private discountRate = 0.1; // 10% discount for premium users
    //another example for LSP
    addOrder(price: number, item: string): Order | void {
        const discountedPrice = price - price * this.discountRate;
        console.log(`🎉 Applying premium discount: Original: $${price}, Discounted: $${discountedPrice}`);
        return super.addOrder(discountedPrice, item);
    }
}

//Ensure that any class that implements IValidator has a validate method
interface IValidator {
    validate(order: Order): void
}

//ItemValidator class to validate the item
export class ItemValidator implements IValidator {
    private static possibleItems = [
        "Sponge",
        "Chocolate",
        "Fruit",
        "Red Velvet",
        "Birthday",
        "Carrot",
        "Marble",
        "Coffee",
    ];
    validate(order: Order) {
        if (!ItemValidator.possibleItems.includes(order.item)) {
            logger.error(`Invalid item ${order.item}`)
            throw new Error(`Invalid item. Must be one of: ${ItemValidator.possibleItems.join(", ")}`);
        }
    }
}
//PriceValidator class to validate the price
export class PriceValidator implements IValidator {
    validate(order: Order) {
        if (order.price <= 0) {
            logger.error(`Invalid price ${order.price}`)
            throw new Error("Price must be greater than 0");
        }
    }
}
//MaxPriceValidator class to validate the max price
export class MaxPriceValidator implements IValidator {
    validate(order: Order) {
        if (order.price > 100) {
            throw new Error("Price must be less than 100")
        }
    }
}

//Validator class to validate the order
export class Validator implements IValidator {
    //to apply DIP 
    // private static rules: IValidator[] = [
    //     new ItemValidator(),
    //     new PriceValidator(),
    //     new MaxPriceValidator()
    // ]
    constructor(private rules: IValidator[]) {

    }
    validate(order: Order): void {
        for (const rule of this.rules) {
            rule.validate(order);
        }
    }
}

export class FinancialCalculator implements ICalculator {

    //getting revenue by adding all the prices
    public getRevenue(orders: Order[]) {
        return orders.reduce((total, order) => total + order.price, 0);
    }
    //getting average buy power by dividing the revenue by the number of orders
    public getAverageBuyPower(orders: Order[]) {
        return orders.length === 0 ? 0 : this.getRevenue(orders) / orders.length;
    }
}

