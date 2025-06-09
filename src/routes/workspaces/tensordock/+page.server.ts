import { workspacesCookiesPath, tensordockCookiePrefix } from '$lib/cookies/constants';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
	connect: async ({ request, cookies }) => {
		const formdata = await request.formData();
		const token = formdata.get('token') as string | null;
		const server = formdata.get('server') as string | null;

		if (!token) {
			return fail(400, { token, missing: true });
		}

		if (!server) {
			return fail(400, { server, missing: true });
		}

		cookies.set(`${tensordockCookiePrefix}${server}`, token, {
			path: workspacesCookiesPath,
			sameSite: 'strict',
			httpOnly: true,
			secure: true,
			maxAge: 3600
		});

		try {
			const url = `https://dashboard.tensordock.com/api/v2/instances/${server}`;
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

			return await response.json();
		} catch (error) {
			console.error("Error:", error);
			return { error: error };
		}
	},
	services: async ({ url, request, cookies }) => {
		const formdata = await request.formData();
		const port = formdata.get('port') as string | null;
		const server = formdata.get('server') as string | null;

		if (!server) {
			return fail(400, { server, missing: true });
		}

		if (!port) {
			return fail(400, { port, missing: true });
		}

		try {
			const response = await fetch(`http://localhost:5000/services/get/all?extensive=false`);

			if (!response.ok) {
				throw new Error (await response.text());
			}

			return await response.json();
		} catch (error) {
			console.error("Error:", error);
			return { error: error };
		}
	},
	start: async ({ url, request, cookies }) => {
		const server = url.searchParams.get('server');
		if (!server) {
			return fail(400, { server, missing: true });
		}

		const token = cookies.get(`${tensordockCookiePrefix}${server}`) as string | null;
		if (!token) {
			return fail(400, { token, missing: true });
		}

		try {
			const url = `https://dashboard.tensordock.com/api/v2/instances/${server}/start`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
			});

			if (!response.ok) {
				throw new Error (await response.text());
			}

			return await response.json();
		} catch (error) {
			console.error("Error:", error);
			return { error: error };
		}
	},
	stop: async ({ url, request, cookies }) => {
		const server = url.searchParams.get('server');
		if (!server) {
			return fail(400, { server, missing: true });
		}

		const token = cookies.get(`${tensordockCookiePrefix}${server}`) as string | null;
		if (!token) {
			return fail(400, { token, missing: true });
		}

		try {
			const url = `https://dashboard.tensordock.com/api/v2/instances/${server}/stop`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
			});

			if (!response.ok) {
				throw new Error (await response.text());
			}

			return await response.json();
		} catch (error) {
			console.error("Error:", error);
			return { error: error };
		}
	},
	delete: async ({ url, request, cookies }) => {
		const server = url.searchParams.get('server');
		if (!server) {
			return fail(400, { server, missing: true });
		}

		const token = cookies.get(`${tensordockCookiePrefix}${server}`) as string | null;
		if (!token) {
			return fail(400, { token, missing: true });
		}

		try {
			const url = `https://dashboard.tensordock.com/api/v2/instances/${server}`;
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
			});

			if (!response.ok) {
				throw new Error (await response.text());
			}

			return await response.json();
		} catch (error) {
			console.error("Error:", error);
			return { error: error };
		}
	}
} satisfies Actions;