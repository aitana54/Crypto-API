import express, { Router } from "express";
import { assetRouter } from "./assets.routes";
import { errorMiddleware } from "../middlewares/error.middleware";
import { transactionRouter } from "./transaction.routes";
import { portfolioRouter } from "./portfolio.routes";
import { userRouter } from "./user.routes";
import { authRouter } from "./auth.routes";

export const baseRouter = Router();

baseRouter.use(express.json());

baseRouter.use('/users', userRouter);
baseRouter.use('/assets', assetRouter);
baseRouter.use('/transactions', transactionRouter);
baseRouter.use('/portfolio', portfolioRouter);
baseRouter.use('/auth', authRouter);

baseRouter.use(errorMiddleware);