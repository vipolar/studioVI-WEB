import { workspacesCookiesPath, tensordockCookiePrefix } from '$lib/cookies/constants';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

/* load all servers from cookies?*/

export const actions = {
	connect: async ({ request, cookies }) => {
		const formdata = await request.formData();
		const id = formdata.get('id') as string | null;
		const token = formdata.get('token') as string | null;

		if (!token) {
			return fail(400, { token, missing: true });
		}

		if (!id) {
			return fail(400, { id, missing: true });
		}

		cookies.set(`${tensordockCookiePrefix}${id}`, token, {
			path: workspacesCookiesPath,
			sameSite: 'strict',
			httpOnly: true,
			secure: false
		});

		try {
			const url = `https://dashboard.tensordock.com/api/v2/instances/${id}`;
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
			return {
				id: id,
				error: error,
				success: false
			};
		}
	},
	models: async ({ url, request, cookies }) => {
		const params = new URLSearchParams();
		const formdata = await request.formData();
		const id = formdata.get('id') as string | null;
		const port = formdata.get('port') as string | null;
		const server = formdata.get('server') as string | null;
		

		if (!server) {
			return fail(400, { server, missing: true });
		}

		if (!port) {
			return fail(400, { port, missing: true });
		}

		if (!id) {
			return fail(400, { id, missing: true });
		}

		try {
			params.append('strict', 'true')
			const keys = ["name", "description", "sus.cet.jit"];
			keys.forEach(key => params.append('extract', key));

			//const response = await fetch(`https://${server}:${port}/models/get/all?${params.toString()}`);
			const response = await fetch(`http://localhost:5000/models/get/all?${params.toString()}`);

			if (!response.ok) {
				throw new Error (await response.text());
			}

			return {
				id: id,
				success: true,
				models: await response.json()
			}
		} catch (error) {
			console.error("Error:", error);
			return {
				id: id,
				error: error,
				success: false
			};
		}
	},
	services: async ({ url, request, cookies }) => {
		const params = new URLSearchParams();
		const formdata = await request.formData();
		const id = formdata.get('id') as string | null;
		const port = formdata.get('port') as string | null;
		const server = formdata.get('server') as string | null;

		if (!server) {
			return fail(400, { server, missing: true });
		}

		if (!port) {
			return fail(400, { port, missing: true });
		}

		if (!id) {
			return fail(400, { id, missing: true });
		}

		try {
			params.append('strict', 'true')
			const keys = ["name", "description"];
			keys.forEach(key => params.append('extract', key));

			//const response = await fetch(`https://${server}:${port}/services/get/all?${params.toString()}`);
			const response = await fetch(`http://localhost:5000/services/get/all?${params.toString()}`);

			if (!response.ok) {
				throw new Error (await response.text());
			}

			return {
				id: id,
				success: true,
				services: await response.json()
			}
		} catch (error) {
			console.error("Error:", error);
			return {
				id: id,
				error: error,
				success: false
			};
		}
	},
	utilities: async ({ url, request, cookies }) => {
		const params = new URLSearchParams();
		const formdata = await request.formData();
		const id = formdata.get('id') as string | null;
		const port = formdata.get('port') as string | null;
		const server = formdata.get('server') as string | null;

		if (!server) {
			return fail(400, { server, missing: true });
		}

		if (!port) {
			return fail(400, { port, missing: true });
		}

		if (!id) {
			return fail(400, { id, missing: true });
		}

		try {
			params.append('strict', 'true')
			const keys = ["name", "description"];
			keys.forEach(key => params.append('extract', key));

			//const response = await fetch(`https://${server}:${port}/utilities/get/all?${params.toString()}`);
			const response = await fetch(`http://localhost:5000/utilities/get/all?${params.toString()}`);

			if (!response.ok) {
				throw new Error (await response.text());
			}

			return {
				id: id,
				success: true,
				utilities: await response.json()
			}
		} catch (error) {
			console.error("Error:", error);
			return {
				id: id,
				error: error,
				success: false
			};
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