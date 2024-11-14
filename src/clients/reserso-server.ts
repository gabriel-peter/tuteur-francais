"use server"
import * as cheerio from 'cheerio';
import { modes } from './reverso-types';

export interface VerbTense {
    [tense: string]: string[];  // List of verb forms for each person in order (je, tu, il/elle, nous, vous, ils/elles)
}

// export interface VerbMode {
//     mode: string;            // The mode name (e.g., "Indicatif", "Subjonctif", "Conditionnel")
//     tenses: VerbTense[];     // List of tenses for the mode
// }


export type VerbMode = {
    [mode: string]: VerbTense[];
};

const CONJUGATION_URL = 'https://conjugator.reverso.net/conjugation-'
export async function getConjugaison(language: "french", verb: string): Promise<VerbMode> {
    return fetch(`${CONJUGATION_URL}${language}-verb-${encodeURIComponent(verb)}.html`,

        {
            method: 'GET',

            headers: {
                "Access-Control-Allow-Origin": "https://conjugator.reverso.net",
                "Access-Control-Allow-Headers": "*",
                'Content-Type': 'application/json',
                'Accept': 'text/html',
            },
            // You can also add this option to prevent credentials from being sent if not needed
            // credentials: 'omit',
        }).then(r => r.text()).then(parseVerbTenses)
}

/**
 * Function to parse verb tenses from the provided HTML.
 * @param {string} html - The HTML content containing verb tenses.
 * @returns {object} Parsed tenses grouped by mood and tense.
 */
function parseVerbTenses(html: string): VerbData {
    const $ = cheerio.load(html);
    const result: VerbData = {};

    // Iterate through each mood section (like "Indicatif", "Subjonctif", etc.)
    $('.word-wrap-simple .word-wrap-row').each((index, row) => {
        const moodSection = $(row).find('.word-wrap-title h4').text().trim();

        if (moodSection) {
            // Initialize mood in result if not already
            if (!result[moodSection]) {
                result[moodSection] = {};
            }

            // Iterate through each tense in the mood section
            $(row).find('.blue-box-wrap').each((index, tenseBlock) => {
                const tenseTitle = $(tenseBlock).find('p').text().trim();
                const conjugations = [];

                // Iterate through each verb conjugation in the tense block
                $(tenseBlock).find('.wrap-verbs-listing li').each((i, verbItem) => {
                    const verbText = $(verbItem).text().trim();
                    conjugations.push(verbText);
                });

                // Store the parsed conjugations under the mood and tense
                if (tenseTitle) {
                    result[moodSection][tenseTitle] = conjugations;
                }
            });
        }
    });

    return {...result};
}