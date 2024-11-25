"use server"
import QuizModel from "@/db/models/quiz/quiz"
import dbConnect from "@/db/mongoose";

export async function deleteQuizAction(quizId: string) {
    await dbConnect();
    return QuizModel.findOneAndDelete({_id: quizId}).lean().then(JSON.stringify)
}