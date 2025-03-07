import config from "./config";
import { FinancialCalculator, ItemValidator, MaxPriceValidator, OrderManagement, PriceValidator, Validator } from "./app";
import logger from "./util/logger";

import parseCSV from "./util/parser";

const {filePath}=config
const orders = [
    { id: 1, item: "Sponge", price: 15 },
    { id: 2, item: "Chocolate", price: 20 },
    { id: 3, item: "Fruit", price: 18 },
    { id: 4, item: "Red Velvet", price: 25 },
    { id: 5, item: "Coffee", price: 8 },
];

//or in app-clean we can create a class that contains rules
const rules = [
    new ItemValidator(),
    new PriceValidator(),
    new MaxPriceValidator()
]
// const orderManagment = new PremiumOrderManagment();
//or 
const orderManagment = new OrderManagement(new Validator(rules), new FinancialCalculator());
for (const order of orders) {
    orderManagment.addOrder(order.price, order.item);
}

const newItem = "Carrot";
const newPrice = -180;

orderManagment.addOrder(newPrice, newItem);


// logger.info("Orders after adding a new order:"+ orderManagment.getOrders());


// logger.info("Total Revenue:" + orderManagment.getTotalRevenue());

// Calculate Average Buy Power directly

// logger.info("Average Buy Power:"+ orderManagment.getTotalAvarageBuyPower());

//  Fetching an order directly
const fetchId = 2;
// logger.info("Order with ID 2: %o", orderManagment.getOrder(fetchId));

// Attempt to fetch a non-existent order
const nonExistentId = 10;
// logger.info("Order with ID 10 (non-existent):"+ orderManagment.getOrder(nonExistentId));


// Fetching all orders

async function fetchOrders() {
    const orders = await parseCSV(filePath);
    //for each data log the row
    orders.forEach((order) => logger.info(order));
    
}

fetchOrders()