"use client";
import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { Select } from "@/components/catalyst-ui/select";
import { Text } from "@/components/catalyst-ui/text";
import { TermTuple } from "@/db/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { QuizPartial, TermTuplePreview } from "./TermTuplePreview";


export function ExternalSourceSelector(
    { label, recents, selectedIndex, setSelectedIndex, createQuiz }: { label: string; recents: QuizPartial[] | undefined; selectedIndex: number | undefined; setSelectedIndex: (x: number) => void; createQuiz: (item: QuizPartial) => Promise<any>; }) {
    return <>
        {recents ? (
            <Field>
                <Label>{label}</Label>
                <Select name="selected-item" value={selectedIndex} onChange={(e) => setSelectedIndex(Number.parseInt(e.currentTarget.value))}>
                    <option value={undefined}>--</option>
                    {recents.map((video, index) => <option key={index} value={index}>{video.title} [Terms:{video.terms?.length}]</option>)}
                </Select>
            </Field>
        ) :
            <Text>No videos have been annotated</Text>}
        {recents && selectedIndex != null && <TermTuplePreview
            item={recents[selectedIndex]}
            createQuiz={createQuiz}
        />
        }
    </>;
}

