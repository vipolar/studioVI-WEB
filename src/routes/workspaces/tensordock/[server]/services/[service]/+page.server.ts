import type { BackendResponse, ServiceExtensive } from '$lib/types/backend';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
    const flaskUrl = `http://localhost:5000/services/get/${params.service}?extensive=true`;

    try {
        const response = await fetch(flaskUrl);

        if (!response.ok || !response.body) {
            throw new Error(`Failed to read '${params.service}' service metadata. Server response: ${response.statusText}, ${response.status}`);
        }

        const backendResponse = await response.json() as BackendResponse;
        if (!backendResponse.success && backendResponse.error) {
            throw new Error(`Failed to read '${params.service}' service metadata. Server response: ${backendResponse.error}`);
        }

        return { service: backendResponse.service as ServiceExtensive };
    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
}

export const actions = {
    start: async ({ params, request, url }) => {
		const formdata = await request.formData();
        const command = formdata.get('command') as string | null;
        if (command == null) {
			return {
				body: {
					error: "Missing required parameters"
				},
				status: 400
			}
		}

        const flaskUrl = `http://localhost:5000/services/launch/${params.service}/${command}`; 

        try {
            const requestBody = JSON.stringify({
                command: command
            });

            const response = await fetch(flaskUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: requestBody,
			});

            if (!response.ok || !response.body) {
                throw new Error(`Failed to create a new instance of '${params.service}' service. Server response: ${response.statusText}, ${response.status}`);
            }

            const backendResponse = await response.json() as BackendResponse;
            if (!backendResponse.success && backendResponse.error) {
                throw new Error(`Failed to create a new instance. Server response: ${backendResponse.error}`);
            }

            throw redirect(308, `./${params.service}/${command}/${backendResponse.instance}`);
        } catch (error) {
            /* rethrow redirect because sveltekit handles it as an error */
            if ((error as any).status && (error as any).location) {
                const status = (error as any).status;
                if (status >= 301 && status <= 308) {
                    throw error;
                }
            }

            console.error("Error: ", error);
        }
    }
} satisfies Actions;
