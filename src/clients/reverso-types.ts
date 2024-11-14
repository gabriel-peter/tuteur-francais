export const modes = ['Indicatif', "Subjonctif", 'Conditionnel', 'Participe', 'ImpératifInfinitif']
export const subjects = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']
export const tensePerMode = {
    'Indicatif': [
        'Présent',
        'Imparfait',
        'Futur',
    ],
    "Subjonctif": [
        'Passé antérieur',
        'Futur antérieur',
        'Présent'
    ],
    'Conditionnel': [
        'Présent',
        'Passé première forme',
        'Passé deuxième forme'
    ],
    'Participe': [
        'Présent',
        'Passé composé',
        'Passé'
    ],
    'ImpératifInfinitif': [
        'Présent',
        'Passé'
    ]
}

/**
 *
 * @returns {
    "Indicatif": {
        "Présent": [
            "j'ai",
            "tu as",
            "il/elle a",
            "nous avons",
            "vous avez",
            "ils/elles ont"
        ],
        "Imparfait": [
            "j'avais",
            "tu avais",
            "il/elle avait",
            "nous avions",
            "vous aviez",
            "ils/elles avaient"
        ],
        "Futur": [
            "j'aurai",
            "tu auras",
            "il/elle aura",
            "nous aurons",
            "vous aurez",
            "ils/elles auront"
        ]
    },
    "Subjonctif": {
        "Passé antérieur": [
            "j'eus eu",
            "tu eus eu",
            "il/elle eut eu",
            "nous eûmes eu",
            "vous eûtes eu",
            "ils/elles eurent eu"
        ],
        "Futur antérieur": [
            "j'aurai eu",
            "tu auras eu",
            "il/elle aura eu",
            "nous aurons eu",
            "vous aurez eu",
            "ils/elles auront eu"
        ],
        "Présent": [
            "que j'aie",
            "que tu aies",
            "qu'il/elle ait",
            "que nous ayons",
            "que vous ayez",
            "qu'ils/elles aient"
        ]
    },
    "Conditionnel": {
        "Présent": [
            "j'aurais",
            "tu aurais",
            "il/elle aurait",
            "nous aurions",
            "vous auriez",
            "ils/elles auraient"
        ],
        "Passé première forme": [
            "j'aurais eu",
            "tu aurais eu",
            "il/elle aurait eu",
            "nous aurions eu",
            "vous auriez eu",
            "ils/elles auraient eu"
        ],
        "Passé deuxième forme": [
            "j'eusse eu",
            "tu eusses eu",
            "il/elle eût eu",
            "nous eussions eu",
            "vous eussiez eu",
            "ils/elles eussent eu"
        ]
    },
    "Participe": {
        "Présent": [
            "ayant"
        ],
        "Passé composé": [
            "ayant eu"
        ],
        "Passé": [
            "masc.sg.: eu",
            "masc.pl.: eus",
            "fém.sg.: eue",
            "fém.pl.: eues"
        ]
    },
    "ImpératifInfinitif": {
        "Présent": [
            "avoir"
        ],
        "Passé": [
            "aie eu",
            "ayons eu",
            "ayez eu"
        ]
    }
}
 */
