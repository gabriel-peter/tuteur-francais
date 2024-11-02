"use client"
import { Heading } from "@/components/catalyst-ui/heading";
import { useState } from "react";
import { CardGrid } from "../page";
import { advancedTermTuples, foodTermTuples } from "../../../data/term-tuples";
import { Quiz, TermTuple, WordType } from "@/data/types";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/catalyst-ui/dialog";
import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { Button } from "@/components/catalyst-ui/button";
import { Input } from "@/components/catalyst-ui/input";
import { Text } from '@/components/catalyst-ui/text'
import { CheckIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { idiomTermTuples } from "../../../data/term-tuples";
import { Switch, SwitchField } from "@/components/catalyst-ui/switch";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "@/components/catalyst-ui/dropdown";
import { handleKeyDown } from "@/app/utils";
import { callWithPrompt } from "@/clients/open-ai";

type RequestState = "IDLE" | "LOADING" | "FAILED" | "SUCCESS"

function AIDialogBody() {
    const [requestState, setRequestState] = useState<RequestState>("IDLE")
    const [termTuples, setTermTuples] = useState<string | null>();
    function sendToOpenAI(prompt: string) {
        console.log(prompt)
        setRequestState("LOADING")
        callWithPrompt(prompt).then(res => {
            setRequestState("SUCCESS")
            setTermTuples(res)
        }).catch(err => {
            console.error(err);
            setRequestState("FAILED");
        })
    }
    const textInput = <Field>
    <Label>Prompt</Label>
    <Input onKeyDown={event => handleKeyDown(event, () => sendToOpenAI(event.currentTarget.value))} name="prompt" placeholder="Make a quiz with ..." />
  </Field>;
    switch(requestState) {
        case "IDLE": return textInput;
        case "FAILED": return (<>{textInput}<Text>Operation Failed {":("}</Text></>)
        case "LOADING": return "LOADING ..."
        case "SUCCESS": return  QuizCreationPreview(termTuples)
    }
}

function QuizCreationPreview(termTupleString: string | undefined) {
    return <Text>{termTupleString}</Text>
}


function QuizGeneratorDialog({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (x: boolean) => void}) {
 const [generateOption, setGenerateOption] = useState<"AI"|"MANUAL">();

    function dialogBody() {
        switch(generateOption) {
            case undefined: return <div className="flex justify-evenly">
            <Button onClick={() => setGenerateOption("AI")}>AI-generate</Button>
            <Button onClick={() => setGenerateOption("MANUAL")}>Manual</Button>
            </div>
            case "AI": return <AIDialogBody/>
        }
    }
  return (
    <>
      {/* <Dropdown>
        <DropdownButton outline>
        Add new quiz
          <ChevronDownIcon />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem onClick={() => setIsOpen(true)}></DropdownItem>
          <DropdownItem href="#" disabled>
            Download
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Refund payment</DialogTitle>
        <DialogDescription>
          The refund will be reflected in the customer’s bank account 2 to 3 business days after processing.
        </DialogDescription>
        <DialogBody>
            {dialogBody()}
        </DialogBody>
        {/* <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Refund</Button>
        </DialogActions> */}
      </Dialog>
    </>
  )
}
const quizzes = [
    { title: "Quiz 1", items: advancedTermTuples },
    { title: "Food 1", items: foodTermTuples },
    { title: "Idioms - Reverso Context", items: idiomTermTuples }
]

export const QuizCard = ({ quiz, setQuiz }: { quiz: Quiz, setQuiz: (q: Quiz) => void }) => {
    return (
        <div
            onClick={() => setQuiz(quiz)}
            className="rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105"
        >
            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
        </div>
    )

}

function shuffle(array: TermTuple[]) {
    const arrayCopy = array;
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    return arrayCopy;
}

export default function FlashCardQuiz() {
    const [quiz, setQuiz] = useState<Quiz>();
    const [openQuizGenerator, setOpenQuizGenerator] = useState(false);
    const [shuffleEnabled, setShuffleEnabled] = useState(true)
    return (
        <div>
            <QuizGeneratorDialog isOpen={openQuizGenerator} setIsOpen={setOpenQuizGenerator}/>
            {quiz && <QuizPanel quiz={quiz} setQuizShown={() => setQuiz(undefined)} />}
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
                <Heading>Quiz</Heading>
                <div className="flex gap-4">
                    <SwitchField>
                        <Label>Shuffle</Label>
                        <Switch
                            name="shuffle"
                            checked={shuffleEnabled}
                            onChange={() => setShuffleEnabled(!shuffleEnabled)}
                        />
                    </SwitchField>
                </div>
            </div>
            <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
                <CardGrid>
                    {quizzes.map((quiz, index) => {
                        const possibleShuffledQuiz = quiz;
                        possibleShuffledQuiz.items = shuffle(possibleShuffledQuiz.items);
                        return (<QuizCard quiz={possibleShuffledQuiz} setQuiz={setQuiz} key={index} />)
                    })}
                    <div
                        onClick={() => setOpenQuizGenerator(true)}
                        className="flex justify-center align-center rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105"
                    >
                        <Button>
                            <PlusIcon />
                            Add new quiz
                        </Button>
                    </div>

                </CardGrid>
            </div>
        </div>)
}

type QuestionState = "WAITING" | "CLUE" | "FORFEIT" | "INCORRECT" | "CORRECT";

function QuizPanel({
    quiz,
    setQuizShown,
}: {
    quiz: Quiz,
    setQuizShown: (x: boolean) => void,
}) {
    const [currentItemIndex, setItemIndex] = useState(0)
    const currentItem = quiz.items[currentItemIndex];
    function advanceCard() {
        if (currentItemIndex === advancedTermTuples.length - 1) {
            console.log("QUIZ IS OVER")
            // TODO show complete animation w/ score
            setQuizShown(false)
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
            console.log("CORRECT")
            proceed("CORRECT");
        } else {
            if (guessCount >= GUESS_COUNT_MAX) {
                proceed("FORFEIT");
            } else {
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
                    <Button plain onClick={() => proceed("FORFEIT")}>
                        I cry
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}