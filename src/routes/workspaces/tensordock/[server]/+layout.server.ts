import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, cookies }) => {
	const url = "https://dashboard.tensordock.com/api/v0/client/get/single";
    const serverCookie = cookies.get(`${params.server}_tensordock`);
    const apiRequestParams = new URLSearchParams();

    if (!serverCookie) {
        return;
    }

    try {
        const credentials = JSON.parse(serverCookie);
        if (credentials.api_key == undefined || credentials.api_token == undefined) {
            throw new Error("Missing required credentials");
        }

        apiRequestParams.append("server", params.server);
		apiRequestParams.append("api_key", credentials.api_key);
		apiRequestParams.append("api_token", credentials.api_token);
    } catch (error) {
        console.error(error);
        return;
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: apiRequestParams.toString(),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        console.log(response.headers.get('Set-Cookie'));
        //cookies.set(response.headers.get('Set-Cookie'));
        const server = await response.json();
        return { server };
    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
};
