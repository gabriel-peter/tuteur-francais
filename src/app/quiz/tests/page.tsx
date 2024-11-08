import { Input } from "@/components/catalyst-ui/input";
import { Text } from "@/components/catalyst-ui/text";
import * as Headless from '@headlessui/react'


export default function Tests() {
    const testSentence = {
        sentence: "Je vais au {0} ce soir pour regarder un {1}.",
        hints: ["cinema", "movie"],
        answers: ['cinéma', "film"]
    }
    const regex = /{(\d+)}/g; // Matches placeholders like {0}, {1}, etc.
    return (

        <Text>
            <Headless.Field className="flex items-center justify-center gap-6">
                {testSentence.sentence.split(" ").map((token: string) => {
                    let match;
                    if ((match = regex.exec(token)) !== null) {
                        const placeholderIndex = parseInt(match[1], 10); // Extracts the index as a number
                        return <Input className="inline w-auto" type="text" placeholder={testSentence.hints[placeholderIndex]} />
                    }
                    return token + " "
                })}
            </Headless.Field>
        </Text>
    )
}