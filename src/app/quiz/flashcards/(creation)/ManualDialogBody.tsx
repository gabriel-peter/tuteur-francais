"use client";

import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { Quiz, TermTuple } from "@/db/types";
import { useState } from "react";
import { QuizPartial, TermTuplePreview } from "./TermTuplePreview";
import { createQuizAction } from "@/db/actions";
import { Heading } from "@/components/catalyst-ui/heading";
import { EditableChildWithInput } from "@/components/EditableChildWithInput";
import { InputTranslator } from "@/components/InputTranslator";

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
        <Field>
            <Label>From English</Label>
            <InputTranslator from="en" to="fr" action={(termTuple) => setManualQuiz({ ...manualQuiz, terms: [...manualQuiz.terms, termTuple] })} />
        </Field>

        <Field>
            <Label>From French</Label>
            <InputTranslator from="fr" to="en" action={(termTuple) => setManualQuiz({ ...manualQuiz, terms: [...manualQuiz.terms, termTuple] })} />
        </Field>

        {manualQuiz && <TermTuplePreview
            item={manualQuiz}
            createQuiz={createQuiz}
        />}
    </>);
}


