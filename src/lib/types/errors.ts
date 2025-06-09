export class ServiceError extends Error {
    public status: number = -999999;
    public message: string = "null";
    public session: string = "null";
    
    constructor(message: string, session: string, status: number) {
        super(message);
        this.status = status;
        this.message = message;
        this.session = session;
        this.name = "ServiceError";
    }
}