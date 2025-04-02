import { JSONBookMapper, SQLBookMapper } from "../../src/mappers/Book.mapper";
import { CSVCakeMapper, SQLCakeMapper } from "../../src/mappers/Cake.mapper";
import { CSVClothingMapper, SQLClothingMapper } from "../../src/mappers/Clothing.mapper";
import { SQLFurnitureMapper, XMLFurnitureMapper } from "../../src/mappers/furniture.mapper";
import { DataSourceType, MapperFactory } from "../../src/mappers/MapperFactory";
import { JSONPetMapper, SQLPetMapper } from "../../src/mappers/pet.mapper";
import { SQLToyMapper, XMLToyMapper } from "../../src/mappers/toy.mapper";
import { ItemCategory } from "../../src/models/IItem";

describe('MapperFactory - FILE DataSource', () => {
  it('should return CSVCakeMapper for DataSourceType.FILE and ItemCategory.CAKE', () => {
    const mapper = MapperFactory.create(DataSourceType.FILE, ItemCategory.CAKE);
    expect(mapper).toBeInstanceOf(CSVCakeMapper);
  });

  it('should return JSONPetMapper for DataSourceType.FILE and ItemCategory.PET', () => {
    const mapper = MapperFactory.create(DataSourceType.FILE, ItemCategory.PET);
    expect(mapper).toBeInstanceOf(JSONPetMapper);
  });

  it('should return JSONBookMapper for DataSourceType.FILE and ItemCategory.BOOK', () => {
    const mapper = MapperFactory.create(DataSourceType.FILE, ItemCategory.BOOK);
    expect(mapper).toBeInstanceOf(JSONBookMapper);
  });

  it('should return XMLFurnitureMapper for DataSourceType.FILE and ItemCategory.FURNITURE', () => {
    const mapper = MapperFactory.create(DataSourceType.FILE, ItemCategory.FURNITURE);
    expect(mapper).toBeInstanceOf(XMLFurnitureMapper);
  });

  it('should return XMLToyMapper for DataSourceType.FILE and ItemCategory.TOY', () => {
    const mapper = MapperFactory.create(DataSourceType.FILE, ItemCategory.TOY);
    expect(mapper).toBeInstanceOf(XMLToyMapper);
  });

  it('should return CSVClothingMapper for DataSourceType.FILE and ItemCategory.CLOTHING', () => {
    const mapper = MapperFactory.create(DataSourceType.FILE, ItemCategory.CLOTHING);
    expect(mapper).toBeInstanceOf(CSVClothingMapper);
  });

  it('should throw an error for an unsupported category with FILE data source', () => {
    expect(() => MapperFactory.create(DataSourceType.FILE,ItemCategory.Test)).toThrow(
      'Unsupported category for File storage'
    );
  });
});

describe('MapperFactory - POSTGRESQL DataSource', () => {
  it('should return SQLPetMapper for DataSourceType.POSTGRESQL and ItemCategory.PET', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.PET);
    expect(mapper).toBeInstanceOf(SQLPetMapper);
  });

  it('should return SQLToyMapper for DataSourceType.POSTGRESQL and ItemCategory.TOY', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.TOY);
    expect(mapper).toBeInstanceOf(SQLToyMapper);
  });

  it('should return SQLClothingMapper for DataSourceType.POSTGRESQL and ItemCategory.CLOTHING', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.CLOTHING);
    expect(mapper).toBeInstanceOf(SQLClothingMapper);
  });

  it('should return SQLBookMapper for DataSourceType.POSTGRESQL and ItemCategory.BOOK', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.BOOK);
    expect(mapper).toBeInstanceOf(SQLBookMapper);
  });

  it('should return SQLFurnitureMapper for DataSourceType.POSTGRESQL and ItemCategory.FURNITURE', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.FURNITURE);
    expect(mapper).toBeInstanceOf(SQLFurnitureMapper);
  });

  it('should return SQLCakeMapper for DataSourceType.POSTGRESQL and ItemCategory.CAKE', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.CAKE);
    expect(mapper).toBeInstanceOf(SQLCakeMapper);
  });

  it('should throw an error for an unsupported category with POSTGRESQL data source', () => {
    expect(() => MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.Test)).toThrow(
      'Unsupported category for PostgreSQL'
    );
  });
});

describe('MapperFactory - Invalid DataSourceType', () => {
  it('should throw an error for an unsupported data source type', () => {
    expect(() => MapperFactory.create(-1 as DataSourceType, ItemCategory.CAKE)).toThrow(
      'Unsupported Data Source Type'
    );
  });
});
