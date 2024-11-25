"use client";
import { reverso, TranslationResponse } from "@/clients/reverso";
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "@/components/catalyst-ui/description-list";
import { useState, useEffect } from "react";


export function SimpleTranslation({ word }: { word?: string; }) {
    const [tranduction, setTranduction] = useState<string>();
    useEffect(() => {
        if (word) {
            reverso(word, "fr", "en").then((res: TranslationResponse) => setTranduction(res.translation[0]));
        }
    }, [word]);
    if (word) {
        return (
            <DescriptionList>
                <DescriptionTerm>{word}</DescriptionTerm>
                <DescriptionDetails>to {tranduction}</DescriptionDetails>
            </DescriptionList>
        );
    }
}
