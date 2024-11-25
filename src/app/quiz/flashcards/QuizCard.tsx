"use client";
import { Badge } from "@/components/catalyst-ui/badge";
import { Button } from "@/components/catalyst-ui/button";
import { MongoQuiz } from "@/db/models/quiz/quiz";
import { getQuizAttemptAction } from "@/db/models/quiz-attempts/actions";
import quizAttempt, { QuizAttempt } from "@/db/models/quiz-attempts/quiz-attempt";
import { Quiz } from "@/db/types";
import { PlayCircleIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/16/solid";
import { MouseEventHandler, useEffect, useState } from "react";
import { deleteQuizAction } from "@/db/models/quiz/actions";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription, AlertActions } from "@/components/catalyst-ui/alert";

const QuizStatusToBadge: Record<Quiz["state"], React.ReactNode> = {
    "NEW": <Badge color="pink">New</Badge>,
    "COMPLETED": <Badge color="green">Review</Badge>,
    "FAILED": <Badge color="red">Redo</Badge>
};

export const QuizCard = ({ quiz, setQuiz }: { quiz: MongoQuiz; setQuiz: (q: MongoQuiz) => void; }) => {
    useEffect(() => {
        getQuizAttemptAction(quiz._id).then(JSON.parse).then(console.log)
    }, [])

    async function deleteQuiz() {
        console.log("DELETE", quiz._id)
        await deleteQuizAction(quiz._id).then(() => location.reload())
    }
    return (
        <div
            onClick={() => setQuiz(quiz)}
            // https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state
            className="grid group rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105"
        >
            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
            <div className="flex justify-between w-full">
                {QuizStatusToBadge[quiz.state]}
                <DeleteAlert deleteQuiz={deleteQuiz} quiz={quiz} />
            </div>
        </div>
    );

};


function DeleteAlert({ quiz, deleteQuiz }: { quiz: Quiz, deleteQuiz: () => void }) {
    let [isOpen, setIsOpen] = useState(false)

    return (<>
        <Button
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                event.stopPropagation();
                setIsOpen(true)
            }
            }
            className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <TrashIcon />
        </Button>
        <Alert open={isOpen} onClose={setIsOpen}>
            <AlertTitle>Are you sure you want to delete '{quiz.title}'?</AlertTitle>
            {/* <AlertDescription>
                The refund will be reflected in the customer’s bank account 2 to 3 business days after processing.
            </AlertDescription> */}
            <AlertActions>
                <Button plain onClick={() => setIsOpen(false)}>
                    Cancel
                </Button>
                <Button onClick={
                    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        event.stopPropagation();
                        deleteQuiz();
                        setIsOpen(false)
                    }}>Delete</Button>
            </AlertActions>
        </Alert>
    </>)
}
