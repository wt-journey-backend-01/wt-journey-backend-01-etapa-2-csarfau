import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';
import { agentesRepository } from '../repositories/agentesRepository.js';
import { createError } from '../utils/errorHandler.js';

const newAgenteSchema = z.object({
  nome: z.string("O campo 'nome' deve ser uma string.").min(1, "O campo 'nome' é obrigatório."),
  dataDeIncorporacao: z.iso
    .date({
      error: (issue) =>
        issue.input === undefined || issue.input === ''
          ? "O campo 'dataDeIncorporacao' é obrigatório."
          : "O campo 'dataDeIncorporacao' deve estar no formato YYYY-MM-DD.",
    })
    .refine((date) => new Date(date) <= new Date(), {
      error: 'A data de incorporação não pode ser maior que a data atual.',
    }),
  cargo: z.string("O campo 'cargo' deve ser uma string.").min(1, "O campo 'cargo' é obrigatório."),
});

const searchQuerySchema = z.object({
  cargo: z.string("O parâmetro 'cargo' deve ser uma string.").optional(),
  sort: z
    .enum(
      ['dataDeIncorporacao', '-dataDeIncorporacao'],
      "O parâmetro 'sort' deve ser somente 'dataDeIncorporacao' ou '-dataDeIncorporacao'.",
    )
    .optional(),
});

/** Retorna todos os agentes salvos
 *
 * @param { Request } req - Requisição HTTP
 * @param { Response } res - Resposta HTTP
 * @param { NextFunction } next - Próximo middleware
 * @returns { Response }
 */
function index(req, res, next) {
  try {
    const { cargo, sort } = searchQuerySchema.parse(req.query);

    let agentes = agentesRepository.findAll();

    if (cargo) {
      agentes = agentes.filter((a) => a.cargo.toLowerCase() === cargo.toLowerCase());
    }

    if (sort) {
      agentes = agentes.sort((a, b) => {
        const dataA = new Date(a.dataDeIncorporacao);
        const dataB = new Date(b.dataDeIncorporacao);
        return sort === 'dataDeIncorporacao' ? dataA - dataB : dataB - dataA;
      });
    }

    if ((cargo || sort) && agentes.length < 1) {
      return next(createError(404, { query: 'Não foram encontrados agentes com os parâmetros informados.' }));
    }

    if (agentes.length < 1) {
      return next(createError(404, { agentes: 'Nenhum agente encontrado.' }));
    }

    res.status(200).json(agentes);
  } catch (err) {
    return next(err);
  }
}

/** Encontra um agente específico
 *
 * @param { Request } req - Requisição HTTP
 * @param { Response } res - Resposta HTTP
 * @param { NextFunction } next - Próximo middleware
 * @returns { Response }
 */
function show(req, res, next) {
  try {
    const { id: agenteId } = z
      .object({
        id: z.uuid("O parâmetro 'id' deve ser um UUID válido."),
      })
      .parse(req.params);

    const agente = agentesRepository.findById(agenteId);

    if (!agente) {
      return next(createError(404, { agente_id: `Agente não encontrado.` }));
    }

    return res.status(200).json(agente);
  } catch (err) {
    return next(err);
  }
}

/** Cria um novo agente
 *
 * @param { Request } req - Requisição HTTP
 * @param { Response } res - Resposta HTTP
 * @param { NextFunction } next - Próximo middleware
 * @returns { Response }
 */
function create(req, res, next) {
  try {
    let newAgenteData = newAgenteSchema.parse(req.body);

    newAgenteData = { id: uuidv4(), ...newAgenteData };

    const newAgente = agentesRepository.create(newAgenteData);

    return res.status(201).json(newAgente);
  } catch (err) {
    return next(err);
  }
}

/** Atualiza todas as informações de um agente
 *
 * @param { Request } req - Requisição HTTP
 * @param { Response } res - Resposta HTTP
 * @param { NextFunction } next - Próximo middleware
 * @returns { Response }
 */
function update(req, res, next) {
  try {
    const { id: agenteId } = z
      .object({
        id: z.uuid("O campo 'id' deve ser um UUID válido."),
      })
      .parse(req.params);

    const agente = agentesRepository.findById(agenteId);

    if (!agente) {
      return next(createError(404, { agente_id: `Agente com o ID: ${agenteId} não encontrado.` }));
    }

    const newAgenteData = newAgenteSchema.parse(req.body);
    delete newAgenteData.id;

    const updatedAgente = agentesRepository.update(newAgenteData, agenteId);
    return res.status(200).json(updatedAgente);
  } catch (err) {
    return next(err);
  }
}

/** Atualiza informações parciais de um agente
 *
 * @param { Request } req - Requisição HTTP
 * @param { Response } res - Resposta HTTP
 * @param { NextFunction } next - Próximo middleware
 * @returns { Response }
 */
function patch(req, res, next) {
  try {
    const { id: agenteId } = z
      .object({
        id: z.uuid("O campo 'id' deve ser um UUID válido."),
      })
      .parse(req.params);

    const agente = agentesRepository.findById(agenteId);

    if (!agente) {
      return next(createError(404, { agente_id: `Agente não encontrado.` }));
    }

    const agenteDataToUpdate = newAgenteSchema.partial().parse(req.body);
    delete agenteDataToUpdate.id;

    const updatedAgente = agentesRepository.update(agenteDataToUpdate, agenteId);
    return res.status(200).json(updatedAgente);
  } catch (err) {
    return next(err);
  }
}

/** Remove um agente
 *
 * @param { Request } req - Requisição HTTP
 * @param { Response } res - Resposta HTTP
 * @param { NextFunction } next - Próximo middleware
 * @returns { Response }
 */
function remove(req, res, next) {
  try {
    const { id: agenteId } = z
      .object({
        id: z.uuid("O campo 'id' deve ser um UUID válido."),
      })
      .parse(req.params);

    const agente = agentesRepository.findById(agenteId);

    if (!agente) {
      return next(createError(404, { agente_id: `Agente não encontrado.` }));
    }

    agentesRepository.remove(agenteId);

    res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export const agentesController = {
  index,
  show,
  create,
  update,
  patch,
  remove,
};
