import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { Request, Response } from "express";
import Redis from "ioredis";

// Conectar ao Redis
const redisClient = new Redis({
  host: process.env.IO_REDIS_SERVER || "redis",
  port: parseInt(process.env.IO_REDIS_PORT || "6379"),
  password: process.env.IO_REDIS_PASSWORD,
  db: 3 // Usar DB 3 para rate limiting
});

// Handler customizado para quando o limite é atingido
const rateLimitHandler = (req: Request, res: Response) => {
  res.status(429).json({
    error: "Too many requests",
    message: "Você excedeu o limite de requisições. Tente novamente em alguns minutos.",
    retryAfter: res.getHeader("Retry-After")
  });
};

// Configurações base do rate limiter
const baseConfig = {
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: rateLimitHandler,
  store: new RedisStore({
    client: redisClient,
    prefix: "rl:"
  })
};

// ====================================
// Rate Limiter para API Geral
// ====================================
export const generalLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por 15 minutos
  message: "Muitas requisições. Tente novamente em 15 minutos.",
  skipSuccessfulRequests: false
});

// ====================================
// Rate Limiter para Login/Auth
// ====================================
export const authLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por 15 minutos
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  skipSuccessfulRequests: true, // Não contar logins bem-sucedidos
  keyGenerator: (req: Request) => {
    // Rate limit por IP + email
    const email = req.body.email || "";
    return `${req.ip}-${email}`;
  }
});

// ====================================
// Rate Limiter para APIs Públicas
// ====================================
export const publicApiLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 requests por minuto
  message: "Muitas requisições para API pública. Tente novamente em 1 minuto."
});

// ====================================
// Rate Limiter para WhatsApp Webhook
// ====================================
export const webhookLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minuto
  max: 300, // 300 requests por minuto (webhooks podem ser intensos)
  message: "Muitas requisições de webhook.",
  skipFailedRequests: true
});

// ====================================
// Rate Limiter para Anna IA
// ====================================
export const annaLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 análises de IA por minuto (OpenAI custa dinheiro!)
  message: "Muitas requisições para Anna IA. Tente novamente em 1 minuto."
});

// ====================================
// Rate Limiter por IP + Usuário
// ====================================
export const createUserLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    ...baseConfig,
    windowMs,
    max,
    keyGenerator: (req: Request) => {
      // @ts-ignore - req.user adicionado pelo middleware isAuth
      const userId = req.user?.id || "anonymous";
      return `${req.ip}-${userId}`;
    }
  });
};

export default {
  generalLimiter,
  authLimiter,
  publicApiLimiter,
  webhookLimiter,
  annaLimiter,
  createUserLimiter
};
