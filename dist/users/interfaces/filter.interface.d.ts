import { FindOperator } from 'typeorm';
export interface Filters {
    id: FindOperator<number>;
    active: boolean;
    confirm: boolean;
    role: FindOperator<string>;
    username?: FindOperator<string>;
    or?: [{
        username: FindOperator<string>;
    }, {
        name: FindOperator<string>;
    }];
}
