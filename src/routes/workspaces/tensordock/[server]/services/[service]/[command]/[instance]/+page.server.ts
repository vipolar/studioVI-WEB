import type { PageServerLoad } from './$types';
import { v4 as uuidv4 } from 'uuid';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const service = params.service;
    const create = params.instance ? false : true;
    const instance = params.instance ? params.instance : uuidv4();    

    return {
        create: create,
        service: service,
        instance: instance
    }
}
