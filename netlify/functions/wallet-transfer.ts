import type { Handler } from '@netlify/functions';

export const handler: Handler = async () => ({
  statusCode: 200,
  body: 'transfer simulated',
});
