import dotenv from "dotenv";
import path from "path";



dotenv.config({ path: path.join(__dirname, '../../.env') })


export default {
    secret: process.env.SECRET || 'default secret',
    logDir: process.env.LOG_DIR || "./logs",
    isDev: process.env.NODE_ENV === 'development',
    cakeOrderPath: process.env.CAKE_ORDERS_PATH || "",
    bookOrderPath: process.env.BOOK_ORDERS_PATH || "",
    petOrdersPath: process.env.PET_ORDERS_PATH || "",
    furnitureOrdersPath: process.env.FURNITURE_ORDERS_PATH || "",
    toyOrdersPath: process.env.TOY_ORDERS_PATH || "",
}