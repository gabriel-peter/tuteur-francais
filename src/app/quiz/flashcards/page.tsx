"use client"
import { Heading } from "@/components/catalyst-ui/heading";
import { useEffect, useState } from "react";
import { CardGrid } from "../../flashcards/page";
import { advancedTermTuples } from "../../../test-data/term-tuples";
import { Language, Quiz, TermTuple, WordType } from "@/db/types";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/catalyst-ui/dialog";
import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { Button } from "@/components/catalyst-ui/button";
import { Input } from "@/components/catalyst-ui/input";
import { Text } from '@/components/catalyst-ui/text'
import { CheckIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Switch, SwitchField } from "@/components/catalyst-ui/switch";
import { ChevronDownIcon, EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "@/components/catalyst-ui/dropdown";
import { handleKeyDown } from "@/app/utils";
import { callWithPrompt } from "@/clients/open-ai";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { createQuizAction, getAllQuizsAction } from "@/db/actions";
import { RequestState } from "../../../components/LoadingButton";
import { Navbar, NavbarSection, NavbarItem } from "@/components/catalyst-ui/navbar";
import { ReadingSourceDialogBody } from "./(creation)/ReadingSourceDialogBody";
import { createQuizAttemptAction } from "@/db/models/quiz-attempts/actions";
import { QuizCard } from "./QuizCard";
import { QuizPanel } from "./(game)/QuizGame";
import { VideoSourceDialogBody } from "./(creation)/VideoSourceDialogBody";
import { ManualDialogBody } from "./(creation)/ManualDialogBody";
import { MongoQuiz } from "@/db/models/quiz/quiz";

function AIDialogBody() {
    const [requestState, setRequestState] = useState<RequestState>("IDLE")
    const [termTuples, setTermTuples] = useState<TermTuple[]>();
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
    switch (requestState) {
        case "IDLE": return textInput;
        case "FAILED": return (<>{textInput}<Text>Operation Failed {":("}</Text></>)
        case "LOADING": return "LOADING ..."
        case "SUCCESS": if (termTuples) { return <QuizCreationPreview termTuplesProp={termTuples} /> } else { return <>Error Occurred</> }
    }
}

function CreateQuizButton({ termTuplesProp }: { termTuplesProp: TermTuple[] }) {
    const [requestState, setRequestState] = useState<RequestState>("IDLE");
    function createQuiz() {
        setRequestState("LOADING")
        createQuizAction({ title: "Test", items: termTuplesProp, state: "NEW" })
            .then(r => {
                console.log(r);
                setRequestState("SUCCESS")
                // Redirect or automatic close?
            }).catch(e => console.error(e))
    }
    switch (requestState) {
        case "IDLE": return <Button onClick={() => createQuiz()}>Create</Button>
        case "LOADING": return <Button disabled>Creating ...</Button>
        case "FAILED": return <Button onClick={() => createQuiz()}>Failed: Try Again</Button>
        case "SUCCESS": return <Button onClick={() => createQuiz()}>Create</Button>
    }
}

function QuizCreationPreview({ termTuplesProp }: { termTuplesProp: TermTuple[] }) {
    // TODO sort by language such that they are not flipped
    const [termTuples, setTermTuples] = useState(termTuplesProp);
    function removeTerm(index: number) {
        setTermTuples(prevItems => prevItems.filter((_, i) => i !== index));
    }
    function edit(index: number) {

    }

    return (
        <>
            <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
                <TableHead>
                    <TableRow>
                        <TableHeader>French</TableHeader>
                        <TableHeader>English</TableHeader>
                        <TableHeader>Word Type</TableHeader>
                        <TableHeader className="relative w-0">
                            <span className="sr-only">Actions</span>
                        </TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {termTuples?.map((termTuple, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{termTuple.secondTerm.word}</TableCell>
                            <TableCell>{termTuple.firstTerm.word}</TableCell>
                            <TableCell className="text-zinc-500">{termTuple.firstTerm.type}</TableCell>
                            <TableCell>
                                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                                    <Dropdown>
                                        <DropdownButton plain aria-label="More options">
                                            <EllipsisHorizontalIcon />
                                        </DropdownButton>
                                        <DropdownMenu anchor="bottom end">
                                            <DropdownItem onClick={() => removeTerm(index)}>Remove</DropdownItem>
                                            <DropdownItem>Edit</DropdownItem>
                                            <DropdownItem>Flag</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CreateQuizButton termTuplesProp={termTuples} />
        </>
    )
}

function QuizGeneratorDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (x: boolean) => void }) {
    const [generateOption, setGenerateOption] = useState<"AI" | "VIDEO-SOURCE" | "READING" | "MANUAL">();

    function dialogBody() {
        switch (generateOption) {
            case undefined: return <div className="flex justify-evenly">
                <Button onClick={() => setGenerateOption("AI")}>AI-generate</Button>
                <Button onClick={() => setGenerateOption("MANUAL")}>Manual</Button>
                <Button onClick={() => setGenerateOption("VIDEO-SOURCE")}>From Video</Button>
                <Button onClick={() => setGenerateOption("READING")}>From Reading</Button>
            </div>
            case "AI": return <AIDialogBody />
            case "MANUAL": return <ManualDialogBody />
            case "VIDEO-SOURCE": return <VideoSourceDialogBody />
            case "READING": return <ReadingSourceDialogBody />
        }
    }
    return (
        <>
            <Dialog open={isOpen} onClose={(v) => { setIsOpen(v); setGenerateOption(undefined) }}>
                <DialogTitle>Create a new Quiz</DialogTitle>
                <DialogDescription>
                    You can either leverage OpenAI to make you a quiz based on a prompt, or select term manually.
                </DialogDescription>
                <DialogBody>
                    {dialogBody()}
                </DialogBody>
            </Dialog>
        </>
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

export default function FlashCardQuizHome() {
    const [quiz, setQuiz] = useState<MongoQuiz>();
    const [openQuizGenerator, setOpenQuizGenerator] = useState(false);
    const [shuffleEnabled, setShuffleEnabled] = useState(true)
    const [quizzes, setQuizzes] = useState<MongoQuiz[]>([])
    useEffect(() => {
        getAllQuizsAction()
            .then(r => JSON.parse(r))
            .then((customQuizzes: MongoQuiz[]) => setQuizzes(prevQuizzes => [...prevQuizzes, ...customQuizzes]))
    }, [])
    return (
        <div>
            <QuizGeneratorDialog isOpen={openQuizGenerator} setIsOpen={setOpenQuizGenerator} />
            {quiz && <QuizPanel quiz={quiz} setQuizShown={() => setQuiz(undefined)} />}
            <div className="flex w-full flex-wrap items-end justify-between gap-4 pb-6">
                <SwitchField>
                    <Label>Shuffle</Label>
                    <Switch
                        name="shuffle"
                        checked={shuffleEnabled}
                        onChange={() => setShuffleEnabled(!shuffleEnabled)}
                    />
                </SwitchField>
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
