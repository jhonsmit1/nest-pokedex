import { Injectable } from "@nestjs/common";
import { httpAdapter } from "../interfaces/http-adapter.interface";
import axios, { AxiosInstance } from 'axios';

@Injectable()
//si axios cambia solo se cambiar esta clase
export class axiosAdapter implements httpAdapter {
    private  axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const {data} = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error ('This is an error - check log')
        }
    }
}