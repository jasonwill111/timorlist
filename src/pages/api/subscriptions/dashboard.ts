// API endpoint to get subscription dashboard for a business
export const prerender = false;

import { getSubscriptionDashboard } from '@/lib/subscription';

function createErrorResponse(message: string, status = 400) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');

    if (!businessId) {
      return createErrorResponse('businessId is required');
    }

    const dashboard = await getSubscriptionDashboard(businessId);

    if (!dashboard) {
      return createErrorResponse('Business not found', 404);
    }

    return new Response(JSON.stringify({ success: true, data: dashboard }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[api/subscriptions/dashboard] Error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}