import { Str } from "@workspace/core";
import { drizzle } from "drizzle-orm/node-postgres";
import type { ContextVariableMap } from "hono";
import type { CookieOptions } from "hono/utils/cookie";

import type { Config } from "../config";

import type { AuthTokenPayload } from "@/features/auth";
import { CategoryService, DrizzleCategoryRepository } from "@/features/category";
import { CryptoService, generateSafeUid } from "@/features/crypto";
import { BcryptHashProvider, HashingService } from "@/features/hashing";
import { generateJwt, JwtService, verifyJwt } from "@/features/jwt";
import { DrizzleStoreRepository, StoreService } from "@/features/store";
import { DrizzleStoreProductRepository, StoreProductService } from "@/features/store-product";
import { DrizzleUserRepository, UserService } from "@/features/user";

declare module "hono" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ContextVariableMap {
    config: Config;
    cookieOptions: CookieOptions;
    cryptoService: CryptoService;
    authTokenService: JwtService<AuthTokenPayload>;
    userService: UserService;
    storeService: StoreService;
    storeProductService: StoreProductService;
    categoryService: CategoryService;
  }
}

function create(config: Config): ContextVariableMap {
  const {
    auth: {
      jwt: {
        access: { secret, lifetime },
      },
    },
    bcrypt: { roundsForPasswordHash },
    cookie: { domain, sameSite, secure },
    drizzle: { databaseUrl, casing },
    server: { protocol },
  } = config;

  const db = drizzle({
    connection: databaseUrl,
    casing,
  });

  return {
    config: config,
    cookieOptions: {
      domain,
      httpOnly: true,
      path: Str.SLASH,
      sameSite: typeof sameSite === "boolean" ? (sameSite ? "strict" : "none") : sameSite,
      secure: secure === "auto" ? protocol === "https" : secure,
    },
    cryptoService: new CryptoService(generateSafeUid),
    authTokenService: new JwtService(secret, lifetime, generateJwt, verifyJwt),
    userService: new UserService(
      new DrizzleUserRepository(db),
      new HashingService(
        BcryptHashProvider.createDataHasher(roundsForPasswordHash),
        BcryptHashProvider.compareHashData,
      ),
    ),
    storeService: new StoreService(new DrizzleStoreRepository(db)),
    storeProductService: new StoreProductService(new DrizzleStoreProductRepository(db)),
    categoryService: new CategoryService(new DrizzleCategoryRepository(db)),
  };
}

export { create };
