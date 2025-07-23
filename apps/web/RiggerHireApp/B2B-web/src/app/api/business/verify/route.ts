import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';

// Initialize Supabase client
const supabase = createRouteHandlerClient<Database>({ cookies });

export async function POST(request: Request) {
  try {
    const { businessId, abn, licenseUrl, insuranceUrl } = await request.json();

    // 1. Queue document verification job
    await fetch(process.env.DOCUMENT_VERIFICATION_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DOCUMENT_VERIFICATION_API_KEY}`
      },
      body: JSON.stringify({
        businessId,
        documents: [
          { type: 'license', url: licenseUrl },
          { type: 'insurance', url: insuranceUrl }
        ]
      })
    });

    // 2. Queue ABN verification job
    await fetch(process.env.ABN_VERIFICATION_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABN_VERIFICATION_API_KEY}`
      },
      body: JSON.stringify({
        businessId,
        abn
      })
    });

    // 3. Send notification email
    await fetch(process.env.EMAIL_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        type: 'BUSINESS_REGISTRATION_RECEIVED',
        businessId
      })
    });

    return NextResponse.json({
      success: true,
      message: 'Verification process initiated'
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to initiate verification process'
    }, { status: 500 });
  }
}
