import { Button } from "@/components/catalyst-ui/button";
import { DialogBody, DialogActions, Dialog, DialogTitle } from "@/components/catalyst-ui/dialog";
import { Field } from "@/components/catalyst-ui/fieldset";
import { Heading } from "@/components/catalyst-ui/heading";
import { Input } from "@/components/catalyst-ui/input";
import { createQuizAttemptAction } from "@/db/models/quiz-attempts/actions";
import { Quiz, WordType } from "@/db/types";
import { Text } from "@/components/catalyst-ui/text";
import { advancedTermTuples } from "@/test-data/term-tuples";
import { ExclamationCircleIcon, CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
type QuestionState = "WAITING" | "CLUE" | "FORFEIT" | "INCORRECT" | "CORRECT";

export function QuizPanel({
    quiz,
    setQuizShown,
}: {
    quiz: Quiz & {_id: string},
    setQuizShown: (x: boolean) => void,
}) {
    const [incorrectTermTupleIds, setIncorrectTermTupleIds] = useState<string[]>([])
    const [currentItemIndex, setItemIndex] = useState(0)
    const currentItem = quiz.items[currentItemIndex];
    function advanceCard() {
        if (currentItemIndex === advancedTermTuples.length - 1) {
            console.log("QUIZ IS OVER")
            // TODO show complete animation w/ score
            createQuizAttemptAction({
                quizId: quiz._id,
                attemptedAt: new Date(),
                decimalScore: incorrectTermTupleIds.length / quiz.items.length,
                incorrectTermTupleIds
            }).then(r => setQuizShown(false))
        } else {
            setItemIndex(currentItemIndex + 1)
        }
    }
    const [state, setState] = useState<QuestionState>("WAITING")
    const [guess, setGuess] = useState("");
    const [guessCount, setGuessCount] = useState(0);
    const GUESS_COUNT_MAX = 1;

    function proceed(result: QuestionState) {
        setState(result)
        setTimeout(() => {
            advanceCard();
            setState("WAITING");
            setGuess("");
            setGuessCount(0);
        }, 1500);
    }

    function checkGuess() {
        const formattedGuess = currentItem.firstTerm.type === WordType.VERB ?
            guess.replace(/\s*to\s*/g, "").replace(/\s+/g, "").toLowerCase() : guess.replace(/^\s+|\s+$/g, '');
        setGuessCount(guessCount + 1);
        if (formattedGuess === currentItem.secondTerm.word.toLowerCase()) {
            proceed("CORRECT");
        } else {
            if (guessCount >= GUESS_COUNT_MAX) {
                proceed("FORFEIT");
            } else {
                setIncorrectTermTupleIds(prev => [...prev, currentItem.firstTerm.word])
                console.log("INCORRECT")
                setState("INCORRECT")
            }
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
                autoFocus
            />
        </Field>;

        const examples = currentItem.firstTerm.examples?.map((example, index) => <Text key={index}>{example}</Text>)
        switch (state) {
            case "WAITING": return textInput
            case "CLUE": return (
                <>
                    {textInput}
                    {examples}
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
            case "FORFEIT": return (
                <>
                    <Heading>{currentItem.secondTerm.word}</Heading>
                    {examples}
                </>
            )
        }
    }


    return (
        <>
            <Dialog size="xl" open={quiz !== undefined} onClose={() => { }}>
                <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">

                    <DialogTitle>{currentItem.firstTerm.word} ({currentItemIndex + 1}/{quiz.items.length})</DialogTitle>
                    <div className="flex gap-4">
                        <Button onClick={() => setQuizShown(false)}><XMarkIcon /></Button>
                    </div>
                </div>
                <DialogBody>
                    {dialogBody()}
                </DialogBody>
                <DialogActions>
                    <Button plain onClick={() => setState("CLUE")}>
                        No Clue
                    </Button>
                    <Button plain onClick={() => proceed("FORFEIT")}>
                        I cry
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}