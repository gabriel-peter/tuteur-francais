import { VideoVocabTerm } from "@/data/types";
import mongoose from "mongoose";

export interface MVocabTerm extends VideoVocabTerm, mongoose.Document {}
const SimpleVocabTerm = new mongoose.Schema<MVocabTerm>({
    french: {type: String, required: true, unique: true},
    english: {type: String, required: true},
    misc: {type: String, required: true}
})
export default mongoose.models.SimpleVocabTerm || mongoose.model<MVocabTerm>("SimpleVocabTerm", SimpleVocabTerm)