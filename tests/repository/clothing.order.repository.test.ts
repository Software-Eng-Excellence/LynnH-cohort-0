import { ClothingRepository } from "../../src/repository/postgreSQL/Clothing.order.repository";
import { ConnectionManager } from "../../src/repository/postgreSQL/ConnectionManager";
import { IdentifiableClothing } from "../../src/models/Clothing.models";
import { DbException, InitializationException, ItemNotFoundException } from "../../src/util/exceptions/RepositoryException";
import { Client } from "pg";
import logger from "../../src/util/logger";

jest.mock("../../src/repository/postgreSQL/ConnectionManager");

// Mock database client
const mockDb = {
    query: jest.fn(),
    end: jest.fn(),
    connect: jest.fn(),
    release: jest.fn(),
    port: 5432,
    host: "localhost",
    ssl: false,
    user: "test_user",
    database: "test_db",
    password: "test_password",
} as unknown as Client;

ConnectionManager.getConnection = jest.fn(() => Promise.resolve(mockDb));

const mockClothing: IdentifiableClothing = new IdentifiableClothing(
    "clothing-123",  // id
    "T-Shirt",       // type
    "M",             // size
    "Blue",          // color
    "Cotton",        // material
    "Striped",       // pattern
    "Nike",          // brand
    "Unisex",        // gender
    "Box",           // packaging
    "Gift wrap"      // specialRequest
);

describe("ClothingRepository", () => {
    let repository: ClothingRepository;

    beforeEach(() => {
        repository = new ClothingRepository();
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize the clothing table successfully and log the message", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => logger);

            await expect(repository.init()).resolves.not.toThrow();
            expect(infoSpy).toHaveBeenCalledWith("Clothing table initialized");

            infoSpy.mockRestore();
        });

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.init()).rejects.toThrow(InitializationException);
        });
    });

    describe("Create Operation", () => {
        it("should create a new clothing order successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.create(mockClothing)).resolves.toEqual("clothing-123");
        });

        it("should throw DbException if database insert fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Insert Error"));
            await expect(repository.create(mockClothing)).rejects.toThrow(DbException);
        });
    });

    describe("Read Operations", () => {
        it("should retrieve a clothing item by ID successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockClothing] });
            await expect(repository.get("clothing-123")).resolves.toEqual(expect.any(Object));
        });

        it("should throw DbException if clothing ID is not found", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.get("99")).rejects.toThrow(DbException);
        });

        it("should retrieve all clothing items successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockClothing, mockClothing] });
            await expect(repository.getAll()).resolves.toHaveLength(2);
        });

        it("should return an empty array when no clothing items exist", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.getAll()).resolves.toEqual([]);
        });

        it("should throw DbException if getAll query fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.getAll()).rejects.toThrow(DbException);
        });
    });

    describe("Update Operation", () => {
        it("should update a clothing order successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.update(mockClothing)).resolves.not.toThrow();
        });

    });

    describe("Delete Operation", () => {
        it("should delete a clothing order successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.delete("clothing-123")).resolves.not.toThrow();
        });

        it("should throw DbException if delete fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
            await expect(repository.delete("1")).rejects.toThrow(DbException);
        });
    });
});
