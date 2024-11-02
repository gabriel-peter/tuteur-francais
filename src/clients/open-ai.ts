
import { Language, Term, TermTuple, WordType } from "@/data/types";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });
import { z } from 'zod';

const TermSchema: z.ZodType<Term> = z.object({
    word: z.string(),
    language: z.nativeEnum(Language),
    type: z.nativeEnum(WordType),
    otherPossibilies: z.array(z.string()),
    examples: z.array(z.string()),
});

// Create the Zod schema for TermTuple based on the type
const TermTupleSchema: z.ZodType<TermTuple> = z.object({
    firstTerm: TermSchema,
    secondTerm: TermSchema,
});

const TermTupleListSchema: z.ZodType<{termTuples: TermTuple[]}> =  z.object({
    termTuples: z.array(TermTupleSchema)
});

export async function callWithPrompt(partialPrompt: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a flashcard generating assistant. Create 20 Term Tuples of French to English translations." },
            {
                role: "user",
                content: partialPrompt,
            },

        ],
        response_format: zodResponseFormat(TermTupleListSchema, "term_tuple_list_schema"),
    });
    console.log(completion.choices[0].message);
    return completion.choices[0].message.content; // TODO parse
}
