export function random(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
