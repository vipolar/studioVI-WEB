import { instancesCookiePath, instancesCookieSuffix } from '$lib/cookies/constants';
import { ServiceError } from '$lib/types/errors';
import type { RequestHandler } from './$types';
import { isValidUUID } from '$lib/types/uuid';
import { produce } from 'sveltekit-sse'
import { json } from '@sveltejs/kit';

const activeReaders = new Map<string, ReadableStreamDefaultReader<Uint8Array>>();
const bufferedMessages = new Map<string, string[]>();
const bufferedError = new Map<string, Error>();

export const GET: RequestHandler = async ({ url, params, cookies }) =>  {
    const service = url.searchParams.get('service') || undefined;
    const cookieName = `${service}${instancesCookieSuffix}`;
    const instancesCookie = cookies.get(cookieName);
    params.service;
    params.command;
    params.instance

    let activeInstances: string[] = [];

    try {
        if (instancesCookie) {
            activeInstances = JSON.parse(instancesCookie);
            
            if (!Array.isArray(activeInstances) || !activeInstances.every(uuid => typeof uuid === "string")) {
                activeInstances = [];
            }
        }
    } catch (error) {
        console.error(error);
    }

    cookies.set(cookieName, JSON.stringify(activeInstances), {
        secure: true,    
        httpOnly: true,  
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: instancesCookiePath
    });

    return json(activeInstances);
}

export const POST: RequestHandler = async ({ url, params, cookies }) => {
    const flaskUrl = `http://localhost:5000/services/stream/${params.service}/${params.command}/${params.instance}`;
    const instancesCookieFile = `${params.service}_${params.command}_${instancesCookieSuffix}`;
    let reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>> | undefined;
    let instancesCookie: string | undefined;
    let textBuffer: string[] | undefined;
    let textDecoder = new TextDecoder();
    let activeInstances: string[] = [];
    let newSSEStream: boolean = false;

    try {
        if ((instancesCookie = cookies.get(instancesCookieFile)) != undefined) {
            activeInstances = JSON.parse(instancesCookie);
            
            if (!Array.isArray(activeInstances) || !activeInstances.every(uuid => typeof uuid === "string")) {
                activeInstances = [];
            }

            if (!activeInstances.includes(params.instance)) {
                activeInstances.push(params.instance);
                newSSEStream = true;
            }
        }
    } catch (error) {
        console.error(error);
    }
    
    cookies.set(instancesCookieFile, JSON.stringify(activeInstances), {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: instancesCookiePath
    });

    return produce(async function start({ emit, lock }) {
        try {
            if ((reader = activeReaders.get(params.instance)) != undefined) {
                emit('log', `${params.instance}: Reconnecting to SSE stream...`);

                if ((textBuffer = bufferedMessages.get(params.instance)) != undefined) {
                    emit('log', `${params.instance}: SSE stream buffer detected. Reading messages from the buffer...`);
                    while (textBuffer.length > 0) {
                        const { error } = emit('message', textBuffer[0]);
                        if (error) {
                            throw new Error(`${params.instance}: Failed to emit buffered SSE stream message to client: ${error.message}`);
                        }
                        textBuffer.shift();
                    }

                    emit('log', `${params.instance}: SSE stream buffer exhausted. Destroying SSE stream buffer...`);
                    bufferedMessages.delete(params.instance);
                }
            } else {
                emit('log', `${params.instance}: Connecting to SSE stream...`);
                const response = await fetch(flaskUrl);

                if (!response.ok || !response.body) {
                    throw new Error(`${params.instance}: Failed to connect to SSE stream. Server response status code: ${response.status}`);
                }

                reader = response.body.getReader();
                activeReaders.set(params.instance, reader);
                emit('log', `${params.instance}: New instance created successfully!`);
            }

            while (true) {
                const { value, done } = await reader.read();

                if (done) {
                    lock.set(false);
                    activeReaders.delete(params.instance);
                    break;
                }

                const currentMessage = textDecoder.decode(value);
                const { error } = emit('message', currentMessage);
                if (error) {
                    if (!bufferedMessages.has(params.instance)) {
                        bufferedMessages.set(params.instance, [currentMessage]);
                    } else {
                        bufferedMessages.get(params.instance)?.push(currentMessage);
                    }

                    throw new Error(`${params.instance}: Failed to emit SSE message to client: ${error.message}`);
                }
            }
        } catch (e) {
            let error: Error;
            if (!(e instanceof Error)) {
                error = new Error(String(e));
            } else {
                error = e;
            }

            bufferedError.set(params.instance, error);
            emit('error', JSON.stringify(error));
            console.error(error);
            lock.set(false);
        }
    })
};

export const DELETE: RequestHandler = async ({ url, params, cookies }) => {
    const flaskUrl = `http://localhost:5000/services/interrupt/${params.service}/${params.command}/${params.instance}`;
    const instancesCookieFile = `${params.service}_${params.command}_${instancesCookieSuffix}`;
    const terminate = url.searchParams.get('terminate') || undefined;
    let instancesCookie: string | undefined;
    let activeInstances: string[] = [];

    try {
        if ((instancesCookie = cookies.get(instancesCookieFile)) != undefined) {
            activeInstances = JSON.parse(instancesCookie);
            
            if (!Array.isArray(activeInstances) || !activeInstances.every(uuid => typeof uuid === "string")) {
                activeInstances = [];
            }
        }
    } catch (error) {
        console.error(error);
    }

    /* TODO: do the termination check and if necessary terminate on the backend! */
    activeInstances = activeInstances.filter(instance => instance !== params.instance);
    cookies.set(instancesCookieFile, JSON.stringify(activeInstances), {
        secure: true,    
        httpOnly: true,  
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: instancesCookiePath
    });

    return new Response(null, { status: 204 });
}