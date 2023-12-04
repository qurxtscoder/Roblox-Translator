-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitClient
local Player = Knit.Player
local StarterGui = Player:WaitForChild("PlayerGui")
local TranslationMain = StarterGui:WaitForChild("ScreenGui")
local TranslationFrame = TranslationMain:WaitForChild("Frame")
local TranslateBox = TranslationFrame:WaitForChild("Translate")
local TranslateDisplay = TranslationFrame:WaitForChild("Translated")
local langapi = Knit.CreateController({
	Name = "langapi",
	KnitInit = function(self) end,
	KnitStart = function(self)
		local langapiServer = Knit.GetService("langapi")
		print((langapiServer:TranslateTextPromise("Hello how are you?"):expect()))
		TranslateBox.FocusLost:Connect(function()
			TranslateDisplay.Text = langapiServer:TranslateTextPromise(TranslateBox.Text):expect()
		end)
	end,
})
return langapi
