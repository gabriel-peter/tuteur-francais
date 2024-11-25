import mongoose from "mongoose";

export interface SimpleVocabTerm {
    french: string;
    english: string;
    misc: string;
};

export interface MongoSimpleVocabTerm extends SimpleVocabTerm, mongoose.Document { 
    _id: string
};
export const SimpleVocabTermSchema = new mongoose.Schema<MongoSimpleVocabTerm>({
    french: { type: String, required: true },
    english: { type: String, required: true },
    misc: { type: String, required: true }
})
export default mongoose.models.SimpleVocabTerm || mongoose.model<MongoSimpleVocabTerm>("SimpleVocabTerm", SimpleVocabTermSchema)

