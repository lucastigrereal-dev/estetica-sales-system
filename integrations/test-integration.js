const axios = require('axios');

const BRIDGE_URL = 'http://localhost:3001';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testHealthCheck() {
  log(colors.blue, '\n🔍 Test 1: Health Check');
  try {
    const response = await axios.get(`${BRIDGE_URL}/health`);
    log(colors.green, '✅ Health check passed');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    log(colors.red, '❌ Health check failed');
    console.error('Error:', error.message);
    return false;
  }
}

async function testNewMessageEvent() {
  log(colors.blue, '\n🔍 Test 2: New Message Event (Greeting)');
  try {
    const payload = {
      eventType: 'whaticket_event',
      data: {
        type: 'message',
        id: 101,
        body: 'Olá, bom dia!',
        fromMe: false,
        mediaUrl: null,
        ticket: {
          id: 123,
          status: 'open',
          userId: 1,
          contactId: 789
        },
        contact: {
          id: 789,
          name: 'João Silva',
          number: '5511999999999'
        }
      }
    };

    const response = await axios.post(
      `${BRIDGE_URL}/webhook/whaticket`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    log(colors.green, '✅ Message event processed');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    log(colors.red, '❌ Message event failed');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testPricingQuestion() {
  log(colors.blue, '\n🔍 Test 3: Pricing Question');
  try {
    const payload = {
      eventType: 'whaticket_event',
      data: {
        type: 'message',
        id: 102,
        body: 'Quanto custa o tratamento facial?',
        fromMe: false,
        ticket: {
          id: 124,
          status: 'open',
          userId: 1,
          contactId: 790
        },
        contact: {
          id: 790,
          name: 'Maria Santos',
          number: '5511888888888'
        }
      }
    };

    const response = await axios.post(
      `${BRIDGE_URL}/webhook/whaticket`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    log(colors.green, '✅ Pricing question processed');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    log(colors.red, '❌ Pricing question failed');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testSchedulingRequest() {
  log(colors.blue, '\n🔍 Test 4: Scheduling Request');
  try {
    const payload = {
      eventType: 'whaticket_event',
      data: {
        type: 'message',
        id: 103,
        body: 'Gostaria de agendar um horário',
        fromMe: false,
        ticket: {
          id: 125,
          status: 'open',
          userId: 1,
          contactId: 791
        },
        contact: {
          id: 791,
          name: 'Ana Paula',
          number: '5511777777777'
        }
      }
    };

    const response = await axios.post(
      `${BRIDGE_URL}/webhook/whaticket`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    log(colors.green, '✅ Scheduling request processed');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    log(colors.red, '❌ Scheduling request failed');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testAgentMessage() {
  log(colors.blue, '\n🔍 Test 5: Agent Message (Should Skip)');
  try {
    const payload = {
      eventType: 'whaticket_event',
      data: {
        type: 'message',
        id: 104,
        body: 'Resposta do atendente',
        fromMe: true, // Mensagem do agente
        ticket: {
          id: 126,
          status: 'open',
          userId: 1,
          contactId: 792
        },
        contact: {
          id: 792,
          name: 'Pedro Costa',
          number: '5511666666666'
        }
      }
    };

    const response = await axios.post(
      `${BRIDGE_URL}/webhook/whaticket`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    log(colors.green, '✅ Agent message handled (should skip auto-response)');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    log(colors.red, '❌ Agent message failed');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testClosedTicket() {
  log(colors.blue, '\n🔍 Test 6: Closed Ticket (Should Skip)');
  try {
    const payload = {
      eventType: 'whaticket_event',
      data: {
        type: 'message',
        id: 105,
        body: 'Mensagem para ticket fechado',
        fromMe: false,
        ticket: {
          id: 127,
          status: 'closed', // Ticket fechado
          userId: 1,
          contactId: 793
        },
        contact: {
          id: 793,
          name: 'Carlos Lima',
          number: '5511555555555'
        }
      }
    };

    const response = await axios.post(
      `${BRIDGE_URL}/webhook/whaticket`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    log(colors.green, '✅ Closed ticket handled (should skip auto-response)');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    log(colors.red, '❌ Closed ticket failed');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testStatusChange() {
  log(colors.blue, '\n🔍 Test 7: Ticket Status Change');
  try {
    const payload = {
      eventType: 'whaticket_event',
      data: {
        type: 'ticket_status_change',
        ticket: {
          id: 128,
          status: 'closed',
          userId: 1,
          closedAt: new Date().toISOString()
        }
      }
    };

    const response = await axios.post(
      `${BRIDGE_URL}/webhook/whaticket`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    log(colors.green, '✅ Status change processed');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    log(colors.red, '❌ Status change failed');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  log(colors.yellow, '\n╔═══════════════════════════════════════════════════╗');
  log(colors.yellow, '║  Whaticket Bridge - Integration Tests            ║');
  log(colors.yellow, '╚═══════════════════════════════════════════════════╝');

  const tests = [
    testHealthCheck,
    testNewMessageEvent,
    testPricingQuestion,
    testSchedulingRequest,
    testAgentMessage,
    testClosedTicket,
    testStatusChange
  ];

  const results = [];

  for (const test of tests) {
    const result = await test();
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
  }

  // Summary
  log(colors.yellow, '\n╔═══════════════════════════════════════════════════╗');
  log(colors.yellow, '║  Test Summary                                     ║');
  log(colors.yellow, '╚═══════════════════════════════════════════════════╝');

  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;

  console.log(`\nTotal Tests: ${results.length}`);
  log(colors.green, `Passed: ${passed}`);
  log(colors.red, `Failed: ${failed}`);

  if (failed === 0) {
    log(colors.green, '\n🎉 All tests passed! Integration is working correctly.');
  } else {
    log(colors.red, '\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Check if bridge is running
async function checkBridgeStatus() {
  try {
    await axios.get(`${BRIDGE_URL}/health`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  log(colors.blue, 'Checking if bridge is running...');

  const isRunning = await checkBridgeStatus();

  if (!isRunning) {
    log(colors.red, '\n❌ Bridge is not running!');
    log(colors.yellow, '\nPlease start the bridge first:');
    log(colors.yellow, '  cd integrations');
    log(colors.yellow, '  npm run dev\n');
    process.exit(1);
  }

  log(colors.green, '✅ Bridge is running\n');

  await runAllTests();
})();
