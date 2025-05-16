"use client";

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import React, { use } from 'react';

const componentsMap: Record<string, React.ComponentType<any>> = {
    navbar: dynamic(() => import('@/components/nav/sidebar')),
    sidebar: dynamic(() => import('@/components/nav/sidebar')),
    loading: dynamic(() => import('@/components/loading')),
    cardsList: dynamic(() => import('@/components/record/cardsList')),
    cardLinked: dynamic(() => import('@/components/record/card/linked')),
    preview: dynamic(() => import('@/components/record/card/preview')),
    genericComponent: dynamic(() => import('@/components/genericComponent')),
    cardTabs: dynamic(() => import('@/components/record/card/tabs')),
    cardFields: dynamic(() => import('@/components/record/card/fields')),
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
