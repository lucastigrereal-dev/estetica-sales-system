require('dotenv').config();
const express = require('express');
const WhaticketAPI = require('./services/whaticket');
const N8NClient = require('./services/n8n');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Initialize services
const whaticketAPI = new WhaticketAPI(
  process.env.WHATICKET_API_URL,
  process.env.WHATICKET_TOKEN
);

const n8nClient = new N8NClient(process.env.N8N_WEBHOOK_URL);

// Routes
app.post('/webhook/whaticket', async (req, res) => {
  try {
    console.log('📥 Received Whaticket webhook event');

    const event = req.body;

    // Forward event to N8N
    await n8nClient.sendEvent('whaticket_event', event);

    res.status(200).json({
      success: true,
      message: 'Event received and forwarded to N8N'
    });
  } catch (error) {
    console.error('❌ Error processing Whaticket webhook:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/callback/n8n', async (req, res) => {
  try {
    console.log('📥 Received N8N callback');

    const { ticketId, message, action, data } = req.body;

    if (action === 'send_message' && ticketId && message) {
      await whaticketAPI.sendMessage(ticketId, message);
      console.log(`✅ Message sent to ticket ${ticketId}`);
    }

    if (action === 'update_ticket' && ticketId && data) {
      await whaticketAPI.updateTicket(ticketId, data);
      console.log(`✅ Ticket ${ticketId} updated`);
    }

    res.status(200).json({
      success: true,
      message: 'Callback processed successfully'
    });
  } catch (error) {
    console.error('❌ Error processing N8N callback:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'whaticket-bridge',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Whaticket Bridge server running on port ${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook/whaticket`);
  console.log(`📡 Callback endpoint: http://localhost:${PORT}/callback/n8n`);
});
