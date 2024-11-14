"use client"
import { getConjugaison, VerbMode, VerbTense } from "@/clients/reserso-server";
import { modes, tensePerMode } from "@/clients/reverso-types";
import { Button } from "@/components/catalyst-ui/button";
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "@/components/catalyst-ui/description-list";
import { Divider } from "@/components/catalyst-ui/divider";
import { Heading, Subheading } from "@/components/catalyst-ui/heading";
import { Navbar, NavbarSection, NavbarItem } from "@/components/catalyst-ui/navbar";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { SearchBar } from "../../../components/SearchBar";

export default function Conjugaison() {
    const [verb, setVerb] = useState<string>()
    const [conjugaisons, setConjugaisons] = useState<VerbMode>()
    console.log(conjugaisons)
    return (<div>
        <SearchBar setTextValue={setVerb} textValue={verb} searchAction={() => getConjugaison("french", verb).then(setConjugaisons)} />
        {conjugaisons && Object.keys(conjugaisons).map((modeKey: string) => {
            return (<>
                <Heading>{modeKey}</Heading>
                <Divider />
                {
                    Object.keys(conjugaisons[modeKey]).map(tenseKey =>

                        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                            <ConjugaisonTenseDescriptionList verbTense={{ tense: tenseKey, conjugaisons: conjugaisons[modeKey][tenseKey] }} />
                        </div>
                    )
                }
            </>
            )
        })
        }
    </div>)
}

// export function ConjugaisonModeDescriptionList({verbMode}: {verbMode: VerbMode}) {
//     return verbMode.tenses.map(verbTense => <ConjugaisonTenseDescriptionList verbTense={verbTense}/>)
// }

export function ConjugaisonTenseDescriptionList({ verbTense }: { verbTense: { tense: string, conjugaisons: string[] } }) {
    return (
        <div>

            <Subheading>{verbTense.tense}</Subheading>
            <DescriptionList>
                {verbTense.conjugaisons.map((c, i) => {
                    const [subject, verb] = c.split(' ');
                    return (<><DescriptionTerm>{subject}</DescriptionTerm>
                        <DescriptionDetails>{verb}</DescriptionDetails></>)
                })}
            </DescriptionList>
        </div>
    );
}