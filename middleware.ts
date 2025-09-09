import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Obtener la cookie `login`
    const loginCookie = req.cookies.get('login')?.value; // Extraer el valor de la cookie

    // Si no está autenticado y no está en la página de login, redirigir
    if (loginCookie !== 'true' && !req.nextUrl.pathname.startsWith('/autenticar')) {
        console.log('No encontro la cookie')
        return NextResponse.redirect(new URL('/autenticar', req.url));
    }

    return NextResponse.next(); // Permitir acceso si está autenticado
}

// Configurar las rutas protegidas
export const config = {
    matcher: [
        '/administrar/:path*',
        '/certificado/:path*',
        '/inicio/:path*',
        '/reporte/:path*'
    ],
};
