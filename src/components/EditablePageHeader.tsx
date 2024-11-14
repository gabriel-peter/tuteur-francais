"use client";
import { Button } from "@/components/catalyst-ui/button";
import { Divider } from "@/components/catalyst-ui/divider";
import { Heading } from "@/components/catalyst-ui/heading";
import { Input } from "@/components/catalyst-ui/input";
import { RequestState } from "@/components/LoadingButton";
import React, { useState } from "react";


export function EditablePageHeader({ title: titleProp, saveTitle: updateObject, buttonSuite, children }: { title: string; saveTitle: (newTitle: string) => Promise<void>; buttonSuite?: React.ReactElement[]; children: React.ReactNode; }) {
    const [title, setTitle] = useState(titleProp);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loadState, setLoadState] = useState<RequestState>("IDLE");
    const handleDoubleClick = () => {
        setIsEditing((prev) => !prev); // Toggles the state on each double-click
    };
    function saveTitle(newTitle: string) {
        setLoadState("LOADING");
        setIsEditing(false);
        updateObject(newTitle)
            .then(() => setLoadState("IDLE"))
            .catch(() => setLoadState("FAILED"));
    }
    return (
        <div>
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
                {!isEditing ? <Heading onDoubleClick={handleDoubleClick}>{title}</Heading> :
                    <>
                    <Input value={title} onChange={e => setTitle(e.currentTarget.value)} />
                    <Button disabled={loadState === "LOADING"} onClick={() => saveTitle(title)}>Save</Button>
                    <Button plain onClick={() => { setIsEditing(false); setTitle(titleProp)}}>
                        Cancel
                    </Button>
                    </>}
                <div className="flex gap-4">
                    {buttonSuite}
                </div>
            </div>
            <Divider />
            <div
            >
                {children}
            </div>
        </div>
    );
}
