import { Request, Response, NextFunction } from "express";
import { PortFolioService } from "../services/portfolio.service";
import { handleControllerError } from "../utils/logger.helper";

export class PortfolioController {
    private readonly portfolioService = new PortFolioService();

    getPortfolio = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;

            const portfolio = await this.portfolioService.getPortfolio(userId);

            res.send({
                message: 'Portfolio fetched successfully',
                data: portfolio
            });

        } catch (error) {
            next(handleControllerError(error, 'Error fetching portfolio'));
        }
    }

}