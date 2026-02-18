"use client"
import { SessionProvider } from "next-auth/react";
import { FileUploadComponent } from "./fileUpload";

const authenticator = async () => {
    try {
        const response = await fetch("/api/imagekit_auth");
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <FileUploadComponent authenticator={authenticator} />
            {children}
        </SessionProvider>
    );
}