
export async function reverso(text: string) {
    return fetch("https://api.reverso.net/translate/v1/translation", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            format: 'text',
            from: "fr",
            input: text,
            options: {
                contextResults: true,
                languageDetection: true,
                origin: 'reversomobile',
                sentenceSplitter: false,
            },
            to: "en"
        })
    })
        .then(res => res.json());
    // .then(res => )
    // .then(res => console.log(res))
}
