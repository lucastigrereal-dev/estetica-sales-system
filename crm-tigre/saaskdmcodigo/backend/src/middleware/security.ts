import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { body, validationResult } from "express-validator";

// ====================================
// Helmet - Security Headers
// ====================================
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // React precisa de unsafe-eval
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"], // WebSocket
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Necessário para alguns recursos externos
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  }
});

// ====================================
// CORS Configuration
// ====================================
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001"
];

// Adicionar domínios de produção se NODE_ENV=production
if (process.env.NODE_ENV === "production") {
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
}

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Permitir requests sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Permitir cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept"
  ],
  maxAge: 86400 // Cache preflight por 24h
});

// ====================================
// Input Sanitization Middleware
// ====================================
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remover caracteres perigosos de strings
  const sanitizeString = (str: string): string => {
    if (typeof str !== "string") return str;

    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove <script>
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, "") // Remove event handlers (onclick, onerror, etc)
      .trim();
  };

  // Sanitizar recursivamente todos os campos
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === "string") {
      return sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    if (typeof obj === "object" && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }

    return obj;
  };

  // Aplicar sanitização
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

// ====================================
// Validation Error Handler
// ====================================
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array()
    });
  }

  next();
};

// ====================================
// Common Validation Rules
// ====================================
export const validationRules = {
  // Email
  email: body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email inválido"),

  // Senha
  password: body("password")
    .isLength({ min: 8 })
    .withMessage("Senha deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Senha deve conter maiúscula, minúscula e número"),

  // Nome
  name: body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nome deve ter entre 3 e 100 caracteres"),

  // Telefone brasileiro
  phone: body("phone")
    .matches(/^(\+?55)?(\d{10,11})$/)
    .withMessage("Telefone inválido"),

  // CPF
  cpf: body("cpf")
    .matches(/^\d{11}$/)
    .withMessage("CPF deve conter 11 dígitos"),

  // CNPJ
  cnpj: body("cnpj")
    .matches(/^\d{14}$/)
    .withMessage("CNPJ deve conter 14 dígitos")
};

// ====================================
// API Key Validation (para APIs públicas)
// ====================================
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "API key é obrigatória"
    });
  }

  // Verificar se API key é válida
  // TODO: Implementar validação contra banco de dados
  const validApiKeys = process.env.API_KEYS?.split(",") || [];

  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Forbidden",
      message: "API key inválida"
    });
  }

  next();
};

// ====================================
// Request Logger (para auditoria)
// ====================================
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log quando resposta termina
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      timestamp: new Date().toISOString()
    };

    // Apenas logar em desenvolvimento ou erros em produção
    if (process.env.NODE_ENV === "development" || res.statusCode >= 400) {
      console.log(JSON.stringify(log));
    }
  });

  next();
};

export default {
  helmetConfig,
  corsConfig,
  sanitizeInput,
  handleValidationErrors,
  validationRules,
  validateApiKey,
  requestLogger
};
