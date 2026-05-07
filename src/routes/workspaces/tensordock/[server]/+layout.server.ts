import { tensordockCookiePrefix } from '$lib/cookies/constants';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, cookies }) => {
	const url = `https://dashboard.tensordock.com/api/v2/instances/${params.server}`;
    const serverCookie = cookies.get(`${tensordockCookiePrefix}${params.server}`);

    if (!serverCookie) {
        return;
    }

    try {
        const token = serverCookie;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error (await response.text());
        }

        return {
            server: await response.json()
        }
    } catch (error) {
        console.error("Error:", error);
        return { error: error };
    }
};
