import axios from 'axios';

interface TokenResponse {
    token: string;
    subdomain: string;
}

export const getImmersiveToken = async (): Promise<TokenResponse> => {
    try {
        const response = await axios.get<TokenResponse>('/api/v1/immersive/token');
        return response.data;
    } catch (error) {
        console.error('Error fetching token', error);
        throw new Error('Failed to fetch Immersive Reader token.');
    }
};

export const getLibrary = async (): Promise<any[]> => {
    try {
        const response = await axios.get('/api/v1/immersive/library');
        return response.data;
    } catch (error) {
        console.error('Error fetching library', error);
        throw new Error('Failed to fetch library.');
    }
};
