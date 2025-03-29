import { FurnitureRepository } from "../../src/repository/postgreSQL/Furniture.order.repository";
import { ConnectionManager } from "../../src/repository/postgreSQL/ConnectionManager";
import { IdentifiableFurniture } from "../../src/models/Furniture.models";
import { DbException, InitializationException } from "../../src/util/exceptions/RepositoryException";
import { Client } from "pg";
import logger from "../../src/util/logger";

jest.mock("../../src/repository/postgreSQL/ConnectionManager");

// Create a mock database client
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

// Create a mock furniture object
const mockFurniture: IdentifiableFurniture = new IdentifiableFurniture(
    "furniture-123",  // id
    "Table",          // type
    "Wood",           // material
    "Brown",          // color
    "Medium",         // size
    "Modern",         // style
    true,             // assemblyRequired
    "5 Years"         // warranty
);

describe("FurnitureRepository", () => {
    let repository: FurnitureRepository;

    beforeEach(() => {
        repository = new FurnitureRepository();
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize the furniture table successfully and log the message", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => logger);
            await expect(repository.init()).resolves.not.toThrow();
            expect(infoSpy).toHaveBeenCalledWith("Furniture Table initialized");
            infoSpy.mockRestore();
        });

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.init()).rejects.toThrow(InitializationException);
        });
    });

    describe("Create Operation", () => {
        it("should create a new furniture entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.create(mockFurniture)).resolves.toEqual("furniture-123");
        });
    });

    describe("Read Operations", () => {
        it("should retrieve a furniture item by ID successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockFurniture] });
            await expect(repository.get("furniture-123")).resolves.toEqual(expect.any(Object));
        });

        it("should throw DbException if furniture ID is not found", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.get("99")).rejects.toThrow(DbException);
        });

        it("should retrieve all furniture items successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockFurniture, mockFurniture] });
            await expect(repository.getAll()).resolves.toHaveLength(2);
        });

        it("should return an empty array when no furniture items exist", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.getAll()).resolves.toEqual([]);
        });
    });

    describe("Update Operation", () => {
        it("should update a furniture entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.update(mockFurniture)).resolves.not.toThrow();
        });
    });

    describe("Delete Operation", () => {
        it("should delete a furniture entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.delete("furniture-123")).resolves.not.toThrow();
        });

        it("should throw DbException if delete fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
            await expect(repository.delete("furniture-123")).rejects.toThrow(DbException);
        });
    });
});
