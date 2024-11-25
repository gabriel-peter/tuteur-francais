"use client"
import { getConjugaison, VerbMode, VerbTense } from "@/clients/reserso-server";
import { modes, tensePerMode } from "@/clients/reverso-types";
import { Button } from "@/components/catalyst-ui/button";
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "@/components/catalyst-ui/description-list";
import { Divider } from "@/components/catalyst-ui/divider";
import { Heading, Subheading } from "@/components/catalyst-ui/heading";
import { Navbar, NavbarSection, NavbarItem } from "@/components/catalyst-ui/navbar";
import PageHeader from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { SearchBar } from "../../../components/SearchBar";
import { StarIcon } from "@heroicons/react/24/outline";
import { SimpleTranslation } from "./SimpleTranslation";
import { createConjugaisonTerm, findConjugaisonTerm } from "@/db/models/conjugaison/actions";

export default function Conjugaison() {
    const [verb, setVerb] = useState<string>("")
    const [conjugaisons, setConjugaisons] = useState<VerbMode>()
    useEffect(() => {
        console.log("NEW SEARCH")
        findConjugaisonTerm(verb).then(console.log).then(searchResult => {
            // if(searchResult) {

            // } else {
            //     createConjugaisonTerm({
            //         term: Ter
            //     })
            // }
            
        })
    }, [verb])
    console.log(conjugaisons)
    return (<div>
        <br />
        <SearchBar setTextValue={setVerb} textValue={verb} searchAction={() => getConjugaison("french", verb).then(setConjugaisons)} />
        {conjugaisons && verb &&
            <div className="grid grid-cols-2"><SimpleTranslation word={verb} /> <ActionBar verb={verb} /></div>}
        {conjugaisons && Object.keys(conjugaisons).map((modeKey: string) => {
            return (<>
                <Heading>{modeKey}</Heading>
                <Divider />
                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {
                        Object.keys(conjugaisons[modeKey]).map(tenseKey =>
                            <li className="col-span-1 divide-y divide-gray-200 rounded-lg shadow">
                                <ConjugaisonTenseDescriptionList verbTense={{ tense: tenseKey, conjugaisons: conjugaisons[modeKey][tenseKey] }} />
                            </li>
                        )
                    }
                </ul>
            </>
            )
        })
        }
    </div>)
}

export function ActionBar({ verb }: { verb: string }) {
    const [isFaved, setIsFaved] = useState<boolean>(false);
    useEffect(() => {

    }, [verb])
    function makeFavorite() {

    }
    return (
        <div>
            <Button onClick={() => { }}><StarIcon /></Button>
        </div>
    )
}

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