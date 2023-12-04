import { KnitClient as Knit } from "@rbxts/knit";

declare global {
    interface KnitControllers {
        langapi: typeof langapi;
    }
}

const Player = Knit.Player
const StarterGui = Player.WaitForChild('PlayerGui')
const TranslationMain = StarterGui.WaitForChild('ScreenGui')
const TranslationFrame = TranslationMain.WaitForChild('Frame')
const TranslateBox = TranslationFrame.WaitForChild('Translate') as TextBox
const TranslateDisplay = TranslationFrame.WaitForChild('Translated') as TextLabel

const langapi = Knit.CreateController({
    Name: "langapi",

    KnitInit() {
    },

    KnitStart() {
        const langapiServer = Knit.GetService('langapi')
        print(langapiServer.TranslateTextPromise('Hello how are you?').expect())

        TranslateBox.FocusLost.Connect(() => {
            TranslateDisplay.Text = langapiServer.TranslateTextPromise(TranslateBox.Text).expect() as string
        })
    },
});

export = langapi;