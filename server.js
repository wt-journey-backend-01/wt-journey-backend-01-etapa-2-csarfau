import express from 'express';
import './scripts/populate.js';
import { agentesRouter } from './routes/agentesRoutes.js';
import { casosRouter } from './routes/casosRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/agentes', agentesRouter);
app.use('/casos', casosRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
