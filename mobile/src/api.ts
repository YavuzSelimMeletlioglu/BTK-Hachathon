import axios, { AxiosError } from 'axios';
import { ApiResponse } from './types';

const base_url = "http://127.0.0.1:5000/api/";

const axiosInstance = axios.create({
    baseURL: base_url,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function get<T = any, D = any>(
    url: string,
    params?: D
): Promise<ApiResponse<T> | undefined> {
    try {
        const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        alertError(err);
    }
}

export async function post<T = any>(
    url: string,
    params: any
): Promise<ApiResponse<T> | undefined> {
    try {
        const response = await axiosInstance.post<ApiResponse<T>>(url, params);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        alertError(err);
    }
}

export const deleteRequest = async (url: string, data?: any) => {
    try {
        const response = await axiosInstance.delete(url, {
            data: data,
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        alertError(err);
    }
};

const alertError = (err: AxiosError) => {
    if (err.response) {
        if (err.response.status === 429) {
            alert("Çok fazla istek attınız. 2 dakika bekleyiniz.")
        } else if (err.response.status === 422) {
            alert("Kullanıcı bilgilerini kontrol ediniz.")
        } else if (err.response.status === 500) {
            alert("Sunucuda bir hata var. Yetkili kişiyle irtibata geçiniz.")
        } else if (err.response.status !== 401) {
            alert(err.message)
        }
    }
}