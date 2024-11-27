import axios, { AxiosError } from 'axios';
import { useConfigStore } from '../store/useConfigStore';
import type { WhatsAppResponse } from '../types/api';

const createApiClient = () => {
  const config = useConfigStore.getState().config;
  
  if (!config) {
    throw new Error('WhatsApp configuration not found');
  }

  return axios.create({
    baseURL: 'https://graph.facebook.com/v18.0',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
  });
};

export const sendMessage = async (to: string, message: string): Promise<WhatsAppResponse> => {
  try {
    const api = createApiClient();
    const config = useConfigStore.getState().config;

    const response = await api.post<WhatsAppResponse>(`/${config?.phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: message },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(
      axiosError.response?.data?.error?.message || 
      'Failed to send message'
    );
  }
};