"use client"
import { useState } from "react";
import { Divider } from "../../components/catalyst-ui/divider";
import { Heading } from "../../components/catalyst-ui/heading";
import FlashCardMaker from "./flash-maker";
import { Button } from "@/components/catalyst-ui/button";
import { TermTuple } from "@/data/types";
import { advancedTermTuples } from "../../data/term-tuples";

export default function FlashCardHome() {
    return (
        <div>
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
                <Heading>Flash Cards</Heading>
                <div className="flex gap-4">
                    <Button href="/flashcards/quiz">Quiz</Button> 
                    <FlashCardMaker />
                </div>
            </div>
            <Divider />
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">

                <CardGrid>
                    {advancedTermTuples.map((item, index) => <Card item={item} key={index}/>)}
                </CardGrid>
            </div>
        </div>)
}

export const CardGrid = ({ children }: { children: Readonly<React.ReactNode> }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {children}
            </div>
        </div>
    );
};

export const Card = ({ item}: { item: TermTuple }) => {
    const [isFlipped, flip] = useState(false);
    return (
        <div
        onClick={() => flip(!isFlipped)}
        className="rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105"
    >
        <h2 className="text-xl font-semibold mb-2">{isFlipped ? item.secondTerm.word : item.firstTerm.word}</h2>
    </div>
    )

}

