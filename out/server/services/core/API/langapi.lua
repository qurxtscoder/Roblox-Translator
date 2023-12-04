-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitServer
local HttpService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").HttpService
local url = "https://google-translate1.p.rapidapi.com/language/translate/v2/"
local options = {
	["content-type"] = "application/x-www-form-urlencoded",
	["X-RapidAPI-Key"] = "",
	["X-RapidAPI-Host"] = "google-translate1.p.rapidapi.com",
}
local function createTranslationPayload(text, sourceLanguage)
	local encodedText = HttpService:UrlEncode(text)
	local payload = "q=" .. (encodedText .. ("&target=es&source=" .. sourceLanguage))
	return payload
end
local function DetectLang(text)
	return TS.Promise.new(function(resolve, reject)
		TS.try(function()
			local postData = "q=" .. text
			local response = HttpService:RequestAsync({
				Url = url .. "detect",
				Method = "POST",
				Headers = options,
				Body = postData,
			})
			if response.Success then
				resolve((HttpService:JSONDecode(response.Body)).data.detections[1][1].language)
			else
				reject("Detection failed. StatusCode: " .. (tostring(response.StatusCode) .. (", StatusMessage: " .. response.StatusMessage)))
			end
		end, function(error)
			reject(error)
		end)
	end)
end
local function TranslateText(text, lang)
	return TS.Promise.new(function(resolve, reject)
		TS.try(function()
			local response = HttpService:RequestAsync({
				Url = url,
				Method = "POST",
				Headers = options,
				Body = createTranslationPayload(text, lang),
			})
			if response.Success then
				local translatedText = response.Body
				resolve((HttpService:JSONDecode(translatedText)).data.translations[1].translatedText)
			else
				reject("Translation failed. StatusCode: " .. (tostring(response.StatusCode) .. (", StatusMessage: " .. response.StatusMessage)))
			end
		end, function(error)
			reject(error)
		end)
	end)
end
local langapi = Knit.CreateService({
	Name = "langapi",
	Client = {
		TranslateText = function(self, _, text)
			local lang = DetectLang(text):expect()
			local translationResult = TranslateText(text, lang):expect()
			return translationResult
		end,
	},
	KnitInit = function(self) end,
	KnitStart = function(self) end,
})
return langapi
