import axios from 'axios';

export interface DhlRateRequest {
    origin: {
        city: string;
        postalCode: string;
        countryCode: string;
    };
    destination: {
        city: string;
        postalCode: string;
        countryCode: string;
    };
    packages: Array<{
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
    }>;
}

export class DhlService {
    private static API_URL = process.env.DHL_ENV === 'production'
        ? 'https://express.api.dhl.com/mydhlapi'
        : 'https://express.api.dhl.com/mydhlapi/test';

    static async getRates(request: DhlRateRequest) {
        const apiKey = process.env.DHL_API_KEY;
        const apiSecret = process.env.DHL_API_SECRET;
        const accountNumber = process.env.DHL_ACCOUNT_NUMBER;

        if (!apiKey || !apiSecret) {
            throw new Error('DHL API credentials not configured');
        }

        try {
            // MyDHL API v2 Rates Request
            const response = await axios.post(`${this.API_URL}/rates`, {
                customerDetails: {
                    shipperDetails: {
                        postalCode: request.origin.postalCode,
                        cityName: request.origin.city,
                        countryCode: request.origin.countryCode
                    },
                    receiverDetails: {
                        postalCode: request.destination.postalCode,
                        cityName: request.destination.city,
                        countryCode: request.destination.countryCode
                    }
                },
                accounts: [
                    {
                        number: accountNumber,
                        type: "shipper"
                    }
                ],
                plannedShippingDateAndTime: new Date(Date.now() + 86400000).toISOString().split('.')[0] + ' GMT+00:00',
                unitOfMeasurement: 'metric',
                isCustomsDeclarable: false,
                packages: request.packages.map((p, index) => ({
                    weight: p.weight || 0.5,
                    dimensions: {
                        length: p.dimensions?.length || 10,
                        width: p.dimensions?.width || 10,
                        height: p.dimensions?.height || 10
                    }
                }))
                }, {
                headers: {
                    'API-Key': apiKey,
                    'Message-Reference': `ADS-${Date.now()}`,
                    'Message-Reference-Date': new Date().toUTCString(),
                    'Accept': 'application/json'
                },
                auth: {
                    username: apiKey,
                    password: apiSecret
                }
            });

            return response.data;
        } catch (error: any) {
            const errorDetail = error.response?.data || error.message;
            const statusCode = error.response?.status;
            console.error(`DHL API Error [${statusCode}]:`, JSON.stringify(errorDetail, null, 2));
            // Return empty products instead of throwing to avoid breaking checkout
            return { products: [] };
        }
    }
}
