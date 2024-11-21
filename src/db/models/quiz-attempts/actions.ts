import QuizAttemptModel, { QuizAttempt } from "@/db/models/quiz-attempts/quiz-attempt"
import dbConnect from "@/db/mongoose";

export async function createQuizAttemptAction(attempt: QuizAttempt) {
    await dbConnect();
    return QuizAttemptModel.create(attempt).then(JSON.stringify)
}