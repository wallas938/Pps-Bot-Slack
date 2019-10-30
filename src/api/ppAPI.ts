var request = require('request-promise-cache');
const jwt = require('jsonwebtoken');

interface TokenFromBack {
    access_token: string
}

enum APIMethod {
    POST =  "POST",
    GET = "GET"

}

const formDev={
    "grant_type": "password", 
    "username": "awpps01", 
    "password": "hByHE2kf", 
    "client_id": "836a9d4b-abda-4105-ae34-bca1515a6443", 
    "client_secret": "kwf2k2vvlyQet2xkmdWrlf5qYyYe7JM13NvK9HzgoNv_MtPOCQ4MJ0AcrIj-IowVoIoAQfqW9GIr7ErnQgxAtQ"
    }
const formProd={
    "grant_type": "password", 
    "username": "awpps01", 
    "password": "hByHE2kf", 
    "client_id": "ae82f40f-8432-4451-a1d3-600ab76b5e28", 
    "client_secret": "3mIkcXF0mC3x1FDX3Wcnxp02ajxgcQtQ_GJgpCOax2J_POKzctLjcrxqoQ94hAVu1acUdCTqRLqT9_rOZTXVNQ"
}

class PPAPI {
    public token: string;

    constructor() {
        this.token=""
    }

    public async requestToBack(endpoint: string, method: APIMethod = APIMethod.GET,data?: any, cached:boolean=true): Promise<string> {
        const { URI_DEPLOYMENT } = process.env;
        endpoint = endpoint.replace(/^\/+/, '')
        
        if (this.token.length==0) {
            await this.getToken();
        }
        return request({
            url:`${URI_DEPLOYMENT}/${endpoint}`,
            method:method,
            cacheKey: `${URI_DEPLOYMENT}/${endpoint}`,
            cacheTTL: 3600,
            cacheLimit: 300,
            proxy: false,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                    'Authorization': `Bearer ${this.token}`,
                    "Content-Type": data ? "application/json" : undefined
            },
        });
    }

    public async getToken(){
        try {
            this.token =  await this.callToken(); 
        } catch (e) {
            console.log (e);
        }
    }


    private async callToken(): Promise<string> {
        const MODE = process.env.MODE;
        const res: string = await request({method:'POST', url:'https://idp.renault.com/nidp/oauth/nam/token', form: MODE=="DEV"? formDev :formProd
        });
        return Promise.resolve((JSON.parse(res) as TokenFromBack).access_token)
    }

};

const ppAPI = new PPAPI();
export { ppAPI, APIMethod };
