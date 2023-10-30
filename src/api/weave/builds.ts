import {
    Build,
    BuildId,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/builds';
import { WeaveRouteBase } from './weave-route-base';

export class WeaveBuilds extends WeaveRouteBase {
    constructor() {
        super('/builds');
    }

    create = async (
        encodedData: string,
        buildVersion: string,
    ): Promise<BuildId> => {
        const response = await this.fetchFromApi('/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ encodedData, buildVersion }),
        });

        return response.buildId;
    };

    delete = async (id: BuildId): Promise<void> => {
        await this.fetchFromApi(`/delete/${id}`, {
            method: 'DELETE',
        });
    };

    update = async (
        id: BuildId,
        encodedData: string,
        buildVersion: string,
    ): Promise<void> => {
        await this.fetchFromApi(`/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ encodedData, buildVersion }),
        });
    };

    get = async (id: BuildId): Promise<Build> => {
        return this.fetchFromApi(`/get/${id}`);
    };
}
