import { Button, ButtonProps } from "@/components/catalyst-ui/button";
import { DialogBody, DialogActions, Dialog, DialogTitle } from "@/components/catalyst-ui/dialog";
import { Field } from "@/components/catalyst-ui/fieldset";
import { Heading, Subheading } from "@/components/catalyst-ui/heading";
import { Input } from "@/components/catalyst-ui/input";
import { createQuizAttemptAction } from "@/db/models/quiz-attempts/actions";
import { Quiz, Term, TermTuple, WordType } from "@/db/types";
import { Text } from "@/components/catalyst-ui/text";
import { advancedTermTuples } from "@/test-data/term-tuples";
import { ExclamationCircleIcon, CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ReactNode, useEffect, useRef, useState } from "react";
import { MongoQuiz } from "@/db/models/quiz/quiz";

type QuestionState = "WAITING" | "CLUE" | "FORFEIT" | "INCORRECT" | "CORRECT";

export function QuizPanel({
    quiz,
    setQuizShown,
}: {
    quiz: MongoQuiz,
    setQuizShown: (x: boolean) => void,
}) {
    const [incorrectTermTupleIds, setIncorrectTermTupleIds] = useState<string[]>([])
    const [currentItemIndex, setItemIndex] = useState(0)
    const currentItem = quiz.items[currentItemIndex];
    function advanceCard() {
        if (currentItemIndex === quiz.items.length - 1) {
            console.log("QUIZ IS OVER")
            // TODO show complete animation w/ score
            createQuizAttemptAction({
                quizId: quiz._id,
                attemptedAt: new Date(),
                decimalScore: (quiz.items.length - incorrectTermTupleIds.length) / quiz.items.length,
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

    function proceed() {
        console.log("PROCEED")
        advanceCard();
        setState("WAITING");
        setGuess("");
        setGuessCount(0);
    }

    function guessIsCorrect(guess: string, term: Term) {
        const allOptions = [term.word, ...term.otherPossibilies || []]
        return allOptions.some(option => option.toLowerCase() === guess)
    }

    function formatGuess(guess: string, term: Term) {
        guess = guess.trim().toLowerCase()
        // TODO make this remove other articles in french as well... 
        switch (term.type) {
            case WordType.VERB: return guess.replace(/\s*to\s*/g, "").replace(/\s+/g, "")
            case WordType.NOUN: return guess.replace(/\s*an\s*/g, "").replace(/\s*a\s*/g, "").replace(/\s+/g, "")
            default: return guess.replace(/^\s+|\s+$/g, '')
        }
    }

    function checkGuess() {
        const formattedGuess = formatGuess(guess, currentItem.firstTerm)
        setGuessCount(guessCount + 1);
        if (guessIsCorrect(formattedGuess, currentItem.secondTerm)) {
            setState("CORRECT");
        } else {
            if (guessCount >= GUESS_COUNT_MAX) {
                setState("FORFEIT");
            } else {
                setIncorrectTermTupleIds(prev => [...prev, currentItem.firstTerm._id])
                
                setState("INCORRECT")
            }
        }
        console.log(state)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
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

        const examples = currentItem.firstTerm.examples?.map((example, index) => {
            return <>
                <br />
                <Text key={index}>{<div
                    dangerouslySetInnerHTML={{ __html: example }} // There are HTML tags embedded in the reverso example sentences
                />}</Text></>
        })
        const otherPossibilies = currentItem.secondTerm.otherPossibilies?.map((possibility, index) => <Text key={index}>{possibility}</Text>)

        switch (state) {
            case "WAITING": return <>{textInput}{otherPossibilies}</>
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
                <audio
                    className="invisible"
                    autoPlay
                    src="/audio/success-1.mp3">
                    Your browser does not support the
                    <code>audio</code> element.
                </audio>
            </div>
            case "FORFEIT": return (
                <>
                    <Heading>{currentItem.secondTerm.word}</Heading>
                    {otherPossibilies && otherPossibilies?.length > 0 &&
                        <>
                            <Subheading>Other options</Subheading>
                            {otherPossibilies}
                        </>
                    }
                    {/* {examples} */}
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
                    {state === "WAITING" || state === "CLUE" || state === "INCORRECT" ? (
                        <>
                            <Button plain onClick={() => setState("CLUE")}>
                                No Clue
                            </Button>
                            <Button plain onClick={() => setState("FORFEIT")}>
                                I cry
                            </Button>
                        </>
                    ) : (
                        <KeydownButton 
                        plain 
                        action={proceed}
                        >
                            Next
                        </KeydownButton>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

// A button ref is needed for the autofocus and quick-proceed to work, idk why
function KeydownButton({ color, outline, plain, className, children, action, ...props }: ButtonProps & { action: () => void }) {
    // Create a reference to the button
    const buttonRef = useRef<HTMLButtonElement>(null);
    return (
        <Button plain autoFocus ref={buttonRef} onClick={action}>
            {children}
        </Button>
    );
}

