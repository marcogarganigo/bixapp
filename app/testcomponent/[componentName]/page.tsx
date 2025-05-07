"use client"; // Indica che questo è un client component

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import React, { use } from 'react';
import { Sidebar } from 'lucide-react';

// Mappa dei componenti disponibili (anche in sotto-cartelle)
const componentsMap: Record<string, React.ComponentType<any>> = {

    navbar: dynamic(() => import('@/components/nav/navbar')),
};

export default function DynamicComponentPage({ params }: { params: Promise<{ componentName: string }> }) {
    const { componentName } = use(params); // Usa React.use() per sbloccare params

    // Trova il componente nella mappa
    const Component = componentsMap[componentName];

    if (!Component) {
        return notFound(); // Se il componente non esiste, mostra la pagina 404
    }

    return (
        <div>
            {/*<h1 className='text-red-600'>Componente: {componentName}</h1><br/><br/> */}
            <Component /> {/* Renderizza il componente senza passare props */}
        </div>
    );
}
