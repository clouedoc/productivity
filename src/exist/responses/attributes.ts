import { z } from "zod";

export const ExistAttributeSchema = z.object({
  group: z.object({
    name: z.string(),
    label: z.string(),
    priority: z.number(),
  }),
  template: z.string().nullable(),
  name: z.string(),
  label: z.string(),
  priority: z.number(),
  manual: z.boolean(),
  active: z.boolean(),
  value_type: z.number(),
  value_type_description: z.string(),
  service: z.object({
    name: z.string(),
    label: z.string(),
  }),
  values: z.array(z.object({
    date: z.string(),
    value: z.number().or(z.string()).nullable(),
  })),
});
export type ExistAttribute = z.infer<typeof ExistAttributeSchema>;

export const ExistAttributesWithValuesResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: ExistAttributeSchema.array(),
});
