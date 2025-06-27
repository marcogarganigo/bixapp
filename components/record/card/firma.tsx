import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axiosInstanceClient from '@/utils/axiosInstanceClient';

interface PropsInterface {
  recordid: string;
}

function Firma({ recordid }: PropsInterface) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [drawing, setDrawing] = useState(false);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const width = wrapper.clientWidth;
        const height = wrapper.clientHeight;

        // Set dimensioni in pixel (risoluzione reale)
        canvas.width = width;
        canvas.height = height;

        // Set dimensioni CSS (per evitare distorsioni)
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        contextRef.current = ctx;
    }, []);

    const getX = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): number => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;

        if ('touches' in e && e.touches.length > 0) {
            return e.touches[0].clientX - canvas.getBoundingClientRect().left;
        }
        if ('clientX' in e) {
            return e.clientX - canvas.getBoundingClientRect().left;
        }
        return 0;
    };

    const getY = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): number => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;

        if ('touches' in e && e.touches.length > 0) {
            return e.touches[0].clientY - canvas.getBoundingClientRect().top;
        }
        if ('clientY' in e) {
            return e.clientY - canvas.getBoundingClientRect().top;
        }
        return 0;
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(getX(e), getY(e));
        setDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!drawing) return;
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.lineTo(getX(e), getY(e));
        ctx.stroke();
    };

    const stopDrawing = () => {
        setDrawing(false);
    };

const saveServerImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
        toast.error('Canvas non disponibile');
        return;
    }

    const dataURL = canvas.toDataURL('image/png');

    try {
        const response = await axiosInstanceClient.post(
            '/postApi',
            {
                apiRoute: "sign_timesheet",
                recordid: recordid,
                image: dataURL,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            }
        );

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'timesheet_' + recordid + '.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error: any) {
        console.error('Errore durante il salvataggio o il download:', error);
        toast.error('Errore durante il salvataggio o il download');
    }
};



    const clearCanvas = () => {
        const ctx = contextRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div>
            <h2>Firma qui sotto:</h2>
            <br />
            <div
                ref={wrapperRef}
                style={{ width: '100%', height: '300px', border: '1px solid gray', touchAction: 'none' }}
            >
                <canvas
                    ref={canvasRef}
                    style={{ display: 'block' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <div style={{ marginTop: 10 }}>
                <button onClick={saveServerImage} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 mt-4 h-min xs:mb-2">
                    Conferma
                </button>
                <button onClick={clearCanvas} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 mt-4 h-min xs:mb-2">
                    Pulisci
                </button>
            </div>
        </div>
    );
}

export default Firma;
