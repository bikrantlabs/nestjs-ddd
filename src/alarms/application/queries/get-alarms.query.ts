/**
 * In real world application, we can also pass query params like: limit, offset, sort, etc.
 *
 * ```
    export class GetAlarmsQuery {
    constructor(
        public readonly limit: number,
        public readonly offset: number,
        public readonly sort: SortOptions,
    ) {}
    // 
    }
 * ```
 *
 * And inside alarms.controller.ts:
 * ```
    findAll(findAllDto: FindAllDto) {
        const getAlarmsQuery = new GetAlarmsQuery(size, offset, sort);
        return this.alarmsService.findAll(getAlarmsQuery);
    }
 * ```
 */
export class GetAlarmsQuery {}
