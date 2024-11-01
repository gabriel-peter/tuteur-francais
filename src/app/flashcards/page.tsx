"use client"
import { useState } from "react";
import { Divider } from "../catalyst-ui/divider";
import { Heading } from "../catalyst-ui/heading";
import FlashCardMaker from "./flash-maker";
import Link from "next/link";
import { Button } from "@/app/catalyst-ui/button";
import { UrlObject } from "url";

export enum Language {
    ENGLISH = "English",
    FRENCH = "French"
}

export type Term = {
    word: string,
    type?: WordType
    otherPossibilies?: string[]
    language: Language,
    examples?: string[]
}

export type TermTuple = {
    firstTerm: Term,
    secondTerm: Term,
    assets?: {
        imgUrl: UrlObject
    }
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
        type: WordType.VERB,
        examples: ["Nous devons accroître nos efforts pour réussir.", "Ce médicament peut accroître les chances de guérison."]
      },
      secondTerm: {
        word: "Increase",
        language:Language.ENGLISH,
        type: WordType.VERB,
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
  

  export const foodTermTuples = [
    {
      firstTerm: {
        word: "Gourmandise",
        language:Language.FRENCH,
        examples: ["Sa gourmandise est évidente quand il voit des desserts.", "La gourmandise peut parfois être un défaut."]
      },
      secondTerm: {
        word: "Indulgence",
        language:Language.ENGLISH,
        examples: ["His indulgence is evident when he sees desserts.", "Indulgence can sometimes be a flaw."]
      }
    },
    {
      firstTerm: {
        word: "Épicer",
        language:Language.FRENCH,
        type: WordType.VERB,
        examples: ["J'aime épicer mes plats avec du poivre noir.", "Elle sait comment bien épicer un plat."]
      },
      secondTerm: {
        word: "Season",
        language:Language.ENGLISH,
        type: WordType.VERB,
        examples: ["I like to season my dishes with black pepper.", "She knows how to season a dish well."]
      }
    },
    {
      firstTerm: {
        word: "Savourer",
        language:Language.FRENCH,
        type: WordType.VERB,
        examples: ["Il aime savourer chaque bouchée de son repas.", "Savourer un bon vin est un plaisir."]
      },
      secondTerm: {
        word: "Savor",
        language:Language.ENGLISH,
        type: WordType.VERB,
        examples: ["He likes to savor every bite of his meal.", "Savoring a good wine is a pleasure."]
      }
    },
    {
      firstTerm: {
        word: "Délectable",
        language:Language.FRENCH,
        examples: ["Le dessert était absolument délectable.", "Ce restaurant est connu pour ses plats délectables."]
      },
      secondTerm: {
        word: "Delectable",
        language:Language.ENGLISH,
        examples: ["The dessert was absolutely delectable.", "This restaurant is known for its delectable dishes."]
      }
    },
    {
      firstTerm: {
        word: "Appétissant",
        language:Language.FRENCH,
        examples: ["L'odeur de la cuisine est appétissante.", "Les pâtisseries dans la vitrine sont appétissantes."]
      },
      secondTerm: {
        word: "Appetizing",
        language:Language.ENGLISH,
        examples: ["The smell from the kitchen is appetizing.", "The pastries in the display are appetizing."]
      }
    },
    {
      firstTerm: {
        word: "Dévorer",
        language:Language.FRENCH,
        type: WordType.VERB,
        examples: ["Il a dévoré son repas en quelques minutes.", "Les enfants dévorent leurs sucreries."]
      },
      secondTerm: {
        word: "Devour",
        language:Language.ENGLISH,
        type: WordType.VERB,
        examples: ["He devoured his meal in minutes.", "The children devour their sweets."]
      }
    },
    {
      firstTerm: {
        word: "Gastronomie",
        language:Language.FRENCH,
        examples: ["La gastronomie française est célèbre dans le monde entier.", "Ils étudient la gastronomie pour devenir chefs."]
      },
      secondTerm: {
        word: "Gastronomy",
        language:Language.ENGLISH,
        examples: ["French gastronomy is famous worldwide.", "They study gastronomy to become chefs."]
      }
    },
    {
      firstTerm: {
        word: "Fermentation",
        language:Language.FRENCH,
        examples: ["La fermentation est essentielle pour le vin.", "Le processus de fermentation est complexe."]
      },
      secondTerm: {
        word: "Fermentation",
        language:Language.ENGLISH,
        examples: ["Fermentation is essential for wine.", "The fermentation process is complex."]
      }
    },
    {
      firstTerm: {
        word: "Raffiné",
        language:Language.FRENCH,
        examples: ["Il aime les plats raffinés et sophistiqués.", "Le chocolat belge est souvent raffiné."]
      },
      secondTerm: {
        word: "Refined",
        language:Language.ENGLISH,
        examples: ["He enjoys refined and sophisticated dishes.", "Belgian chocolate is often refined."]
      }
    },
    {
      firstTerm: {
        word: "Assaisonnement",
        language:Language.FRENCH,
        examples: ["L'assaisonnement est crucial pour un bon plat.", "Elle utilise un assaisonnement maison."]
      },
      secondTerm: {
        word: "Seasoning",
        language:Language.ENGLISH,
        examples: ["Seasoning is crucial for a good dish.", "She uses homemade seasoning."]
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

                <CardGrid>
                    {advancedTermTuples.map((item, index) => <Card item={item} key={index}/>)}
                </CardGrid>
            </div>
        </div>)
}

export const CardGrid = ({ children }: { children: Readonly<React.ReactNode> }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {children}
            </div>
        </div>
    );
};

export const Card = ({ item}: { item: TermTuple }) => {
    const [isFlipped, flip] = useState(false);
    return (
        <div
        onClick={() => flip(!isFlipped)}
        className="rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105"
    >
        <h2 className="text-xl font-semibold mb-2">{isFlipped ? item.secondTerm.word : item.firstTerm.word}</h2>
    </div>
    )

}

