import { SimpleVocabTerm, SimpleVocabTermSchema } from "./vocab-term";
import mongoose from "mongoose";

export interface AnnotatedVideo {
    title: string,
    videoId: string,
    thumbnailUrl: string, 
    createdAt: Date,
    terms?: SimpleVocabTerm[]
}

export interface MongoAnnotatedVideo extends AnnotatedVideo, mongoose.Document {};
const AnnotatedVideoSchema = new mongoose.Schema<MongoAnnotatedVideo>({
    title: {type: String, required: true},
    videoId: {type: String, required: true, unique: true}, // TODO this needs to be unique PER user.
    thumbnailUrl: {type: String, required: true},
    createdAt: {type: Date, required: true},
    terms: {type: [SimpleVocabTermSchema], required: false}
})

export default mongoose.models.AnnotatedVideo || mongoose.model<MongoAnnotatedVideo>("AnnotatedVideo", AnnotatedVideoSchema)
