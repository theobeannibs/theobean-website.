import type { Handler } from '@netlify/functions';

export const handler: Handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ address: '0x0' }),
});
