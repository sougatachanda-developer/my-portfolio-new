import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, validateEmail, checkRateLimit, verifyCSRFToken } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous_client';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many contact requests from this IP. Please wait 60 seconds before trying again.'
        },
        { status: 429 }
      );
    }

    // 2. Parse Request Body
    const body = await req.json();
    const { name, email, message, csrfToken } = body;

    // 3. Verify CSRF Protection Token
    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Security validation failed: Invalid or expired CSRF token.'
        },
        { status: 403 }
      );
    }

    // 4. Input Validation & Anti-XSS Sanitization
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!sanitizedEmail || !validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!sanitizedMessage || sanitizedMessage.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Please enter a message with at least 10 characters.' },
        { status: 400 }
      );
    }

    // 5. Success Response
    return NextResponse.json(
      {
        success: true,
        message: `Thank you, ${sanitizedName}. Your message has been securely received. I will reply to ${sanitizedEmail} shortly.`,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error processing contact request.'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve fresh CSRF token
export async function GET() {
  const { generateCSRFToken } = await import('@/lib/security');
  const token = generateCSRFToken();
  return NextResponse.json({ csrfToken: token });
}
