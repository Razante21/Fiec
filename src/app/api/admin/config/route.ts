import { NextResponse } from 'next/server';
import { getAppsScriptUrl, setAppsScriptUrl } from '@/models/config';

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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const appsScriptUrl = (body?.appsScriptUrl || '').trim();

    if (!appsScriptUrl || !appsScriptUrl.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL do Apps Script invalida' },
        { status: 400 }
      );
    }

    await setAppsScriptUrl(appsScriptUrl);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao salvar configuracao' },
      { status: 500 }
    );
  }
}
