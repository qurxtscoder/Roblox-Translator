import { KnitServer as Knit } from "@rbxts/knit";
import { reject, resolve } from "@rbxts/knit/Knit/Util/Promise";
import { HttpService } from "@rbxts/services";
import DataStore from "@rbxts/suphi-datastore";

declare global {
    interface KnitServices {
        langapi: typeof langapi;
    }
}

const url = "https://google-translate1.p.rapidapi.com/language/translate/v2/"
const options = {
    ["content-type"]: "application/x-www-form-urlencoded",
    ["X-RapidAPI-Key"]: "x-api-key-here",
    ["X-RapidAPI-Host"]: "google-translate1.p.rapidapi.com",
}

function createTranslationPayload(text: string, sourceLanguage: string): string {
    const encodedText = HttpService.UrlEncode(text);
    const payload = `q=${encodedText}&target=es&source=${sourceLanguage}`;
    return payload;
}

function DetectLang(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const postData = `q=${text}`;
            const response = HttpService.RequestAsync({
                Url: url + 'detect',
                Method: 'POST',
                Headers: options,
                Body: postData
            });

            if (response.Success) {
                resolve((HttpService.JSONDecode(response.Body as string) as any).data.detections[0][0].language)
            } else {
                reject(`Detection failed. StatusCode: ${response.StatusCode}, StatusMessage: ${response.StatusMessage}`)
            }
        } catch (error) {
            reject(error)
        }
    })
}

function TranslateText(text: string, lang: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        try {
            const response = HttpService.RequestAsync({
                Url: url,
                Method: 'POST',
                Headers: options,
                Body: createTranslationPayload(text, lang),
            });
            if (response.Success) {
                const translatedText: string = response.Body as string;
                resolve((HttpService.JSONDecode(translatedText as string) as any).data.translations[0].translatedText)
            } else {
                reject(`Translation failed. StatusCode: ${response.StatusCode}, StatusMessage: ${response.StatusMessage}`);
            }
        } catch (error) {
            reject(error);
        }
    });
}


const langapi = Knit.CreateService({
    Name: "langapi",

    Client: {
        TranslateText(_: Player, text: string) {
            const lang = DetectLang(text).expect()
            const translationResult = TranslateText(text, lang).expect()
            return translationResult
        }
    },

    KnitInit() {
    },

    KnitStart() {
    },
});

export = langapi;
