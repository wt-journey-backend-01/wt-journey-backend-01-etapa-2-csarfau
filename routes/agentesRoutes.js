import express from 'express';
import { agentesController } from '../controllers/agentesController.js';

const router = express.Router();

// GET /agentes → Lista todos os agentes.
router.get('/', agentesController.index);

// GET /agentes/:id → Retorna um agente específico.
router.get('/:id', agentesController.show);

// POST /agentes → Cadastra um novo agente com:
router.post('/', agentesController.create);

// PUT /agentes/:id → Atualiza os dados do agente por completo.
router.put('/:id', agentesController.update);

// PATCH /agentes/:id → Atualiza os dados do agente parcialmente.
router.patch('/:id', agentesController.patch);

// DELETE /agentes/:id → Remove o agente.
router.delete('/:id', agentesController.remove);

export const agentesRouter = router;
