"use client";

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import React, { use } from 'react';

const componentsMap: Record<string, React.ComponentType<any>> = {

    navbar: dynamic(() => import('@/components/nav/sidebar')),
};

export default function DynamicComponentPage({ params }: { params: Promise<{ componentName: string }> }) {
    const { componentName } = use(params); 
    const Component = componentsMap[componentName];

    if (!Component) {
        return notFound();
    }

    return (
        <div>
            <Component /> 
        </div>
    );
}
