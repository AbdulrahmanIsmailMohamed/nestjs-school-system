import { Transform } from 'class-transformer';

export const TransformInt = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  );
