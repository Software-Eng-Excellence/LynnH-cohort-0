import { ItemCategory } from "../models/IItem";
import { Initializable, IRepository } from "./IRepository";
import { IOrder } from "../models/IOrder";

import { CakeRepository } from "./sqlite/Cake.order.repository";
import { CakeOrderRepository } from "./file/Cake.order.repository";
import { OrderRepository } from "./sqlite/Order.repository";
import config from "../config/index";
import { PostgreSQLOrderRepository } from "./postgreSQL/Order.repository";
import { PostgreSQLCakeRepository } from "./postgreSQL/Cake.order.repository";
import { PostgreSQLClothingRepository } from "./postgreSQL/Clothing.order.repository";
import { PostgreSQLBookRepository } from "./postgreSQL/Book.order.repository";
import { PostgreSQLFurnitureRepository } from "./postgreSQL/Furniture.order.repository";
import { PostgreSQLPetRepository } from "./postgreSQL/Pet.order.repository";
import { PostgreSQLToyRepository } from "./postgreSQL/Toy.order.repository";


export enum DBMode {
    SQLITE,
    FILE,
    POSTGRESQL,
   
}

export class RepositoryFactory {

    public static async create(mode: DBMode, category: ItemCategory): Promise<IRepository<IOrder>> {
      
        switch (mode) {
            case DBMode.SQLITE: {
                let repository: IRepository<IOrder> & Initializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;
                    default:
                        throw new Error("Unsupported category");
                }
                await repository.init();
                return repository;
            }
            case DBMode.FILE:
                switch (category) {
                    case ItemCategory.CAKE:
                        return new CakeOrderRepository(config.storagePath.csv.cakeOrderPath);
                    default:
                        throw new Error("Unsupported category");
                }
            case DBMode.POSTGRESQL:
                let repository: IRepository<IOrder> & Initializable;
              
                switch (category) {
                    
                    case ItemCategory.CAKE:
                     
                        repository = new PostgreSQLOrderRepository(new PostgreSQLCakeRepository());
                    
                        break;
                    case ItemCategory.CLOTHING:
                       
                        repository = new PostgreSQLOrderRepository(new PostgreSQLClothingRepository());
                        break;
                    case ItemCategory.BOOK:
                        repository = new PostgreSQLOrderRepository(new PostgreSQLBookRepository());
                        break;
                    case ItemCategory.FURNITURE:
                        repository = new PostgreSQLOrderRepository(new PostgreSQLFurnitureRepository());
                        break;
                    case ItemCategory.PET:
                        repository = new PostgreSQLOrderRepository(new PostgreSQLPetRepository());
                        break;
                    case ItemCategory.TOY:
                        repository = new PostgreSQLOrderRepository(new PostgreSQLToyRepository());
                        break;
                    default:
                        throw new Error("Unsupported category");
                }
                await repository.init();
                return repository;
            default:
            
                throw new Error("Unsupported DB mode");
        }

    }
}