-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitClient
local Client = Knit.Player
local Replica = nil
local queue = Knit.CreateController({
	Name = "queue",
	KnitInit = function(self)
		local dataController = Knit.GetController("data")
		local replica = if dataController.isClientLoaded then _G.Replicas[Client.Name] else (dataController.clientLoaded:Wait())
		Replica = replica
	end,
	KnitStart = function(self)
		Replica:ListenToChange({ "Money" }, function(_new)
			return print(_new)
		end)
	end,
})
return queue
