import type { ServiceSimple } from '$lib/types/backend'

export interface TensordockDetails {
    type: string;
    id: string;
    name: string;
    status: string;
    ipAddress: string;
    portForwards: [
        {
            internal_port: number,
            external_port: number
        }
    ]
    services?: ServiceSimple[];
}

/*
export interface TensordockDetails {
    name: string;
    cost: number;
    city: string;
    state: string;
    country: string;
    hostname: string;
    hostnode: string;
    location: string;
    ip_address: string;
    default_user: string;
    services?: ServiceSimple[];
    timestamp_creation: string;
    operating_system: string;
    cpu_threadscount: number;
    compute_price: number;
    storage_price: number;
    total_price: number;
    status: string;
    type: string;
    specs: {
        gpu: {
            amount: number;
            type: string;
        };
        ram: number;
        storage: number;
        vcpus: number;
    };
    deployment: {
        status: string;
        timestamp_failure: string | null;
        timestamp_completion: string | null;
    };
    dedicated_ip_address: string | null;
    port_forwards: [
        {
            internal_port: number,
            external_port: number
        }
    ]
};

export function findPortByDestination(port_forwards: { [port: number]: string }, searchValue: string): number | undefined {
    const entry = Object.entries(port_forwards).find(([_, destination]) => destination.includes(searchValue));
    return entry ? Number(entry[0]) : undefined;
}
*/