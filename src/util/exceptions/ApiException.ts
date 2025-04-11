export class ApiException extends Error {
    public status: number;
    constructor( status: number, message: string, error: Error) {
       
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.message =  `${message} - ${error.message}`;
    }
}