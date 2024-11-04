"use client";
import { Button } from "@/components/catalyst-ui/button";
import { useState } from "react";

export type RequestState = "IDLE" | "LOADING" | "FAILED" | "SUCCESS";
export function LoadingButton<T>({ action, requestStateMap }: { action: () => Promise<T>; requestStateMap: Record<RequestState, string>; }) {
    const [requestState, setRequestState] = useState<RequestState>("IDLE");
    return (
        <Button onClick={() => {
            setRequestState("LOADING");
            action().then(() => setRequestState("SUCCESS")).catch(() => setRequestState("FAILED"));
        }}>{requestStateMap[requestState]}
        </Button>
    );
}
