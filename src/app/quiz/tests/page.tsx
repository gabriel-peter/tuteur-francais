"use client";
import { Button } from "@/components/catalyst-ui/button";
import { ErrorMessage, Field } from "@/components/catalyst-ui/fieldset";
import { Input } from "@/components/catalyst-ui/input";
import { Text } from "@/components/catalyst-ui/text";
import * as Headless from '@headlessui/react'
import { useState } from "react";

export interface FillInBlank {
    sentence: string;
    hints: string[];
    answers: string[];
}


export default function Tests() {
    const testSentences: FillInBlank[] = [
        {
            sentence: "Hier, je suis allé au {0} avec mes amis pour voir un {1}.",
            hints: ["cinema", "movie"],
            answers: ["cinéma", "film"]
        },
        {
            sentence: "Le {0} était vraiment {1}, et nous avons tous été {2}.",
            hints: ["movie", "amazing", "impressed"],
            answers: ["film", "incroyable", "impressionnés"]
        },
        {
            sentence: "Après le {0}, nous sommes allés dans un {1} pour manger un {2} et boire un {3}.",
            hints: ["movie", "restaurant", "burger", "soda"],
            answers: ["film", "restaurant", "burger", "soda"]
        },
        {
            sentence: "C'était une soirée {0}!",
            hints: ["memorable"],
            answers: ["mémorable"]
        }
    ]
    return testSentences.map((sentenceWithAnswers) => sentenceWithInputs(sentenceWithAnswers))
}

// Helper function to mimic Map.get
function safeGet<T, K extends keyof T>(record: T, key: K): T[K] | undefined {
    return Object.prototype.hasOwnProperty.call(record, key) ? record[key] : undefined;
}



function sentenceWithInputs(testSentence: { sentence: string; hints: string[]; answers: string[]; }) {
    const [guesses, setGuesses] = useState<string[]>(Array(testSentence.answers.length).fill(null));
    const [answerState, setAnswerState] = useState<"UNANSWERED" | "INCORRECT" | "CORRECT">("UNANSWERED");
    const [errors, setErrors] = useState<Record<number, string>>({0: "Geki"})
    const updateItemAtIndex = (index: number, newValue: string) => {
        setGuesses((prevItems) => {
            const updatedItems = [...prevItems];  // Make a copy of the array
            updatedItems[index] = newValue;       // Update the specific index
            return updatedItems;                  // Set the new array as the updated state
        });
        console.log(guesses)
    }
    function checkInputs(guesses: string[], answers: string[]) {
        return guesses.map((guess, index) => guess.trim() === answers[index]);
    }
    switch (answerState) {
        case "UNANSWERED":
        case "INCORRECT":
        case "CORRECT":
    }
    return (
        <>
            <Headless.Field className="flex flex-wrap w-auto inline items-center gap-y-6">
                {testSentence.sentence.split(/\{(\d+)\}/g).map((match, index) => {
                    let placeholderIndex: number;

                    if (!isNaN(placeholderIndex = parseInt(match, 10))) {
                        let errorMessage = safeGet(errors, placeholderIndex)
                        return <Field><Input
                            key={placeholderIndex}
                            className="pl-5 
                         inline w-auto"
                            type="text"
                            value={guesses[placeholderIndex]}
                            invalid={errorMessage ? true : false}
                            onChange={(event) => updateItemAtIndex(placeholderIndex, event.currentTarget.value)}
                            placeholder={testSentence.hints[placeholderIndex]} />
                            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                        </Field>;
                    }
                    // TODO regex on punctuation and change styling.
                    return <Text className="pl-5 inline">{match}</Text>
                })}
            </Headless.Field>
            {
                guesses.every(value => value !== null) && <Button onSubmit={() => checkInputs(guesses, testSentence.answers)}>Submit</Button>
            }
        </>
    );
}
