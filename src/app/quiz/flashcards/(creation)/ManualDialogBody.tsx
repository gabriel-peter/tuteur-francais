"use client";

import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { Input } from "@/components/catalyst-ui/input";
import { Quiz, TermTuple } from "@/db/types";
import { cloneElement, isValidElement, useState } from "react";
import { QuizPartial, TermTuplePreview } from "./TermTuplePreview";
import { createQuizAction } from "@/db/actions";
import { handleKeyDown } from "@/app/utils";
import { reverso, toTermTuple } from "@/clients/reverso";
import { RequestState } from "@/components/LoadingButton";
import { Button } from "@/components/catalyst-ui/button";
import { Heading } from "@/components/catalyst-ui/heading";

export function ManualDialogBody() {
    const [manualQuiz, setManualQuiz] = useState<{ title: string, terms: TermTuple[] }>({
        title: "Untitled Manual",
        terms: []
    });

    function createQuiz(partial: QuizPartial) {
        return createQuizAction({
            title: partial.title,
            items: partial.terms,
            state: "NEW"
        });
    }

    async function updateTitle(newTitle: string) {
        setManualQuiz({ ...manualQuiz, title: newTitle })
    }

    return (<>
        <EditableChildWithInput title={manualQuiz.title} saveTitle={updateTitle}>
            <Heading>{manualQuiz.title}</Heading>
        </EditableChildWithInput>
        <InputTranslator label="From English" from="en" to="fr" action={(termTuple) => setManualQuiz({ ...manualQuiz, terms: [...manualQuiz.terms, termTuple] })} />
        <InputTranslator label="From French" from="fr" to="en" action={(termTuple) => setManualQuiz({ ...manualQuiz, terms: [...manualQuiz.terms, termTuple] })} />

        {manualQuiz && <TermTuplePreview
            item={manualQuiz}
            createQuiz={createQuiz}
        />}
    </>);
}

export function EditableChildWithInput({ title: titleProp, saveTitle: updateObject, buttonSuite, children }: { title: string; saveTitle: (newTitle: string) => Promise<void>; buttonSuite?: React.ReactElement[]; children: React.ReactNode; }) {
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
            onDoubleClick: handleDoubleClick,
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
                    <Button plain onClick={() => { setIsEditing(false); setTitle(titleProp) }}>
                        Cancel
                    </Button>
                </>}
        </>

    );
}

function FrenchInputTranslator() {

}

function InputTranslator({
    action,
    from,
    to,
    label
}: {
    action: (x: TermTuple) => void,
    from: string,
    to: string,
    label: string
}) {

    function translate(word: string) {
        return reverso(word, "fr", "en").then(response => toTermTuple(word, response)).then(action)
    }

    return (
        <Field>
            <Label>{label}</Label>
            <Input
                name="unknown_word"
                onKeyDown={(e) => handleKeyDown(e, () => translate(e.currentTarget.value))}
            />
        </Field>
    )
}
