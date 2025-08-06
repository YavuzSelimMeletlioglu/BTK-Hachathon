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

export const fetchYoutubeVideoId = async (recipeName: string): Promise<string | null> => {
    const API_KEY = 'AIzaSyApAkN1FMpeRS4idFhSlbiEaKjvyL6m8Ts';
    const query = encodeURIComponent(recipeName + ' tarifi');
    const maxResults = 1;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${query}&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const items = response.data.items;
        if (items.length > 0) {
            return items[0].id.videoId;
        } else {
            return null;
        }
    } catch (error) {
        console.error('YouTube API Hatası:', error);
        return null;
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