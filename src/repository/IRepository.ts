
export type id=string;
export interface ID {
    getId(): id;
}
//T extends ID this means it contain ID
//so in case of create{id:-1} => {id:200} then we have to re-create.
//in case of update item contains already the id 

/**
 * Interface representing a repository for managing items of type T.
 * 
 * @template T - The type of items managed by the repository, which extends ID.
 */
export interface IRepository<T extends ID> {
    /**
     * Create a new item in the repository.
     * 
     * @param item - The item to be created.
     * @returns A promise that resolves to the ID of the created item.
     * @throws {InvalidItemException} - Thrown when an invalid item is encountered.
     */
    create(item: T): Promise<id>;

    /**
     * Retrieve an item from the repository by its ID.
     * 
     * @param id - The ID of the item to be retrieved.
     * @returns A promise that resolves to the item with the specified ID.
     */
    get(id: id): Promise<T>;

    /**
     * Retrieve all items from the repository.
     * 
     * @returns A promise that resolves to an array of all items in the repository.
     */
    getAll(): Promise<T[]>;

    /**
     * Update an existing item in the repository.
     * 
     * @param item - The item to be updated.
     * @returns A promise that resolves when the update is complete.
     * @throws {ItemNotFoundException} - Thrown when the item to be updated is not found.
     * @throws {InvalidItemException} - Thrown when an invalid item is encountered.
     */
    update(item: T): Promise<void>;

    /**
     * Delete an item from the repository by its ID.
     * 
     * @param id - The ID of the item to be deleted.
     * @returns A promise that resolves when the deletion is complete.
     * @throws {ItemNotFoundException} - Thrown when the item to be deleted is not found.
     */
    delete(id: id): Promise<void>;
}
 