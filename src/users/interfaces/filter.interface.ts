import { FindOperator } from 'typeorm';

export interface Filters {
  active: boolean;
  role: FindOperator<string>;
  username?: FindOperator<string>;
}
