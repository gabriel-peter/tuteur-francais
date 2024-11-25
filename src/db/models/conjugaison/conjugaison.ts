import mongoose from "mongoose";
import { TermTupleSchema } from "../TermTupleSchema";
import { TermTuple } from "../../types";


export interface ConjugaisonItems {
    'Indicatif': {
        'Présent': string[]
        'Imparfait': string[]
        'Futur': string[]
    }
    "Subjonctif": {
        'Passé antérieur': string[]
        'Futur antérieur': string[]
        'Présent': string[]
    },
    'Conditionnel': {
        'Présent': string[]
        'Passé première forme': string[]
        'Passé deuxième forme': string[]
    },
    'Participe': {
        'Présent': string[]
        'Passé composé': string[]
        'Passé': string[]
    },
    'ImpératifInfinitif': {
        'Présent': string[]
        'Passé': string[]
    }
}
export interface MongoConjugaisonItems extends ConjugaisonItems, mongoose.Document { 
    _id: string
}
export const ConjugaisonItemSchema = new mongoose.Schema<MongoConjugaisonItems>({
    Indicatif: {
        Présent: { type: [String], required: true },
        Imparfait: { type: [String], required: true },
        Futur: { type: [String], required: true },
    },
    Subjonctif: {
        'Passé antérieur': { type: [String], required: true },
        'Futur antérieur': { type: [String], required: true },
        Présent: { type: [String], required: true },
    },
    Conditionnel: {
        Présent: { type: [String], required: true },
        'Passé première forme': { type: [String], required: true },
        'Passé deuxième forme': { type: [String], required: true },
    },
    Participe: {
        Présent: { type: [String], required: true },
        'Passé composé': { type: [String], required: true },
        Passé: { type: [String], required: true },
    },
    ImpératifInfinitif: {
        Présent: { type: [String], required: true },
        Passé: { type: [String], required: true },
    },
});

export interface ConjugaisonTerm {
    word: string
    term: TermTuple
    isFavorite: boolean
    searchedOn: Date
    conjugaison: ConjugaisonItems
}
export interface MongoConjugaisonTerm extends ConjugaisonTerm, mongoose.Document { }
export const ConjugaisonTermSchema = new mongoose.Schema<MongoConjugaisonTerm>({
    word: { type: String, required: true },
    term: { type: TermTupleSchema, required: true },
    isFavorite: { type: Boolean, required: true, default: false },
    searchedOn: { type: Date, required: true },
    conjugaison: { type: ConjugaisonItemSchema, required: true }
});

export default mongoose.models.ConjugaisonTerm || mongoose.model<MongoConjugaisonTerm>("ConjugaisonTerm", ConjugaisonTermSchema);