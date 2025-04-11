import config from './config';
import express, { NextFunction, Request, Response } from 'express';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes/index';
import { ApiException } from 'util/exceptions/ApiException';

const app = express();
//Chain of Responsibilities

//config helmet
app.use(helmet());
//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//config cors
app.use(cors());

//add middleware
app.use(requestLogger);

//config routes
app.use('/', routes);

//handling 404 erros
app.use((req, res) => {
   res.status(404).json({ error: "Not Found" });
});

//Error handler

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   if (err instanceof ApiException) {
       const apiExeption = err as ApiException;
       logger.error("API Exception of status %d: %s", apiExeption.status, err.message);
       res.status(apiExeption.status).json({ error: err.message });
   } else {
       logger.error("Unhandled Error: %s", err.message);
       res.status(500).json({ error: "Internal Server Error" });
   }
});

app.listen(config.port,config.host,()=>{
   logger.info('Server is running on http://%s:%d', config.host, config.port);
})


