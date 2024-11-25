import mongoose from "mongoose";
import { Term, TermTuple } from "../types";

export interface MongoTerm extends Term, mongoose.Document { 
    _id: string
}
export const TermSchema = new mongoose.Schema<MongoTerm>({
    word: { type: String, required: true },
    language: {
        type: String,
        enum: ["English", "French"],
        required: true
    },
    otherPossibilies: { type: [String], required: false },
    examples: { type: [String], required: false },
});

export interface MongoTermTuple extends TermTuple, mongoose.Document { 
    _id: string
}
export const TermTupleSchema = new mongoose.Schema<MongoTermTuple>({
    firstTerm: { type: TermSchema, required: true },
    secondTerm: { type: TermSchema, required: true },
    source: {
        type: String, 
        enum: ["Reverso", "User", "Unknown"], 
        required: true, 
        default: "Unknown"
    },
    notes:  { type: String },
});
