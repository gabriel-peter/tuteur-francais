"use client";
import { handleKeyDown } from "@/app/utils";
import { reverso, toTermTuple } from "@/clients/reverso";
import { Input } from "@/components/catalyst-ui/input";
import { TermTuple } from "@/db/types";

export function InputTranslator({
    action, from, to,
}: {
    action: (x: TermTuple) => void;
    from: string;
    to: string;
}) {

    function translate(word: string) {
        return reverso(word, from, to).then(response => toTermTuple(word, response)).then(action);
    }

    return (
        <Input
            name="unknown_word"
            onKeyDown={(e) => handleKeyDown(e, () => translate(e.currentTarget.value))} />
    );
}
