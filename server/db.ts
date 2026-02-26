import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, artigos, subgrupos, entradas, saidas, historico, Artigo, Subgrupo } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createArtigo(data: {
  codigo: string;
  nome: string;
  precoVista?: number;
  precoPrazo?: number;
  unidPreco?: string;
  largura?: string;
  rendimento?: string;
  categoria?: string;
}): Promise<Artigo | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(artigos).values({
      codigo: data.codigo,
      nome: data.nome,
      precoVista: data.precoVista ? String(data.precoVista) : "0",
      precoPrazo: data.precoPrazo ? String(data.precoPrazo) : "0",
      unidPreco: data.unidPreco || "KG",
      largura: data.largura || "",
      rendimento: data.rendimento || "",
      categoria: data.categoria || "Outros",
    });
    const artigo = await getArtigoById((result as any).insertId);
    return artigo || null;
  } catch (error) {
    console.error("[Database] Failed to create artigo:", error);
    return null;
  }
}

export async function updateArtigo(id: number, data: Partial<Artigo>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.update(artigos).set(data).where(eq(artigos.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update artigo:", error);
    return false;
  }
}

export async function createSubgrupo(data: {
  artigoId: number;
  cor?: string;
  lote?: string;
  metragem?: number;
  localizacao?: string;
  quantidade?: number;
}): Promise<Subgrupo | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(subgrupos).values({
      artigoId: data.artigoId,
      cor: data.cor || "",
      lote: data.lote || "",
      metragem: data.metragem ? String(data.metragem) : "0",
      localizacao: data.localizacao || "",
      quantidade: data.quantidade ? String(data.quantidade) : "0",
    });
    const subgrupo = await getSubgrupoById((result as any).insertId);
    return subgrupo || null;
  } catch (error) {
    console.error("[Database] Failed to create subgrupo:", error);
    return null;
  }
}

export async function updateSubgrupo(id: number, data: Partial<Subgrupo>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.update(subgrupos).set(data).where(eq(subgrupos.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update subgrupo:", error);
    return false;
  }
}

// ════════════════════════════════════════════════════════════════════
// USUARIOS
// ════════════════════════════════════════════════════════════════════
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(users.name);
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ════════════════════════════════════════════════════════════════════
// ARTIGOS
// ════════════════════════════════════════════════════════════════════
export async function getAllArtigos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artigos).where(eq(artigos.ativo, true)).orderBy(artigos.nome);
}

export async function getArtigoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(artigos).where(eq(artigos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getArtigoByCodigo(codigo: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(artigos).where(eq(artigos.codigo, codigo)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ════════════════════════════════════════════════════════════════════
// SUBGRUPOS
// ════════════════════════════════════════════════════════════════════
export async function getSubgruposByArtigoId(artigoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subgrupos).where(eq(subgrupos.artigoId, artigoId)).orderBy(subgrupos.cor);
}

export async function getSubgrupoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subgrupos).where(eq(subgrupos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
