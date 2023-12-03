-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitClient
local ReplicaController = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "replicaservice", "src").ReplicaController
local data = Knit.CreateController({
	Name = "data",
	KnitInit = function(self)
		ReplicaController.ReplicaOfClassCreated("PlayerData", function(replica)
			print("PlayerData replica received! Received player money: " .. tostring(replica.Data.Money))
			local DataServer = Knit.GetService("data")
			print((DataServer:getDataForPlayerPromise():expect()))
			replica:ListenToChange({ "Money" }, function(newValue)
				print("Money changed: " .. tostring(newValue))
			end)
		end)
		ReplicaController.RequestData()
	end,
	KnitStart = function(self) end,
})
return data
