import { Router } from 'express';
import { DhlService } from '../Service/shipping/DhlService';

export class shippingRoutes {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/calculate-rates', async (req, res) => {
            try {
                const { origin, destination, packages } = req.body;
                
                if (!origin || !destination || !packages) {
                    return res.status(400).json({ error: 'Missing required shipping information' });
                }

                const rates = await DhlService.getRates({ origin, destination, packages });
                res.json(rates);
            } catch (error: any) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    public getShippingRoutes() {
        return this.router;
    }
}
