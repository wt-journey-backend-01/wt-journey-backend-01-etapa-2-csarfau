import express from 'express';
import { casosController } from '../controllers/casosController.js';

const router = express.Router();

// GET /casos → Lista todos os casos registrados.
router.get(['/', '/search'], casosController.index);

// GET /casos/:id → Retorna os detalhes de um caso específico.
router.get('/:id', casosController.show);

// GET /casos/:caso_id/agente → Retorna os dados completos do agente responsável por um caso específico.
router.get('/:id/agente', casosController.showResponsibleAgente);

// POST /casos → Cria um novo caso com os seguintes campos:
router.post('/', casosController.create);

// PUT /casos/:id → Atualiza os dados de um caso por completo.
router.put('/:id', casosController.update);

// PATCH /casos/:id → Atualiza os dados de um caso parcialmente.
router.patch('/:id', casosController.patch);

// DELETE /casos/:id → Remove um caso do sistema.
router.delete('/:id', casosController.remove);

export const casosRouter = router;
