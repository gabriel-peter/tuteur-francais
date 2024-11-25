"use client";
import { Button } from "@/components/catalyst-ui/button";
import { Input } from "@/components/catalyst-ui/input";
import { RequestState } from "@/components/LoadingButton";
import { useState, isValidElement, cloneElement } from "react";


export function EditableChildWithInput({ title: titleProp, saveTitle: updateObject, children }: { title: string; saveTitle: (newTitle: string) => Promise<void>; children: React.ReactNode; }) {
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

    // Clone the children element and add the required props if it's a valid React element
    const editableTitle = isValidElement(children)
        ? cloneElement(children, {
            onDoubleClick: handleDoubleClick, // TODO fix type
            children: title, // Ensure the current title is displayed
        })
        : null;

    return (
        <>
            {!isEditing ?
                editableTitle :
                <>
                    <Input value={title} onChange={e => setTitle(e.currentTarget.value)} />
                    <Button disabled={loadState === "LOADING"} onClick={() => saveTitle(title)}>Save</Button>
                    <Button plain onClick={() => { setIsEditing(false); setTitle(titleProp); }}>
                        Cancel
                    </Button>
                </>}
        </>

    );
}
