import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure, funcionarioProcedure } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ════════════════════════════════════════════════════════════════════
  // ARTIGOS (ADMIN ONLY)
  // ════════════════════════════════════════════════════════════════════
  artigos: router({
    list: publicProcedure.query(async () => {
      const { getAllArtigos } = await import("./db");
      return getAllArtigos();
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getArtigoById } = await import("./db");
        return getArtigoById(input);
      }),
    
    create: adminProcedure
      .input(z.object({
        codigo: z.string(),
        nome: z.string(),
        precoVista: z.number().optional(),
        precoPrazo: z.number().optional(),
        unidPreco: z.string().optional(),
        largura: z.string().optional(),
        rendimento: z.string().optional(),
        categoria: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createArtigo } = await import("./db");
        return createArtigo(input);
      }),
  }),

  // ════════════════════════════════════════════════════════════════════
  // SUBGRUPOS (ADMIN ONLY)
  // ════════════════════════════════════════════════════════════════════
  subgrupos: router({
    getByArtigoId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getSubgruposByArtigoId } = await import("./db");
        return getSubgruposByArtigoId(input);
      }),
    
    create: adminProcedure
      .input(z.object({
        artigoId: z.number(),
        cor: z.string().optional(),
        lote: z.string().optional(),
        metragem: z.number().optional(),
        localizacao: z.string().optional(),
        quantidade: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createSubgrupo } = await import("./db");
        return createSubgrupo(input);
      }),
  }),

  // ════════════════════════════════════════════════════════════════════
  // ENTRADAS (ADMIN ONLY)
  // ════════════════════════════════════════════════════════════════════
  entradas: router({
    create: adminProcedure
      .input(z.object({
        subgrupoId: z.number(),
        fornecedor: z.string(),
        notaFiscal: z.string().optional(),
        quantidade: z.number(),
        valorUnitario: z.number().optional(),
        valorTotal: z.number().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implementar criação de entrada
        return { success: true };
      }),
  }),

  // ════════════════════════════════════════════════════════════════════
  // SAIDAS (FUNCIONARIO + ADMIN)
  // ════════════════════════════════════════════════════════════════════
  saidas: router({
    create: funcionarioProcedure
      .input(z.object({
        subgrupoId: z.number(),
        cliente: z.string(),
        romaneio: z.string().optional(),
        quantidade: z.number(),
        valorUnitario: z.number().optional(),
        valorTotal: z.number().optional(),
        frete: z.number().optional(),
        transportadora: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implementar criação de saída
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
