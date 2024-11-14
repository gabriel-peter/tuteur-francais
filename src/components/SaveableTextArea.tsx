"use client";
import { Button } from "@/components/catalyst-ui/button";
import { ErrorMessage } from "@/components/catalyst-ui/fieldset";
import { Textarea } from "@/components/catalyst-ui/textarea";
import { RequestState } from "@/components/LoadingButton";
import { Text } from "@/components/catalyst-ui/text";
import React, { useState, useEffect } from "react";

export function SaveableTextArea({ text: textProp, saveText }: { text: string; saveText: (x: string) => Promise<string>; }) {
    const [text, setText] = useState<string>(textProp);
    const [isEditing, setIsEditing] = useState<boolean>(text === "");
    const [loadState, setLoadState] = useState<RequestState>("IDLE");
    function loadableSaveText(newText: string) {
        setLoadState("LOADING");
        setIsEditing(false);
        saveText(newText)
            .then(() => setLoadState("IDLE"))
            .catch(() => setLoadState("FAILED"));
    }
    const handleDoubleClick = () => {
        setIsEditing((prev) => !prev); // Toggles the state on each double-click
    };
    useEffect(() => {
    });
    if (!isEditing) {
        return <Text
            className="whitespace-pre-wrap"
            onDoubleClick={handleDoubleClick}
        >
            {text}
        </Text>;
    }
    return (
        <>
            <Textarea name="description"
                rows={3}
                value={text}
                onChange={e => setText(e.currentTarget.value)}
                // onKeyDownCapture={e => handleKeyDown(e, () => loadableSaveText(e.currentTarget.value))}
                invalid={loadState === "FAILED"} />
            {loadState === "FAILED" && <ErrorMessage>Save Failed</ErrorMessage>}
            <Button disabled={loadState === "LOADING"} onClick={() => loadableSaveText(text)}>Save</Button>
            <Button plain onClick={() => { setText(textProp); setIsEditing(false) }}>Cancel</Button>
        </>
    );
}
