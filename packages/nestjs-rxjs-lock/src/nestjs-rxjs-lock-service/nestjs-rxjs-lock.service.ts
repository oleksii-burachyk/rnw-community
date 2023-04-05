import Redlock from 'redlock';
import { type Observable, concatMap, finalize, from } from 'rxjs';

import { isNotEmptyString } from '@rnw-community/shared';

import type { NestJSRxJSLockModuleOptions } from '../nestjs-rxjs-lock-module.options';
import type { RedisService } from 'nestjs-redis';

export abstract class NestJSRxJSLockService<E = string> {
    private readonly lock: Redlock;
    private readonly expireInMs: number;

    protected constructor(
        // TODO: Can we avoid nestjs-redis dependency?
        readonly redis: RedisService,
        readonly options: NestJSRxJSLockModuleOptions
    ) {
        const { defaultExpireMs, ...redlockOptions } = options;
        this.expireInMs = options.defaultExpireMs;

        const redisInstances = Array.from(redis.getClients().values());

        this.lock = new Redlock(redisInstances, redlockOptions);
    }

    /**
     * RxJS wrapper for redlock acquire lock method
     *
     * @see https://www.npmjs.com/package/redlock
     *
     * @param name Redis lock key name
     * @param prefix Redis lock key prefix
     * @param handler$ Observable handler with business logic to be executed under lock
     * @param expireInMs Lock expiration time in milliseconds, default option is used if not provided
     * @returns Observable<T> returned from handler$
     */
    lock$<T>(name: string, prefix: E, handler$: () => Observable<T>, expireInMs = this.expireInMs): Observable<T> {
        const lockName = NestJSRxJSLockService.generateName(name, prefix);

        return from(this.lock.acquire([lockName], expireInMs)).pipe(
            concatMap(lock => handler$().pipe(finalize(() => void lock.unlock().catch(() => void 0))))
        );
    }

    private static generateName<E>(name: string, prefix: E): string {
        return ['lock', prefix, name].filter(isNotEmptyString).join(':');
    }
}
