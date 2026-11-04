
import { z } from "zod";

export const tradeSchema = z.object({
  symbol: z.string().trim().min(1).max(20).transform((value) => value.toUpperCase()),
  side: z.enum(["BUY", "SELL"]),
  quantity: z.number().int().positive().max(1000000),
});

export const stockQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  sector: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
