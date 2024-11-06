"use server"
import { Quiz, TermTuple } from "./types";
import dbConnect from "./mongoose";
import SimpleVocabTermModel, { SimpleVocabTerm } from "@/db/models/vocab-term"
import AnnotatedVideoModel, { AnnotatedVideo } from "@/db/models/annotated-video"
import QuizSchema, { MongoTermTuple } from "@/db/models/quiz/quiz"
import { YoutubeVideoMetadata } from "@/clients/youtube";
import AnnotatedExcerptModel, { AnnotatedExcerpt, MongoAnnotatedExcerpt } from "./models/excerpt";

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
        { videoId: metadata.videoId }, // Selector
        { ...metadata, createdAt: new Date() }, // Data
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).catch(error => {
        if (error.code === 11000) {
            console.error("Duplicate videoId detected:", error.message);
            return AnnotatedVideoModel.findOne({ videoId: metadata.videoId })
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

export async function updateTermToAnnotatedVideo(term: TermTuple, videoId: string) {
    await dbConnect();
    const updatedVideo = await AnnotatedVideoModel.findOneAndUpdate(
        { videoId },
        { $push: { terms: term } },
        { new: true } // This option returns the updated document
    ).lean()
    console.log(updatedVideo)
    return JSON.stringify(updatedVideo);
}

export async function removeTermFromAnnotatedVideo(termToRemove: TermTuple, videoId: string) {
    await dbConnect();
    const video = await AnnotatedVideoModel.findOneAndUpdate(
        { videoId },
        {
            $pull: {
                terms: termToRemove
            },
        },
        { new: true } // Returns the updated document after removal
    );
    return JSON.stringify(video);
}

export async function deleteAnnotatedVideoAction(videoId: string) {
    await dbConnect();
    const deletedVideo = await AnnotatedVideoModel.findOneAndDelete(
        { videoId }
    ).lean()
    console.log(deletedVideo)
    return JSON.stringify(deletedVideo);
}

export async function createAnnotatedExcerptAction(newAnnotatedExcerpt: AnnotatedExcerpt): Promise<string> {
    await dbConnect();
    const newExcerpt = await AnnotatedExcerptModel.create(newAnnotatedExcerpt)
    console.log(newExcerpt)
    return newExcerpt.id;
}

export async function getExerptAction(excerptId: string): Promise<any> {
    await dbConnect();
    const foundExcerpt = await AnnotatedExcerptModel.findById(excerptId);
    console.log(foundExcerpt)
    return JSON.stringify(foundExcerpt);
}

export async function getAllExerptsAction(): Promise<any> {
    await dbConnect();
    const foundExcerpts = await AnnotatedExcerptModel.find().lean();
    console.log(foundExcerpts)
    return JSON.stringify(foundExcerpts);
}

export async function updateTermToAnnotatedExcertAction(term: TermTuple, excerptId: string) {
    await dbConnect();
    const updated = await AnnotatedExcerptModel.findOneAndUpdate(
        { id: excerptId },
        { $push: { terms: term } },
        { new: true } // This option returns the updated document
    ).lean().catch(error => console.error(error))
    console.log("updateTermToAnnotatedExcertAction", updated)
    return JSON.stringify(updated);
}

export async function removeTermFromAnnotatedExcerpt(termToRemove: TermTuple, excerptId: string) {
    await dbConnect();
    console.log(termToRemove)
    const excerpt = await AnnotatedExcerptModel.findOneAndUpdate(
        { id: excerptId },
        {
            $pull: {
                terms: termToRemove
            },
        },
        { new: true } // Returns the updated document after removal
    ).lean().catch(error => console.log(error));
    return JSON.stringify(excerpt);
}

export async function updateTermFromAnnotatedExcerptAction(newTermTuple: TermTuple, oldTermTuple: TermTuple, excerptId: string) {
    await dbConnect();

    // First, find the document to get the existing terms array
    const excerpt: MongoAnnotatedExcerpt | null = await AnnotatedExcerptModel.findById(excerptId);
    if (!excerpt) {
        console.warn("No excerpt found during update: ", excerptId)
        return null;
    }
    // Find the index of the term to update based on full match
    const termIndex = excerpt.terms.findIndex(term =>
        JSON.stringify(term) === JSON.stringify(oldTermTuple)
    );

    if (termIndex !== -1) {
        // Update the term at the found index
        excerpt.terms[termIndex] = newTermTuple;

        // Save the updated terms array
        const updatedExcerpt = await AnnotatedExcerptModel.findOneAndUpdate(
            { id: excerptId },
            { terms: excerpt.terms },
            { new: true, overwrite: true }
        ).lean();

        return JSON.stringify(updatedExcerpt);
    } else {
        console.error("No term match to update: ", newTermTuple, oldTermTuple)
        return null; // No matching term found
    }
}