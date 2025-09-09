import { Metadata } from 'next';
import React from 'react';

interface InternalLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Fenix App - Módulo Interno',
};

export default function InternalLayout({ children }: InternalLayoutProps) {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}