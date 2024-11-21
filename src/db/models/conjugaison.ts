import mongoose from "mongoose";
import { TermTupleSchema } from "./TermTupleSchema";
import { TermTuple } from "../types";


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

export interface ConjugaisonTerm {
    term: TermTuple
    isFavorite: boolean
    searchedOn: Date
    conjugaison: ConjugaisonItems[]
}