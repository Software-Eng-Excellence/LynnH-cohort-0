import { OrderRepository } from "./Order.repository";
import { readCSV } from "../../util/parsers/csvParser";
import { CSVOrderMapper } from "../../mappers/Order.mapper";
import { CSVCakeMapper } from "../../mappers/Cake.mapper";
import { IOrder } from "../../models/IOrder";
import { writeCSV } from "../../util/parsers/csvParser";
import { DbException } from "../../util/exceptions/RepositoryException";

export class CakeOrderRepository extends OrderRepository {
    constructor(private readonly filePath: string) {
        super();
    }
    protected async load(): Promise<IOrder[]> {
        try {

        } catch (error: unknown) {
            throw new DbException("Failed to load orders", error as Error)
        }
        //read 2D strings from file
        const csv = await readCSV(this.filePath)
        //convert string array into an object
        const mapper = new CSVOrderMapper(new CSVCakeMapper())
        //return list of objects
        return csv.map(mapper.map.bind(mapper))
    }
    protected async save(orders: IOrder[]): Promise<void> {
        try {
            const header = [
                "id", "Type", "Flavor", "Filling", "Size", "Layers",
                "Frosting Type", "Frosting Flavor", "Decoration Type",
                "Decoration Color", "Custom Message", "Shape", "Allergies",
                "Special Ingredients", "Packaging Type", "Price", "Quantity"
            ];
            const mapper = new CSVOrderMapper(new CSVCakeMapper());
            const rawOrders = orders.map(o => mapper.reverseMap(o));
            await writeCSV(this.filePath, [header, ...rawOrders]);
        } catch (error) {
            throw new DbException("Failed to save orders", error as Error)
        }

    }

}


