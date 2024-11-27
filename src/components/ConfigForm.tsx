import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { Save } from 'lucide-react';

interface ConfigFormProps {
  onConfigSaved: () => void;
}

export function ConfigForm({ onConfigSaved }: ConfigFormProps) {
  const { setConfig, config } = useConfigStore();
  const [formData, setFormData] = React.useState({
    apiKey: config?.apiKey || '',
    phoneNumberId: config?.phoneNumberId || '',
    businessAccountId: config?.businessAccountId || '',
    webhookVerifyToken: config?.webhookVerifyToken || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(formData);
    onConfigSaved();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">WhatsApp Business API Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number ID</label>
          <input
            type="text"
            value={formData.phoneNumberId}
            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumberId: e.target.value }))}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Business Account ID</label>
          <input
            type="text"
            value={formData.businessAccountId}
            onChange={(e) => setFormData(prev => ({ ...prev, businessAccountId: e.target.value }))}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Webhook Verify Token</label>
          <input
            type="text"
            value={formData.webhookVerifyToken}
            onChange={(e) => setFormData(prev => ({ ...prev, webhookVerifyToken: e.target.value }))}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Configuration
        </button>
      </form>
    </div>
  );
}