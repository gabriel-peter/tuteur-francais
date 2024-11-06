export interface TranslationResponse {
    id: string;
    from: string;
    to: string;
    input: string[];
    correctedText: string | null;
    translation: string[];
    engines: string[];
    languageDetection: {
        detectedLanguage: string;
        isDirectionChanged: boolean;
        originalDirection: string;
        originalDirectionContextMatches: number;
        changedDirectionContextMatches: number;
        timeTaken: number;
    };
    contextResults: {
        rudeWords: boolean;
        colloquialisms: boolean;
        riskyWords: boolean;
        results: Array<{
            translation: string;
            sourceExamples: string[];
            targetExamples: string[];
            rude: boolean;
            colloquial: boolean;
            partOfSpeech: string | null;
            frequency: number;
            vowels: string | null;
            transliteration: string | null;
        }>;
        totalContextCallsMade: number;
        timeTakenContext: number;
    };
    truncated: boolean;
    timeTaken: number;
}


export async function reverso(text: string, from: "fr" | "en",  to: "fr" | "en"): Promise<TranslationResponse> {
    return fetch("https://api.reverso.net/translate/v1/translation", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            format: 'text',
            from: from,
            input: text,
            options: {
                contextResults: true,
                languageDetection: true,
                origin: 'reversomobile',
                sentenceSplitter: false,
            },
            to: to
        })
    })
        .then(res => {  return res.json()} ).then(r => { console.log(r); return r;});
}
