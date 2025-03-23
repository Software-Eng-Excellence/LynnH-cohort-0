import dotenv from "dotenv";
import path from "path";



dotenv.config({ path: path.join(__dirname, '../../.env') })


export default {
    secret: process.env.SECRET || 'default secret',
    logDir: process.env.LOG_DIR || "./logs",
    isDev: process.env.NODE_ENV === 'development',
    storagePath: {
        csv: {
            cakeOrderPath: process.env.CAKE_ORDERS_PATH || "",
            clothingOrdersPath: process.env.CLOTHING_ORDERS_PATH || ""
        },
        json: {
            bookOrderPath: process.env.BOOK_ORDERS_PATH || "",
            petOrdersPath: process.env.PET_ORDERS_PATH || "",
        },
        xml: {
            furnitureOrdersPath: process.env.FURNITURE_ORDERS_PATH || "",
            toyOrdersPath: process.env.TOY_ORDERS_PATH || "",
        },
        sqlite:
            "src/data/orders.sqlite.db",
        postgreSQL: "src/data/orders.postgresql.db"


    }





}