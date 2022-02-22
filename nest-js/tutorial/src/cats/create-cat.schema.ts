import { object, string, number } from '@hapi/joi';
export const createCatSchema = object({
  name: string().required(),
  age: number()
    .min(0)
    .max(200),
  breed: string(),
});
