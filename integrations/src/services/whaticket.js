const axios = require('axios');

class WhaticketAPI {
  constructor(apiUrl, token) {
    if (!apiUrl || !token) {
      throw new Error('Whaticket API URL and Token are required');
    }

    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.token = token;

    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Whaticket API initialized:', this.apiUrl);
  }

  /**
   * Send a message to a specific ticket
   * @param {string|number} ticketId - The ticket ID
   * @param {string} message - The message content
   * @returns {Promise<object>} Response data
   */
  async sendMessage(ticketId, message) {
    try {
      console.log(`📤 Sending message to ticket ${ticketId}`);

      const response = await this.client.post(`/messages/${ticketId}`, {
        body: message
      });

      console.log(`✅ Message sent successfully to ticket ${ticketId}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error sending message to ticket ${ticketId}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Update ticket information
   * @param {string|number} ticketId - The ticket ID
   * @param {object} data - Update data (status, userId, etc.)
   * @returns {Promise<object>} Response data
   */
  async updateTicket(ticketId, data) {
    try {
      console.log(`🔄 Updating ticket ${ticketId}`);
      console.log('Update data:', JSON.stringify(data, null, 2));

      const response = await this.client.put(`/tickets/${ticketId}`, data);

      console.log(`✅ Ticket ${ticketId} updated successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating ticket ${ticketId}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Get ticket information
   * @param {string|number} ticketId - The ticket ID
   * @returns {Promise<object>} Ticket data
   */
  async getTicket(ticketId) {
    try {
      console.log(`📥 Fetching ticket ${ticketId}`);

      const response = await this.client.get(`/tickets/${ticketId}`);

      console.log(`✅ Ticket ${ticketId} fetched successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching ticket ${ticketId}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }
}

module.exports = WhaticketAPI;
