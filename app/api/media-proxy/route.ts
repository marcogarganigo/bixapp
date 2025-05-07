import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
    const urlParam = req.nextUrl.searchParams.get("url");
    console.log("✅ Entrato nella API route");
    console.log("📦 urlParam:", urlParam);

    if (!urlParam) {
        console.log("❌ Nessun parametro URL");
        return new NextResponse("Missing URL parameter", { status: 400 });
    }
    
    let remoteUrl = `${API_BASE_URL}/commonapp/uploads/${urlParam}`;
    
    if (urlParam.startsWith("commonapp/static")) {
        remoteUrl = `${API_BASE_URL}/commonapp/tempfile/${urlParam}`;
    } 
    else{}
    
    console.log("🌐 remoteUrl:", remoteUrl);

    try {
        // Aggiunta header per forzare il bypass di cache eventuale lato backend/proxy
        const response = await fetch(remoteUrl, {
            method: "GET",
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
            },
        });

        console.log("🔁 fetch status:", response.status);

        if (!response.ok) {
            return new NextResponse("Failed to fetch remote image", { status: 500 });
        }

        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const buffer = await response.arrayBuffer();

        // Header per evitare cache lato browser/client/proxy
        return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Surrogate-Control": "no-store",
            },
        });
    } catch (error: any) {
        console.error("❗ Errore fetch:", error);
        return new NextResponse("Error fetching image", { status: 500 });
    }
}
