import * as z from 'zod';

const errorMessages = {
  400: 'Parâmetros inválidos.',
  404: 'Recurso não encontrado.',
  500: 'Erro interno do servidor.',
};

/** Middleware para tratar os erros personalizados
 *
 * @param { Error } err - Array de erros encontrados
 * @param { Request } req - Requisição HTTP
 * @param { Response } res - Resposta HTTP
 * @returns { Response }
 */
export function errorHandler(err, req, res, next) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      status: 400,
      message: errorMessages[400],
      errors: err.issues.reduce((acc, error) => {
        const path = error.path;
        acc[path] = error.message;
        return acc;
      }, {}),
    });
  }

  if (err.isCustom) {
    return res.status(err.status).json({
      status: err.status,
      message: errorMessages[err.status],
      errors: err.errors,
    });
  }

  return res.status(500).json({
    status: 500,
    message: errorMessages[500],
    errors: err.message,
  });
}
