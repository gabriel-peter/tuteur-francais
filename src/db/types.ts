
export enum Language {
    ENGLISH = "English",
    FRENCH = "French"
}

export interface Term {
    word: string;
    type?: WordType;
    otherPossibilies?: string[];
    language: Language;
    examples?: string[];
}
;

export interface TermTuple {
    firstTerm: Term;
    secondTerm: Term;
    assets?: {
        imgUrl: string;
    };
}
;

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
export interface Quiz {
    title: string;
    items: TermTuple[];
    state: "COMPLETED" | "FAILED" | "NEW";
}
