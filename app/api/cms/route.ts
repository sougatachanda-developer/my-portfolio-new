import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_CMS_DATA } from '@/lib/data';
import { CMSData } from '@/lib/types';

const DATA_FILE_PATH = path.join(process.cwd(), 'lib', 'data.json');

// Initialize server-side Supabase client with SERVICE_ROLE_KEY for write security
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (url && key && !url.includes('your-project-id')) {
    return { client: createClient(url, key), keyUsed: key };
  }
  return null;
}

// Helper to load CMS data (Supabase first, fallback to data.json)
async function loadCMSData(): Promise<CMSData> {
  const sb = getSupabaseClient();

  if (sb?.client) {
    try {
      const { data, error } = await sb.client
        .from('portfolio_data')
        .select('content')
        .eq('id', 'main')
        .single();

      if (!error && data?.content) {
        return data.content as CMSData;
      } else if (error) {
        console.warn('Supabase fetch error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase fetch exception, falling back to local file:', e);
    }
  }

  // Fallback to local data.json
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(fileContent) as CMSData;
    }
  } catch (e) {
    console.error('Error reading data.json:', e);
  }
  return INITIAL_CMS_DATA;
}

// Helper to save CMS data (Saves to both Supabase PostgreSQL and local data.json)
async function saveCMSData(data: CMSData): Promise<{ success: boolean; cloudSaved: boolean; cloudError?: string }> {
  let cloudSaved = false;
  let cloudError: string | undefined = undefined;
  const sb = getSupabaseClient();

  if (sb?.client) {
    try {
      // Validate key format (Supabase API keys are JWT strings starting with eyJhbGciOi...)
      if (!sb.keyUsed.startsWith('eyJ')) {
        cloudError = `Invalid Supabase Key format. Your key starts with "${sb.keyUsed.substring(0, 15)}...". Supabase API keys are long JWT strings starting with "eyJhbGciOi...". Please copy the "anon public" or "service_role" key from Supabase Dashboard -> Settings -> API.`;
      } else {
        const { error } = await sb.client
          .from('portfolio_data')
          .upsert({ id: 'main', content: data, updated_at: new Date().toISOString() });

        if (!error) {
          cloudSaved = true;
        } else {
          console.error('Supabase upsert error details:', error);
          cloudError = `Supabase Error: ${error.message} (${error.code || 'RLS/Table Issue'})`;
        }
      }
    } catch (e: any) {
      console.error('Supabase save exception:', e);
      cloudError = `Supabase Exception: ${e?.message || 'Network error'}`;
    }
  } else {
    cloudError = 'Supabase client not initialized (missing URL or API Key in .env.local)';
  }

  // Always save locally to data.json as backup (creating directory & file if missing)
  let localSaved = false;
  try {
    const dirPath = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error('Error writing data.json:', e);
  }

  return {
    success: localSaved && (cloudSaved || !sb?.client),
    cloudSaved,
    cloudError
  };
}

export async function GET() {
  const data = await loadCMSData();
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  try {
    // Validate Admin Secret Key to ensure only authorized admin can edit
    const clientAdminKey = req.headers.get('x-admin-key');
    const expectedAdminKey = process.env.ADMIN_SECRET_KEY || 'super-secret-admin-key-change-in-production';

    if (clientAdminKey !== expectedAdminKey) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: Invalid Admin Secret Key. Please enter the correct key in the Admin Key input field.'
      }, { status: 401 });
    }

    const body = await req.json();
    const { data } = body;

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload format.' }, { status: 400 });
    }

    const result = await saveCMSData(data as CMSData);
    
    // If Supabase is configured but failed to save to cloud, fail with explicit cloud error
    if (!result.cloudSaved && result.cloudError) {
      return NextResponse.json({
        success: false,
        message: `Cloud Save Failed: ${result.cloudError}`
      }, { status: 400 });
    }

    if (result.cloudSaved) {
      return NextResponse.json({
        success: true,
        message: 'Portfolio content saved successfully to both Local Disk and Supabase Cloud!'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio content saved successfully to Local Disk!'
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: `Server error saving CMS data: ${err?.message || 'Unknown error'}`
    }, { status: 500 });
  }
}
