import { UrlObject } from "url";

export enum Language {
    ENGLISH = "English",
    FRENCH = "French"
}

export type Term = {
    word: string;
    type?: WordType;
    otherPossibilies?: string[];
    language: Language;
    examples?: string[];
};

export type TermTuple = {
    firstTerm: Term;
    secondTerm: Term;
    assets?: {
        imgUrl: UrlObject;
    };
};

export enum WordType {
    NOUN = "Noun",
    VERB = "Verb",
    ADJECTIVE = "Adjective",
    ADVERB = "Adverb",
    PRONOUN = "Pronoun",
    PREPOSITION = "Preposition",
    CONJUNCTION = "Conjunction",
    INTERJECTION = "Interjection",
    ARTICLE = "Article",
    DETERMINER = "Determiner"
}
export type Quiz = {
    title: string;
    items: TermTuple[];
    state?: "COMPLETED" | "FAILED";
};
export interface VideoVocabTerm {
    french: string;
    english: string;
    misc: string;
};

