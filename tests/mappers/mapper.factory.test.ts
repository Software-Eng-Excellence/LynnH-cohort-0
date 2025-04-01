import { JSONBookMapper, PostgreSQLBookMapper } from "../../src/mappers/Book.mapper";
import { CSVCakeMapper, SQLiteCakeMapper } from "../../src/mappers/Cake.mapper";
import { CSVClothingMapper, PostgreSQLClothingMapper } from "../../src/mappers/Clothing.mapper";
import { PostgreSQLFurnitureMapper, XMLFurnitureMapper } from "../../src/mappers/furniture.mapper";
import { DataSourceType, MapperFactory } from "../../src/mappers/MapperFactory";
import { JSONPetMapper, PostgreSQLPetMapper } from "../../src/mappers/pet.mapper";
import { PostgreSQLToyMapper, XMLToyMapper } from "../../src/mappers/toy.mapper";
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
  it('should return PostgreSQLPetMapper for DataSourceType.POSTGRESQL and ItemCategory.PET', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.PET);
    expect(mapper).toBeInstanceOf(PostgreSQLPetMapper);
  });

  it('should return PostgreSQLToyMapper for DataSourceType.POSTGRESQL and ItemCategory.TOY', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.TOY);
    expect(mapper).toBeInstanceOf(PostgreSQLToyMapper);
  });

  it('should return PostgreSQLClothingMapper for DataSourceType.POSTGRESQL and ItemCategory.CLOTHING', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.CLOTHING);
    expect(mapper).toBeInstanceOf(PostgreSQLClothingMapper);
  });

  it('should return PostgreSQLBookMapper for DataSourceType.POSTGRESQL and ItemCategory.BOOK', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.BOOK);
    expect(mapper).toBeInstanceOf(PostgreSQLBookMapper);
  });

  it('should return PostgreSQLFurnitureMapper for DataSourceType.POSTGRESQL and ItemCategory.FURNITURE', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.FURNITURE);
    expect(mapper).toBeInstanceOf(PostgreSQLFurnitureMapper);
  });

  it('should return SQLiteCakeMapper for DataSourceType.POSTGRESQL and ItemCategory.CAKE', () => {
    const mapper = MapperFactory.create(DataSourceType.POSTGRESQL, ItemCategory.CAKE);
    expect(mapper).toBeInstanceOf(SQLiteCakeMapper);
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
