export interface BackendResponse {
    services?:  ServiceSimple[] | ServiceExtensive[];
    service?: ServiceSimple | ServiceExtensive;
    instances?: string[];
    instance?: string;
    message?: string;
    success: boolean;
    error?: string;
}

export interface ServiceSimple {
    [identifier: string]: {
        name: string;
        description: string;
    }
}

export interface ServiceExtensive {
    [identifier: string]: {
        name: string;
        usage: string;
        disclaimer: string;
        description: string;
        commands: {
            [identifier: string]: {
                launcher: string;
                description?: string;
                allowMultipleInstances?: boolean;
                blockOtherCommands?: boolean | string | string[];
                blockOtherServices?: boolean | string | string[] | {
                    [identifier: string]: boolean | string | string[] | {
                        [identifier: string]: boolean | string | null;
                    }
                };
                instances?: {
                    [identifier: string]: null;
                };
            }
        };
    }
}
