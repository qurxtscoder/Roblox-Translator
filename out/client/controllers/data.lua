-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _knit = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit")
local Knit = _knit.KnitClient
local Signal = _knit.Signal
local ReplicaController = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "replicaservice", "src").ReplicaController
local Client = Knit.Player
_G.Replicas = {}
local data = Knit.CreateController({
	Name = "data",
	isClientLoaded = false,
	clientLoaded = Signal.new(),
	KnitInit = function(self)
		ReplicaController.ReplicaOfClassCreated("PlayerData", function(replica)
			local Player = replica.Tags.Player
			local Name = Player.Name
			_G.Replicas[Name] = replica
			if Player == Client then
				self.clientLoaded:Fire(replica)
				self.isClientLoaded = true
			end
		end)
		ReplicaController.RequestData()
	end,
	KnitStart = function(self) end,
})
return data
