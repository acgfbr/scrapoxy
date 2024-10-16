import { Logger } from '@nestjs/common';
import {
    CONNECTOR_ZYTE_TYPE,
    EProxyStatus,
} from '@scrapoxy/common';
import { v4 as uuid } from 'uuid';
import { TRANSPORT_ZYTE_API_TYPE } from './transport/zyte.constants';
import type { IConnectorService } from '@scrapoxy/backend-sdk';
import type {
    IConnectorProxyRefreshed,
    IProxyKeyToRemove,
} from '@scrapoxy/common';


function convertToProxy(id: string): IConnectorProxyRefreshed {
    const arr = id.split('-');
    const name = arr[ arr.length - 1 ];
    const proxy: IConnectorProxyRefreshed = {
        type: CONNECTOR_ZYTE_TYPE,
        transportType: TRANSPORT_ZYTE_API_TYPE,
        key: id,
        name,
        status: EProxyStatus.STARTED,
        config: {},
    };

    return proxy;
}


export class ConnectorZyteApiService implements IConnectorService {
    private readonly logger = new Logger(ConnectorZyteApiService.name);

    async getProxies(keys: string[]): Promise<IConnectorProxyRefreshed[]> {
        this.logger.debug('getProxies()');

        const proxies = keys.map(convertToProxy);

        return proxies;
    }

    async createProxies(count: number): Promise<IConnectorProxyRefreshed[]> {
        this.logger.debug(`createProxies(): count=${count}`);

        const proxies: IConnectorProxyRefreshed[] = [];
        for (let i = 0; i < count; i++) {
            const id = uuid();
            proxies.push(convertToProxy(id));
        }

        return proxies;
    }

    async startProxies(): Promise<void> {
        // Not used
    }

    async removeProxies(keys: IProxyKeyToRemove[]): Promise<string[]> {
        this.logger.debug(`removeProxies(): keys.length=${keys.length}`);

        return keys.map((p) => p.key);
    }
}