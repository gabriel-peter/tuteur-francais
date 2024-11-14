import mongoose from "mongoose";
import { Term, TermTuple } from "../types";

export interface MongoTerm extends Term, mongoose.Document { }
export const TermSchema = new mongoose.Schema<Term>({
    word: { type: String, required: true },
    language: {
        type: String,
        enum: ["English", "French"],
        required: true
    },
    otherPossibilies: { type: [String], required: false },
    examples: { type: [String], required: false },
});

export interface MongoTermTuple extends TermTuple, mongoose.Document { }
export const TermTupleSchema = new mongoose.Schema<TermTuple>({
    firstTerm: { type: TermSchema, required: true },
    secondTerm: { type: TermSchema, required: true },
});
