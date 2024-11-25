"use server"
import QuizAttemptModel, { QuizAttempt } from "@/db/models/quiz-attempts/quiz-attempt"
import dbConnect from "@/db/mongoose";

export async function createQuizAttemptAction(attempt: QuizAttempt) {
    await dbConnect();
    return QuizAttemptModel.create(attempt).then(JSON.stringify)
}

export async function getQuizAttemptAction(quizId: string) {
    await dbConnect();
    return QuizAttemptModel.find({quizId}).lean().then(JSON.stringify)
}