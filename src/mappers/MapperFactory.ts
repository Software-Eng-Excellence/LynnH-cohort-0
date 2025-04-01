import { ItemCategory } from "../models/IItem";
import { IMapper } from "../mappers/IMaper";
import { JSONPetMapper, PostgreSQLPet, PostgreSQLPetMapper } from "./pet.mapper";
import { PostgreSQLToy, PostgreSQLToyMapper, XMLToyMapper } from "./toy.mapper";
import { CSVClothingMapper, PostgreSQLClothing, PostgreSQLClothingMapper } from "./Clothing.mapper";
import { CSVCakeMapper, SQLiteCake, SQLiteCakeMapper } from "./Cake.mapper";
import { PostgreSQLFurniture, PostgreSQLFurnitureMapper, XMLFurnitureMapper } from "./furniture.mapper";
import { JSONBookMapper, PostgreSQLBook, PostgreSQLBookMapper } from "./Book.mapper";
import { IdentifiablePet } from "../models/Pet.models";
import { IIdentifiableCake } from "../models/Cake.models";
import { IdentifiableFurniture } from "../models/Furniture.models";
import { IdentifiableBook } from "../models/Book.models";
import { IdentifiableClothing } from "../models/Clothing.models";
import { IdentifiableToy } from "../models/Toy.models";

export enum DataSourceType {
    FILE,
    POSTGRESQL
}

export class MapperFactory {
    public static create<T, U>(dataSource: DataSourceType, category: ItemCategory): IMapper<T, U> {
        switch (dataSource) {

            case DataSourceType.FILE:
                switch (category) {
                    case ItemCategory.CAKE:
                        return new CSVCakeMapper() as IMapper<T, U>;
                    case ItemCategory.PET:
                        return new JSONPetMapper() as IMapper<T, U>;
                    case ItemCategory.BOOK:
                        return new JSONBookMapper() as IMapper<T, U>;
                    case ItemCategory.FURNITURE:
                        return new XMLFurnitureMapper() as IMapper<T, U>;
                    case ItemCategory.TOY:
                        return new XMLToyMapper() as IMapper<T, U>;
                    case ItemCategory.CLOTHING:
                        return new CSVClothingMapper() as IMapper<T, U>;
                    default:
                        throw new Error("Unsupported category for File storage");
                }
            case DataSourceType.POSTGRESQL: {
                let mapper: IMapper<T, U>;
                switch (category) {
                    case ItemCategory.PET:
                        return new PostgreSQLPetMapper() as IMapper<PostgreSQLPet, IdentifiablePet> as IMapper<T, U>;
                    case ItemCategory.TOY:
                        return new PostgreSQLToyMapper() as IMapper<PostgreSQLToy, IdentifiableToy> as IMapper<T, U>;
                    case ItemCategory.CLOTHING:
                        return new PostgreSQLClothingMapper() as IMapper<PostgreSQLClothing, IdentifiableClothing> as IMapper<T, U>;
                    case ItemCategory.BOOK:
                        return new PostgreSQLBookMapper() as IMapper<PostgreSQLBook, IdentifiableBook> as IMapper<T, U>;
                    case ItemCategory.FURNITURE:
                        return new PostgreSQLFurnitureMapper() as IMapper<PostgreSQLFurniture, IdentifiableFurniture> as IMapper<T, U>;
                    case ItemCategory.CAKE:
                        return new SQLiteCakeMapper() as IMapper<SQLiteCake, IIdentifiableCake> as IMapper<T, U>;
                    default:
                        throw new Error("Unsupported category for PostgreSQL");
                }
                return mapper;
            }
            default:
                console.log("Unsupported data source type:", dataSource); 
                throw new Error("Unsupported Data Source Type");
        }
    }
}
