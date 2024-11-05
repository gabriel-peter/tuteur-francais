
export async function reverso(text: string, from: "fr" | "en",  to: "fr" | "en") {
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
    // .then(res => )
    // .then(res => console.log(res))
}
