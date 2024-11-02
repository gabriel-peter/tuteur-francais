import { TermTuple, WordType } from "@/data/types";
import { Language } from "@/data/types";

export const idiomTermTuples: TermTuple[] = [
    {
      firstTerm: {
        word: "Rat race",
        language: Language.ENGLISH,
        examples: ["In the daily rat race, getting closer to oneself is a real challenge."]
      },
      secondTerm: {
        word: "Course effrénée",
        language:Language.FRENCH,
        examples: ["Dans la course effrénée du quotidien, se rapprocher de soi-même constitue un vrai défi."]
      }
    },
    {
      firstTerm: {
        word: "On the rise",
        language:Language.ENGLISH,
        examples: ["Online music consumption is on the rise."]
      },
      secondTerm: {
        word: "En hausse",
        language:Language.FRENCH,
        examples: ["La consommation de musique en ligne est en hausse."]
      }
    },
    {
      firstTerm: {
        word: "Life of the party",
        language:Language.ENGLISH,
        examples: ["Whenever Michael enters the room, he instantly becomes the life of the party."]
      },
      secondTerm: {
        word: "Roi de la fête",
        language:Language.FRENCH,
        examples: ["Dès que Michael entre dans la salle, il devient instantanément le roi de la fête."]
      }
    },
    {
      firstTerm: {
        word: "In the dark",
        language:Language.ENGLISH,
        examples: ["I would like some information because I believe that we are being kept in the dark about this."]
      },
      secondTerm: {
        word: "Dans l'ignorance",
        language:Language.FRENCH,
        examples: ["Je voudrais quelques informations, parce que je crois qu'on nous laisse dans l'ignorance à ce sujet."]
      }
    },
    {
      firstTerm: {
        word: "Diamond in the rough",
        language:Language.ENGLISH,
        examples: ["Jake's kind of a diamond in the rough and it's well worth giving him a chance."]
      },
      secondTerm: {
        word: "Diamant brut",
        language:Language.FRENCH,
        examples: ["Jake est un vrai diamant brut qui mérite qu'on lui donne une chance."]
      }
    },
    {
      firstTerm: {
        word: "Come clean",
        language:Language.ENGLISH,
        examples: ["It is time to come clean about that meeting."]
      },
      secondTerm: {
        word: "Dire la vérité",
        language:Language.FRENCH,
        examples: ["Il est temps de dire la vérité sur cette réunion."]
      }
    },
    {
      firstTerm: {
        word: "Can of worms",
        language:Language.ENGLISH,
        examples: ["I'd rather not even open up this can of worms if I don't have to."]
      },
      secondTerm: {
        word: "Sac de noeuds",
        language:Language.FRENCH,
        examples: ["Je préférerais ne pas avoir à démêler ce sac de noeuds si possible."]
      }
    },
    {
      firstTerm: {
        word: "Break free",
        language:Language.ENGLISH,
        examples: ["We have helped thousands of people break free from their financial problems."]
      },
      secondTerm: {
        word: "Se libérer",
        language:Language.FRENCH,
        examples: ["Nous avons aidé des milliers de personnes à se libérer de leurs problèmes financiers."]
      }
    },
    {
      firstTerm: {
        word: "Bread and butter",
        language:Language.ENGLISH,
        examples: ["Risk management is our daily bread and butter."]
      },
      secondTerm: {
        word: "Pain quotidien",
        language:Language.FRENCH,
        examples: ["La gestion des risques est notre pain quotidien."]
      }
    },
    {
      firstTerm: {
        word: "Above and beyond",
        language:Language.ENGLISH,
        examples: ["The service we've received from their team has consistently been above and beyond our expectations."]
      },
      secondTerm: {
        word: "Au-delà de",
        language:Language.FRENCH,
        examples: ["Le service que nous avons reçu de leur équipe a toujours été au-delà de nos attentes."]
      }
    },
    {
      firstTerm: {
        word: "Word of mouth",
        language:Language.ENGLISH,
        examples: ["Customer reviews are the modern-day equivalent of good old-fashioned word of mouth."]
      },
      secondTerm: {
        word: "Bouche-à-oreille",
        language:Language.FRENCH,
        examples: ["Les évaluations des clients correspondent à l'équivalent moderne du bon vieux bouche-à-oreille."]
      }
    },
    {
      firstTerm: {
        word: "Under the weather",
        language:Language.ENGLISH,
        examples: ["I'm a little tired, kind of under the weather."]
      },
      secondTerm: {
        word: "Patraque",
        language:Language.FRENCH,
        examples: ["Je suis un peu fatigué, je me sens patraque."]
      }
    },
    {
      firstTerm: {
        word: "Under the gun",
        language:Language.ENGLISH,
        examples: ["Creative teams are constantly under the gun to deliver compelling, innovative campaigns."]
      },
      secondTerm: {
        word: "Sous pression",
        language:Language.FRENCH,
        examples: ["Les équipes de création sont constamment sous pression pour livrer des campagnes attractives et innovantes."]
      }
    }
  ];

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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
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
            language: Language.ENGLISH,
            examples: ["Personal fulfillment is essential for a balanced life.", "They support the fulfillment of their employees."]
        }
    }
];


export const foodTermTuples = [
    {
        firstTerm: {
            word: "Gourmandise",
            language: Language.FRENCH,
            examples: ["Sa gourmandise est évidente quand il voit des desserts.", "La gourmandise peut parfois être un défaut."]
        },
        secondTerm: {
            word: "Indulgence",
            language: Language.ENGLISH,
            examples: ["His indulgence is evident when he sees desserts.", "Indulgence can sometimes be a flaw."]
        }
    },
    {
        firstTerm: {
            word: "Épicer",
            language: Language.FRENCH,
            type: WordType.VERB,
            examples: ["J'aime épicer mes plats avec du poivre noir.", "Elle sait comment bien épicer un plat."]
        },
        secondTerm: {
            word: "Season",
            language: Language.ENGLISH,
            type: WordType.VERB,
            examples: ["I like to season my dishes with black pepper.", "She knows how to season a dish well."]
        }
    },
    {
        firstTerm: {
            word: "Savourer",
            language: Language.FRENCH,
            type: WordType.VERB,
            examples: ["Il aime savourer chaque bouchée de son repas.", "Savourer un bon vin est un plaisir."]
        },
        secondTerm: {
            word: "Savor",
            language: Language.ENGLISH,
            type: WordType.VERB,
            examples: ["He likes to savor every bite of his meal.", "Savoring a good wine is a pleasure."]
        }
    },
    {
        firstTerm: {
            word: "Délectable",
            language: Language.FRENCH,
            examples: ["Le dessert était absolument délectable.", "Ce restaurant est connu pour ses plats délectables."]
        },
        secondTerm: {
            word: "Delectable",
            language: Language.ENGLISH,
            examples: ["The dessert was absolutely delectable.", "This restaurant is known for its delectable dishes."]
        }
    },
    {
        firstTerm: {
            word: "Appétissant",
            language: Language.FRENCH,
            examples: ["L'odeur de la cuisine est appétissante.", "Les pâtisseries dans la vitrine sont appétissantes."]
        },
        secondTerm: {
            word: "Appetizing",
            language: Language.ENGLISH,
            examples: ["The smell from the kitchen is appetizing.", "The pastries in the display are appetizing."]
        }
    },
    {
        firstTerm: {
            word: "Dévorer",
            language: Language.FRENCH,
            type: WordType.VERB,
            examples: ["Il a dévoré son repas en quelques minutes.", "Les enfants dévorent leurs sucreries."]
        },
        secondTerm: {
            word: "Devour",
            language: Language.ENGLISH,
            type: WordType.VERB,
            examples: ["He devoured his meal in minutes.", "The children devour their sweets."]
        }
    },
    {
        firstTerm: {
            word: "Gastronomie",
            language: Language.FRENCH,
            examples: ["La gastronomie française est célèbre dans le monde entier.", "Ils étudient la gastronomie pour devenir chefs."]
        },
        secondTerm: {
            word: "Gastronomy",
            language: Language.ENGLISH,
            examples: ["French gastronomy is famous worldwide.", "They study gastronomy to become chefs."]
        }
    },
    {
        firstTerm: {
            word: "Fermentation",
            language: Language.FRENCH,
            examples: ["La fermentation est essentielle pour le vin.", "Le processus de fermentation est complexe."]
        },
        secondTerm: {
            word: "Fermentation",
            language: Language.ENGLISH,
            examples: ["Fermentation is essential for wine.", "The fermentation process is complex."]
        }
    },
    {
        firstTerm: {
            word: "Raffiné",
            language: Language.FRENCH,
            examples: ["Il aime les plats raffinés et sophistiqués.", "Le chocolat belge est souvent raffiné."]
        },
        secondTerm: {
            word: "Refined",
            language: Language.ENGLISH,
            examples: ["He enjoys refined and sophisticated dishes.", "Belgian chocolate is often refined."]
        }
    },
    {
        firstTerm: {
            word: "Assaisonnement",
            language: Language.FRENCH,
            examples: ["L'assaisonnement est crucial pour un bon plat.", "Elle utilise un assaisonnement maison."]
        },
        secondTerm: {
            word: "Seasoning",
            language: Language.ENGLISH,
            examples: ["Seasoning is crucial for a good dish.", "She uses homemade seasoning."]
        }
    }
];
  