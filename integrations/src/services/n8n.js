const axios = require('axios');

class N8NClient {
  constructor(webhookUrl) {
    if (!webhookUrl) {
      throw new Error('N8N Webhook URL is required');
    }

    this.webhookUrl = webhookUrl;

    this.client = axios.create({
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ N8N Client initialized:', this.webhookUrl);
  }

  /**
   * Send an event to N8N webhook
   * @param {string} eventType - Type of event (e.g., 'whaticket_event', 'new_message')
   * @param {object} payload - Event payload data
   * @returns {Promise<object>} Response data
   */
  async sendEvent(eventType, payload) {
    try {
      console.log(`📤 Sending event to N8N: ${eventType}`);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await this.client.post(this.webhookUrl, {
        eventType,
        timestamp: new Date().toISOString(),
        data: payload
      });

      console.log(`✅ Event sent successfully to N8N`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error sending event to N8N:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Send a custom webhook request to N8N
   * @param {object} data - Custom data to send
   * @returns {Promise<object>} Response data
   */
  async sendCustom(data) {
    try {
      console.log(`📤 Sending custom data to N8N`);
      console.log('Data:', JSON.stringify(data, null, 2));

      const response = await this.client.post(this.webhookUrl, data);

      console.log(`✅ Custom data sent successfully to N8N`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error sending custom data to N8N:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }
}

module.exports = N8NClient;
