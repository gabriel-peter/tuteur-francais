"use client"
import { Heading } from "@/app/catalyst-ui/heading";
import { useState } from "react";
import { advancedTermTuples, TermTuple } from "../page";
import { Divider } from "@/app/catalyst-ui/divider";
import * as Headless from '@headlessui/react'
import clsx from "clsx";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/app/catalyst-ui/dialog";
import { Field, Label } from "@/app/catalyst-ui/fieldset";
import { Button } from "@/app/catalyst-ui/button";
import { Input } from "@/app/catalyst-ui/input";
import { Text } from '@/app/catalyst-ui/text'
import { CheckIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";


const sizes = {
    xs: 'sm:max-w-xs',
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
}

export default function FlashCardQuiz({ items }: { items: TermTuple[] }) {
    const [currentItemIndex, setItemIndex] = useState(0)
    function advanceCard() {
        if (currentItemIndex === advancedTermTuples.length - 1) {
            console.log("QUIZ IS OVER")

        } else {
            setItemIndex(currentItemIndex + 1)
        }
    }
    return (
        <div>
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
                <Heading>Quiz</Heading>
                <div className="flex gap-4">
                    {/* <FlashCardMaker /> */}
                </div>
            </div>
            <Divider />
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
                <QuizPanel item={advancedTermTuples[currentItemIndex]} advanceCard={advanceCard} quizShown={true} setQuizShown={(x) => { }} />
            </div>
        </div>)
}

type QuestionState = "WAITING" | "CLUE" | "INCORRECT" | "CORRECT";

function QuizPanel({
    item,
    quizShown,
    setQuizShown,
    advanceCard
}: {
    item: TermTuple,
    quizShown: boolean,
    setQuizShown: (x: boolean) => void,
    advanceCard: () => void
}) {
    let [isOpen, setIsOpen] = useState(false)
    const [state, setState] = useState<QuestionState>("WAITING")
    const [guess, setGuess] = useState("");

    function checkGuess() {
        const formattedGuess = guess.replace(/\s*to\s*/g, "").replace(/\s+/g, "").toLowerCase();

        if (formattedGuess === item.secondTerm.word.toLowerCase()) {
            console.log("CORRECT")
            setState("CORRECT")
            advanceCard();
        } else {
            console.log("INCORRECT")
            setState("INCORRECT")
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            checkGuess();
        }
    }

    const dialogBody = () => {
        const textInput = <Field>
            <Input
                onChange={(e) => setGuess(e.target.value)}
                value={guess}
                name="guess"
                placeholder=""
                onKeyDown={handleKeyDown}
            />
        </Field>;
        switch (state) {
            case "WAITING": return textInput
            case "CLUE": return (
                <>
                    {textInput}
                    {item.firstTerm.examples?.map((example, index) => <Text key={index}>{example}</Text>)}
                </>
            )
            case "INCORRECT": return (
                <div className="relative mt-2 rounded-md shadow-sm">
                    {textInput}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5 text-red-500" />
                    </div>
                </div>
            )
            case "CORRECT": return <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon aria-hidden="true" className="h-6 w-6 text-green-600" />
            </div>
        }
    }


    return (
        <>
            <Dialog size="xl" open={true} onClose={setIsOpen}>
                <DialogTitle>{item.firstTerm.word}</DialogTitle>
                {/* <DialogDescription>
                The refund will be reflected in the customer’s bank account 2 to 3 business days after processing.
              </DialogDescription> */}
                <DialogBody>
                    {dialogBody()}
                </DialogBody>
                <DialogActions>
                    <Button plain onClick={() => setState("CLUE")}>
                        No Clue
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}