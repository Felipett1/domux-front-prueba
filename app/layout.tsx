'use client';
import { LayoutProvider } from '../context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import AppFooter from '@/components/AppFooter';
import AppStyle from '@/components/AppStyle';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-dark-blue/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>
                        <AppStyle />
                        {children}
                        
                    </LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
