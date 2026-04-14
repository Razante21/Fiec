import { NextResponse } from 'next/server';
import { getAppsScriptUrl } from '@/models/config';

export async function GET() {
  try {
    const appsScriptUrl = await getAppsScriptUrl();
    return NextResponse.json({ success: true, data: { appsScriptUrl } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao buscar configuracao' },
      { status: 500 }
    );
  }
}
