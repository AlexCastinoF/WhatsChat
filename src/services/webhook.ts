import type { Message } from '../types/api';

export const handleWebhook = (data: any): Message | null => {
  try {
    if (data.object === 'whatsapp_business_account') {
      const entry = data.entry[0];
      const changes = entry.changes[0];
      const value = changes.value;

      if (value.messages && value.messages[0]) {
        const message = value.messages[0];
        
        return {
          id: message.id,
          from: message.from,
          to: value.metadata.display_phone_number,
          content: message.text?.body || '',
          timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
          type: 'text',
          status: 'received'
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error processing webhook:', error);
    return null;
  }
};