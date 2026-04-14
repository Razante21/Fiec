import { NextResponse } from 'next/server';
import { getAppsScriptUrl, setAppsScriptUrl } from '@/models/config';
import { getBearerToken, verifySessionToken } from '@/lib/auth-server';

export async function GET(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session || session.nivel !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

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
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session || session.nivel !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

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
