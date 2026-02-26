import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "funcionario"]).default("funcionario").notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ════════════════════════════════════════════════════════════════════
// ARTIGOS DE TECIDO
// ════════════════════════════════════════════════════════════════════
export const artigos = mysqlTable("artigos", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  nome: varchar("nome", { length: 255 }).notNull(),
  precoVista: decimal("precoVista", { precision: 10, scale: 2 }).default("0"),
  precoPrazo: decimal("precoPrazo", { precision: 10, scale: 2 }).default("0"),
  unidPreco: varchar("unidPreco", { length: 20 }).default("KG"),
  largura: varchar("largura", { length: 100 }).default(""),
  rendimento: varchar("rendimento", { length: 100 }).default(""),
  categoria: varchar("categoria", { length: 100 }).default("Outros"),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Artigo = typeof artigos.$inferSelect;
export type InsertArtigo = typeof artigos.$inferInsert;

// ════════════════════════════════════════════════════════════════════
// SUBGRUPOS (itens dentro de cada artigo)
// ════════════════════════════════════════════════════════════════════
export const subgrupos = mysqlTable("subgrupos", {
  id: int("id").autoincrement().primaryKey(),
  artigoId: int("artigoId").notNull(),
  cor: varchar("cor", { length: 100 }).default(""),
  lote: varchar("lote", { length: 100 }).default(""),
  metragem: decimal("metragem", { precision: 10, scale: 2 }).default("0"),
  localizacao: varchar("localizacao", { length: 100 }).default(""),
  quantidade: decimal("quantidade", { precision: 10, scale: 2 }).default("0"),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Subgrupo = typeof subgrupos.$inferSelect;
export type InsertSubgrupo = typeof subgrupos.$inferInsert;

// ════════════════════════════════════════════════════════════════════
// ENTRADAS DE ESTOQUE
// ════════════════════════════════════════════════════════════════════
export const entradas = mysqlTable("entradas", {
  id: int("id").autoincrement().primaryKey(),
  subgrupoId: int("subgrupoId").notNull(),
  fornecedor: varchar("fornecedor", { length: 255 }).notNull(),
  notaFiscal: varchar("notaFiscal", { length: 100 }).default(""),
  quantidade: decimal("quantidade", { precision: 10, scale: 2 }).notNull(),
  valorUnitario: decimal("valorUnitario", { precision: 10, scale: 2 }).default("0"),
  valorTotal: decimal("valorTotal", { precision: 10, scale: 2 }).default("0"),
  data: timestamp("data").defaultNow().notNull(),
  usuarioId: int("usuarioId").notNull(),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

export type Entrada = typeof entradas.$inferSelect;
export type InsertEntrada = typeof entradas.$inferInsert;

// ════════════════════════════════════════════════════════════════════
// SAIDAS DE ESTOQUE
// ════════════════════════════════════════════════════════════════════
export const saidas = mysqlTable("saidas", {
  id: int("id").autoincrement().primaryKey(),
  subgrupoId: int("subgrupoId").notNull(),
  cliente: varchar("cliente", { length: 255 }).notNull(),
  romaneio: varchar("romaneio", { length: 100 }).default(""),
  quantidade: decimal("quantidade", { precision: 10, scale: 2 }).notNull(),
  valorUnitario: decimal("valorUnitario", { precision: 10, scale: 2 }).default("0"),
  valorTotal: decimal("valorTotal", { precision: 10, scale: 2 }).default("0"),
  frete: decimal("frete", { precision: 10, scale: 2 }).default("0"),
  transportadora: varchar("transportadora", { length: 255 }).default(""),
  data: timestamp("data").defaultNow().notNull(),
  usuarioId: int("usuarioId").notNull(),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

export type Saida = typeof saidas.$inferSelect;
export type InsertSaida = typeof saidas.$inferInsert;

// ════════════════════════════════════════════════════════════════════
// HISTORICO DE MOVIMENTACOES
// ════════════════════════════════════════════════════════════════════
export const historico = mysqlTable("historico", {
  id: int("id").autoincrement().primaryKey(),
  subgrupoId: int("subgrupoId").notNull(),
  tipo: mysqlEnum("tipo", ["entrada", "saida"]).notNull(),
  referenciaId: int("referenciaId").notNull(),
  quantidade: decimal("quantidade", { precision: 10, scale: 2 }).notNull(),
  saldoAnterior: decimal("saldoAnterior", { precision: 10, scale: 2 }).default("0"),
  saldoAtual: decimal("saldoAtual", { precision: 10, scale: 2 }).default("0"),
  data: timestamp("data").defaultNow().notNull(),
  usuarioId: int("usuarioId").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

export type Historico = typeof historico.$inferSelect;
export type InsertHistorico = typeof historico.$inferInsert;

// ════════════════════════════════════════════════════════════════════
// RELACOES
// ════════════════════════════════════════════════════════════════════
export const artigosRelations = relations(artigos, ({ many }) => ({
  subgrupos: many(subgrupos),
}));

export const subgruposRelations = relations(subgrupos, ({ one, many }) => ({
  artigo: one(artigos, {
    fields: [subgrupos.artigoId],
    references: [artigos.id],
  }),
  entradas: many(entradas),
  saidas: many(saidas),
  historico: many(historico),
}));

export const entradasRelations = relations(entradas, ({ one }) => ({
  subgrupo: one(subgrupos, {
    fields: [entradas.subgrupoId],
    references: [subgrupos.id],
  }),
  usuario: one(users, {
    fields: [entradas.usuarioId],
    references: [users.id],
  }),
}));

export const saidasRelations = relations(saidas, ({ one }) => ({
  subgrupo: one(subgrupos, {
    fields: [saidas.subgrupoId],
    references: [subgrupos.id],
  }),
  usuario: one(users, {
    fields: [saidas.usuarioId],
    references: [users.id],
  }),
}));

export const historicoRelations = relations(historico, ({ one }) => ({
  subgrupo: one(subgrupos, {
    fields: [historico.subgrupoId],
    references: [subgrupos.id],
  }),
  usuario: one(users, {
    fields: [historico.usuarioId],
    references: [users.id],
  }),
}));
