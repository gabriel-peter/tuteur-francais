"use client"
import { useState } from "react";
import { Divider } from "../catalyst-ui/divider";
import { Heading } from "../catalyst-ui/heading";
import FlashCardMaker from "./flash-maker";
import Link from "next/link";
import { Button } from "@/app/catalyst-ui/button";

export enum Language {
    ENGLISH = "English",
    FRENCH = "French"
}

export type Term = {
    word: string,
    otherPossibilies?: string[]
    language: Language,
    examples?: string[]
}

export type TermTuple = {
    firstTerm: Term,
    secondTerm: Term,
}

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

export const advancedTermTuples: TermTuple[] = [
    {
      firstTerm: {
        word: "Accroître",
        language: Language.FRENCH,
        examples: ["Nous devons accroître nos efforts pour réussir.", "Ce médicament peut accroître les chances de guérison."]
      },
      secondTerm: {
        word: "Increase",
        language:Language.ENGLISH,
        examples: ["We need to increase our efforts to succeed.", "This medication can increase the chances of recovery."]
      }
    },
    {
      firstTerm: {
        word: "Éloquent",
        language: Language.FRENCH,
        examples: ["Son discours était extrêmement éloquent.", "Elle est connue pour être une oratrice éloquente."]
      },
      secondTerm: {
        word: "Eloquent",
        language:Language.ENGLISH,
        examples: ["His speech was extremely eloquent.", "She is known for being an eloquent speaker."]
      }
    },
    {
      firstTerm: {
        word: "Considérable",
        language: Language.FRENCH,
        examples: ["Ils ont investi une somme considérable dans ce projet.", "Le temps de réponse est considérablement amélioré."]
      },
      secondTerm: {
        word: "Considerable",
        language:Language.ENGLISH,
        examples: ["They invested a considerable amount in this project.", "The response time is considerably improved."]
      }
    },
    {
      firstTerm: {
        word: "Négliger",
        language: Language.FRENCH,
        examples: ["Il ne faut pas négliger les détails.", "Elle a négligé ses responsabilités importantes."]
      },
      secondTerm: {
        word: "Neglect",
        language:Language.ENGLISH,
        examples: ["One must not neglect the details.", "She neglected her important responsibilities."]
      }
    },
    {
      firstTerm: {
        word: "Audacieux",
        language: Language.FRENCH,
        examples: ["Il a fait un choix audacieux en quittant son emploi.", "Cette couleur est un choix audacieux pour la décoration."]
      },
      secondTerm: {
        word: "Bold",
        language:Language.ENGLISH,
        examples: ["He made a bold choice by quitting his job.", "This color is a bold choice for the decor."]
      }
    },
    {
      firstTerm: {
        word: "Embrouiller",
        language: Language.FRENCH,
        examples: ["Les instructions étaient tellement compliquées qu'elles l'ont embrouillé.", "Le labyrinthe était conçu pour embrouiller les visiteurs."]
      },
      secondTerm: {
        word: "Confuse",
        language:Language.ENGLISH,
        examples: ["The instructions were so complicated that they confused him.", "The maze was designed to confuse visitors."]
      }
    },
    {
      firstTerm: {
        word: "Prospérité",
        language: Language.FRENCH,
        examples: ["La prospérité économique a été bénéfique pour tous.", "Ils souhaitent atteindre la prospérité dans leur carrière."]
      },
      secondTerm: {
        word: "Prosperity",
        language:Language.ENGLISH,
        examples: ["Economic prosperity has benefited everyone.", "They wish to achieve prosperity in their careers."]
      }
    },
    {
      firstTerm: {
        word: "Optimiser",
        language: Language.FRENCH,
        examples: ["Nous devons optimiser notre stratégie pour obtenir de meilleurs résultats.", "Il est important d'optimiser l'utilisation des ressources."]
      },
      secondTerm: {
        word: "Optimize",
        language:Language.ENGLISH,
        examples: ["We need to optimize our strategy for better results.", "It is important to optimize the use of resources."]
      }
    },
    {
      firstTerm: {
        word: "Méticuleux",
        language: Language.FRENCH,
        examples: ["Elle a une approche méticuleuse du travail.", "Un travail méticuleux garantit une meilleure qualité."]
      },
      secondTerm: {
        word: "Meticulous",
        language:Language.ENGLISH,
        examples: ["She has a meticulous approach to her work.", "Meticulous work ensures better quality."]
      }
    },
    {
      firstTerm: {
        word: "Épanouissement",
        language: Language.FRENCH,
        examples: ["L'épanouissement personnel est essentiel pour une vie équilibrée.", "Ils soutiennent l'épanouissement de leurs employés."]
      },
      secondTerm: {
        word: "Fulfillment",
        language:Language.ENGLISH,
        examples: ["Personal fulfillment is essential for a balanced life.", "They support the fulfillment of their employees."]
      }
    }
  ];
  


export default function FlashCardHome() {
    return (
        <div>
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
                <Heading>Flash Cards</Heading>
                <div className="flex gap-4">
                    <Button href="/flashcards/quiz">Quiz</Button> 
                    <FlashCardMaker />
                </div>
            </div>
            <Divider />
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">

                <CardGrid items={advancedTermTuples} />
            </div>
        </div>)
}

const CardGrid = ({ items }: { items: TermTuple[] }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item, index) => <Card item={item} index={index}/>)}
            </div>
        </div>
    );
};

const Card = ({ item, index }: { item: TermTuple, index: number }) => {
    const [isFlipped, flip] = useState(false);
    return (
        <div
        onClick={() => flip(!isFlipped)}
        key={index}
        className="rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105"
    >
        <h2 className="text-xl font-semibold mb-2">{isFlipped ? item.secondTerm.word : item.firstTerm.word}</h2>
    </div>
    )

}

