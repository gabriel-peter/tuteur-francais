"use client";
import { Button } from "@/components/catalyst-ui/button";
import { useState } from "react";

export type RequestState = "IDLE" | "LOADING" | "FAILED" | "SUCCESS";
export function LoadingButton<T>({ action, requestStateMap, staticTitle }: { action: () => Promise<T>; requestStateMap?: Record<RequestState, string>; staticTitle?: string }) {
    const [requestState, setRequestState] = useState<RequestState>("IDLE");
    return (
        <Button
            disabled={requestState === "LOADING"}
            onClick={() => {
                setRequestState("LOADING");
                action().then(() => setRequestState("SUCCESS")).catch(() => setRequestState("FAILED"));
            }}>{staticTitle || requestStateMap && requestStateMap[requestState] || "Unnamed"}
        </Button>
    );
}
