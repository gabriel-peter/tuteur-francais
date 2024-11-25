"use server"
import { Quiz, TermTuple } from "./types";
import dbConnect from "./mongoose";
import SimpleVocabTermModel, { SimpleVocabTerm } from "@/db/models/vocab-term"
import AnnotatedVideoModel, { AnnotatedVideo, MongoAnnotatedVideo } from "@/db/models/annotated-video"
import QuizModel from "@/db/models/quiz/quiz"
import { MongoTermTuple } from "./models/TermTupleSchema";
import { YoutubeVideoMetadata } from "@/clients/youtube";
import AnnotatedExcerptModel, { AnnotatedExcerpt, MongoAnnotatedExcerpt } from "@/db/models/reading/excerpt";
import mongoose, { Model } from "mongoose";

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
    return QuizModel.create(quiz).then(r => r._id)
}

export async function getAllQuizsAction(): Promise<string> {
    await dbConnect();
    const resultPromise = await QuizModel.find().lean()
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

export async function getAllAnnotatedExcerptAction(): Promise<string> {
    await dbConnect();
    const resultPromise = await AnnotatedExcerptModel.find().lean()
    console.log(resultPromise)
    return JSON.stringify(resultPromise)
}

export async function getAllItemAction(modelMapKey: ModelMapKey, limit: number = 20): Promise<string> {
    await dbConnect();
    const resultPromise = await modelMap[modelMapKey].find().limit(limit).lean()
    console.log(resultPromise)
    return JSON.stringify(resultPromise)
}

export async function getAnnotatedVideoAction(videoId: string): Promise<string> {
    await dbConnect();
    const resultPromise = await AnnotatedVideoModel.findOne({videoId}).lean()
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

export async function createAnnotatedExcerptAction(newAnnotatedExcerpt: Partial<AnnotatedExcerpt>): Promise<string> {
    await dbConnect();
    const newExcerpt = await AnnotatedExcerptModel.create({...newAnnotatedExcerpt, createdAt: new Date()})
    console.log(newExcerpt)
    return JSON.stringify(newExcerpt._id);
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
        { _id: excerptId },
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
        { _id: excerptId },
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
            { _id: excerptId },
            { $set: { terms: excerpt.terms } }, 
            { new: true }
        ).lean().catch(error => console.log(error));
        console.log("TERM SUCCESSFULLY UPDATED", updatedExcerpt)
        return JSON.stringify(updatedExcerpt);
    } else {
        console.error("No term match to update: ", newTermTuple, oldTermTuple)
        return null; // No matching term found
    }
}

const modelMap = {
    "AnnotatedExcerpt": AnnotatedExcerptModel,
    "AnnotatedVideo": AnnotatedVideoModel,
    "Quiz": QuizModel,
}

type ModelMapKey = keyof typeof modelMap

// Generic function to update a full object in Mongoose
export async function updateDocumentById<T extends mongoose.Document>(
    modelMapKey: ModelMapKey,         // The Mongoose model (e.g., UserModel, ProductModel)
    id: string,               // The ID of the document to update
    updatedData: Partial<T>   // The updated object data (partial to allow partial updates), ensures _id is not mutated
): Promise<string> {
    delete updatedData._id
    await dbConnect()
    try {
        const updatedDocument = await modelMap[modelMapKey].findOneAndUpdate(
            { _id: id },
            updatedData,
            { new: true } // `new: true` to return the updated doc, `overwrite: true` to replace
        ).lean(); // Use `.lean()` if you want a plain JavaScript object instead of a Mongoose document
        console.log("UPDATED DOCUMENT", updatedDocument)
        return JSON.stringify(updatedDocument);
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
}

export async function updateTermFromAnnotatedVideoAction(newTermTuple: TermTuple, oldTermTuple: TermTuple, videoId: string) {
    await dbConnect();

    // First, find the document to get the existing terms array
    const excerpt: MongoAnnotatedVideo | null = await AnnotatedVideoModel.findOne({videoId});
    if (!excerpt) {
        console.warn("No excerpt found during update: ", videoId)
        throw new Error("No excerpt found during update");
    }
    // Find the index of the term to update based on full match
    const termIndex = excerpt.terms.findIndex(term =>
        JSON.stringify(term) === JSON.stringify(oldTermTuple)
    );

    if (termIndex !== -1) {
        // Update the term at the found index
        excerpt.terms[termIndex] = newTermTuple;

        // Save the updated terms array
        const updatedExcerpt = await AnnotatedVideoModel.findOneAndUpdate(
            { videoId },
            { $set: { terms: excerpt.terms } }, 
            { new: true }
        ).lean().catch(error => console.log(error));
        console.log("TERM SUCCESSFULLY UPDATED", updatedExcerpt)
        return JSON.stringify(updatedExcerpt);
    } else {
        console.error("No term match to update: ", newTermTuple, oldTermTuple)
        throw new Error("No term match to update")
    }
}