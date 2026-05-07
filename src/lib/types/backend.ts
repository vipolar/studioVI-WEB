export interface BackendResponse {
    model?: ModelSimple | ModelExtensive;
    models?:  ModelSimple[] | ModelExtensive[];
    service?: ServiceSimple | ServiceExtensive;
    services?:  ServiceSimple[] | ServiceExtensive[];
    utility?: UtilitySimple | UtilityExtensive;
    utilities?:  UtilitySimple[] | UtilityExtensive[];
    instances?: string[];
    instance?: string;
    message?: string;
    success: boolean;
    error?: string;
}

export interface ModelSimple {
    [identifier: string]: {
        name: string;
        description: string;
    }
}

export interface ServiceSimple {
    [identifier: string]: {
        name: string;
        description: string;
    }
}

export interface UtilitySimple {
    [identifier: string]: {
        name: string;
        description: string;
    }
}

export interface ModelExtensive {
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

export interface UtilityExtensive {
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