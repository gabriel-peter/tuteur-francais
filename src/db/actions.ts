"use server"
import { Quiz } from "@/data/types";
import dbConnect from "./mongoose";
import SimpleVocabTermModel, { SimpleVocabTerm } from "@/db/models/vocab-term"
import AnnotatedVideoModel, { AnnotatedVideo } from "@/db/models/annotated-video"
import QuizSchema from "@/db/models/quiz"
import { YoutubeVideoMetadata } from "@/clients/youtube";

export async function createFlashCardAction(term: SimpleVocabTerm) {
    await dbConnect();
    const newTerm = await SimpleVocabTermModel.create(term)
    return JSON.stringify(newTerm.id);
}

export async function getFlashCardAction(term: SimpleVocabTerm) {
    await dbConnect();
    const newTerm = SimpleVocabTermModel.create(term)
    return JSON.stringify(newTerm);
}

export async function createQuizAction(quiz: Quiz) {
    await dbConnect();
    return QuizSchema.create(quiz).then(r => r.id)
}

export async function getAllQuizsAction(): Promise<string> {
    await dbConnect();
    const resultPromise = await QuizSchema.find().lean()
    console.log(resultPromise)
    return JSON.stringify(resultPromise)
}

export async function upsertAnnotatedVideoAction(metadata: YoutubeVideoMetadata): Promise<string> {
    await dbConnect();
    const newAnnotatedVideo = await AnnotatedVideoModel.findOneAndUpdate(
        {videoId: metadata.videoId}, // Selector
        {...metadata, createdAt: new Date()}, // Data
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).catch(error => {
        if (error.code === 11000) {
            console.error("Duplicate videoId detected:", error.message);
            return AnnotatedVideoModel.findOne({videoId: metadata.videoId})
          } else {
            console.error("Error creating video:", error);
            throw new Error("Error creating new video")
          }
    })
    console.log("CREATED OR FOUND VIDEO", newAnnotatedVideo)
    return JSON.stringify(newAnnotatedVideo)
}

export async function getAllAnnotatedVideoAction(): Promise<string> {
    await dbConnect();
    const resultPromise = await AnnotatedVideoModel.find().lean()
    console.log(resultPromise)
    return JSON.stringify(resultPromise)
}

export async function updateTermToAnnotatedVideo(term: SimpleVocabTerm, videoId: string) {
    await dbConnect();
    const updatedVideo = await AnnotatedVideoModel.findOneAndUpdate(
        {videoId},
        { $push: { terms: term } },
        { new: true } // This option returns the updated document
    ).lean()
    console.log(updatedVideo)
    return JSON.stringify(updatedVideo);
}

export async function deleteAnnotatedVideoAction(videoId: string) {
    await dbConnect();
    const deletedVideo = await AnnotatedVideoModel.findOneAndDelete(
        {videoId}
    ).lean()
    console.log(deletedVideo)
    return JSON.stringify(deletedVideo);
}