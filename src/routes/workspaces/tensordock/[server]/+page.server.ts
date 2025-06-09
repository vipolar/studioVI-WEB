import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const flaskUrl = `http://localhost:5000/services/get/all?extensive=true`;

    try {
        const response = await fetch(flaskUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        //const services = await response.json();
        return await response.json();
    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
}

import type { Actions } from './$types';

export const actions = {
    login: async ({ request, cookies }) => {
        const url = "http://localhost:5000/login";
        const apiRequestParams = new URLSearchParams();
        const formdata = await request.formData();

        const username = formdata.get('username') as string | null;
        const password = formdata.get('password') as string | null;
        if (username == null || password == null) {
            return {
                body: {
                    error: "Missing required parameters"
                },
                status: 400
            }
        }

        apiRequestParams.append("username", username);
        apiRequestParams.append("password", password);
//        apiRequestParams.append("role", "user");

      /*  cookies.set(`${server}_tensordock`, JSON.stringify({api_key: api_key, api_token: api_token}), {
            path: workspacesCookiePath,
            sameSite: 'strict',
            httpOnly: true,
            secure: true,
            maxAge: 3600
        }); */

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                credentials: "include"
            });

            console.log(response.headers.getSetCookie());
            const authCookies = response.headers.getSetCookie();

            authCookies.forEach(cookie => {
                const parts = cookie.split(';').map((part) => part.trim());
                const [name, value] = parts[0].split('=');
                const attributes = parts.slice(1);

                cookies.set(name, value, {
                            path: "/",
                            sameSite: 'lax',
                            httpOnly: true,
                            secure: false,
                            maxAge: 3600
                        });
            });

            const result = await response.json();
            if (!response.ok) {
                return { status: response.status, body: result };
            }
            //console.log(result);
            return result;
        } catch (error) {
            console.error("Error:", error);
            return { error: error };
        }
    }
} satisfies Actions;