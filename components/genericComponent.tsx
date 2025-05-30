import React from 'react';
import LoadingComp from './loading';

const mode=process.env.NEXT_PUBLIC_MODE

interface GenericComponentProps<T> {
    title?: string | null;
    response?: T | null;
    loading?: boolean;
    error?: string | null;
    elapsedTime?: number | null;
    children: (data: T) => React.ReactNode;
}

const GenericComponent = <T,>({
    title ='',
    response,
    loading = false,
    error = null,
    elapsedTime = null,
    children,
}: GenericComponentProps<T>) => {
    if (loading) return <LoadingComp />;
    if (error) return <div>Errore: {error}</div>;

    const isVisible = mode === 'dev' || mode === 'test';

    return (
        <>
            <span className="relative">
                <span className={` absolute top-0 left-0 bg-black text-white text-xs px-2 py-1 rounded shadow-md 
                                ${!isVisible ? 'hidden' : ''} 
                                z-[9999] pointer-events-none`}>
                    Componente: <span className="text-red-600">{title}</span> {elapsedTime !== null && ` - Tempo: ${elapsedTime.toFixed(2)} ms`}
                </span>                
            </span>

            {children(response as T)}
        </>
    );
};

export default GenericComponent;
