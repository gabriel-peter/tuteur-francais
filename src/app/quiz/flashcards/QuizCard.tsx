"use client";
import { Badge } from "@/components/catalyst-ui/badge";
import { Quiz } from "@/db/types";

const QuizStatusToBadge: Record<Quiz["state"], React.ReactNode> = {
    "NEW": <Badge color="pink">New</Badge>,
    "COMPLETED": <Badge color="green">Review</Badge>,
    "FAILED": <Badge color="red">Redo</Badge>
};

export const QuizCard = ({ quiz, setQuiz }: { quiz: Quiz; setQuiz: (q: Quiz) => void; }) => {
    return (
        <div
            onClick={() => setQuiz(quiz)}
            className="rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105"
        >
            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
            {QuizStatusToBadge[quiz.state]}
        </div>
    );

};
