-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitServer
local ReplicaService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "replicaservice", "src").ReplicaService
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local DataStore = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "suphi-datastore", "out")
local DataTemplate = TS.import(script, game:GetService("ServerScriptService"), "TS", "services", "data", "template").PlayerData
local PlayerDataReplicaWriteLib = ReplicatedStorage:WaitForChild("TS"):WaitForChild("PlayerData")
local data = Knit.CreateService({
	Name = "data",
	replicas = {},
	getReplicaFromPlayer = function(self, player)
		local _replicas = self.replicas
		local _userId = player.UserId
		return _replicas[_userId]
	end,
	getPlayerFromReplica = function(self, replica)
		for _k, _v in self.replicas do
			local obj = { _k, _v }
			if obj[2] == replica then
				return Players:GetPlayerByUserId(obj[1])
			end
		end
	end,
	KnitInit = function(self)
		Players.PlayerAdded:Connect(function(player)
			local dataStore = DataStore.new("Player", tostring(player.UserId))
			local success = dataStore:Open(DataTemplate)
			if success ~= "Success" then
				player:Kick("Failed to load data store.")
			end
			local PlayerDataReplica = ReplicaService.NewReplica({
				ClassToken = ReplicaService.NewClassToken("PlayerData"),
				Data = dataStore.Value,
				Replication = player,
				WriteLib = PlayerDataReplicaWriteLib,
			})
			local _replicas = self.replicas
			local _userId = player.UserId
			_replicas[_userId] = PlayerDataReplica
			while true do
				local _value = task.wait(1)
				if not (_value ~= 0 and (_value == _value and _value)) then
					break
				end
				local replica = self:getReplicaFromPlayer(player)
				local _result = replica
				if _result ~= nil then
					_result:SetValue({ "Money" }, replica.Data.Money + 500)
				end
			end
		end)
		Players.PlayerRemoving:Connect(function(player)
			local dataStore = DataStore.find("Player", tostring(player.UserId))
			local _result = dataStore
			if _result ~= nil then
				_result:Destroy()
			end
			local _replicas = self.replicas
			local _userId = player.UserId
			_replicas[_userId] = nil
		end)
	end,
})
return data
