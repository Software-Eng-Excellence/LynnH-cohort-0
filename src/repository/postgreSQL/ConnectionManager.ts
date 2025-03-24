import { Client } from "pg";
import logger from "../../util/logger";
import { DatabaseConnectionException } from "../../util/exceptions/DataBaseConnection";
import config from "../../config/index";



export class ConnectionManager {
    private static client: Client | null = null;

    private constructor() {}

    public static async getConnection(): Promise<Client> {
        if (this.client === null) {
            try {
               
                this.client = new Client({
                    user: config.dbConnection.dbUser,
                    host: config.dbConnection.dbHost,
                    database: config.dbConnection.dbDatabase,
                    password: config.dbConnection.dbPassword,
                    port: config.dbConnection.dbPort,
                    ssl: { rejectUnauthorized: false }
                });

                await this.client.connect();
                logger.info("Successfully connected to PostgreSQL database");
            } catch (error: unknown) {
                logger.error("Failed to connect to PostgreSQL database", error as Error);
                throw new DatabaseConnectionException("Failed to connect to database", error as Error);
            }
        }
        return this.client;
    }

    
}
