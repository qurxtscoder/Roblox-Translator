-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Abbreviator = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "abbreviate", "src")
local Knit = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitServer
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local RunService = _services.RunService
local abbreviator = Abbreviator.new()
abbreviator:setSetting("suffixTable", { "k", "m", "b", "t", "qa", "qi", "sx", "sp", "oc", "no", "dd", "ud", "dd", "td", "qad", "qid", "sxd", "spd", "ocd", "nod", "vg", "uvg", "dvg", "tvg", "qavg", "qivg", "sxvg", "spvg", "ocvg" })
abbreviator:setSetting("decimalPlaces", 2)
local leaderstats = Knit.CreateService({
	Name = "leaderstats",
	emojis = {
		Money = "💰",
		Gems = "💎",
	},
	stats = { "Money", "Gems" },
	updateLeaderstatsForPlayer = function(self, player)
		local data = Knit.GetService("data")
		local replica = data:getReplicaFromPlayer(player)
		if replica == nil then
			return nil
		end
		local leaderstats = player:FindFirstChild("leaderstats")
		if leaderstats == nil then
			return nil
		end
		for key, value in pairs(replica.Data) do
			local emoji = self.emojis[key]
			local _fn = leaderstats
			local _condition = emoji
			if _condition ~= "" and _condition then
				_condition = emoji .. " "
			end
			local _condition_1 = _condition
			if not (_condition_1 ~= "" and _condition_1) then
				_condition_1 = ""
			end
			local stat = _fn:FindFirstChild(_condition_1 .. key)
			if stat == nil then
				continue
			end
			stat.Value = abbreviator:numberToString(value)
		end
	end,
	KnitInit = function(self)
		local data = Knit.GetService("data")
		local playerAdded = function(player)
			local replica = data:getReplicaFromPlayer(player)
			while replica == nil do
				RunService.Heartbeat:Wait()
				replica = data:getReplicaFromPlayer(player)
			end
			local leaderstats = Instance.new("Folder")
			leaderstats.Name = "leaderstats"
			leaderstats.Parent = player
			for key, value in pairs(replica.Data) do
				if not (table.find(self.stats, key) ~= nil) then
					continue
				end
				local stat = Instance.new("StringValue")
				local emoji = self.emojis[key]
				local _condition = emoji
				if _condition ~= "" and _condition then
					_condition = emoji .. " "
				end
				local _condition_1 = _condition
				if not (_condition_1 ~= "" and _condition_1) then
					_condition_1 = ""
				end
				stat.Name = _condition_1 .. key
				stat.Value = abbreviator:numberToString(value)
				stat.Parent = leaderstats
			end
		end
		Players.PlayerAdded:Connect(playerAdded)
		for _, player in Players:GetPlayers() do
			playerAdded(player)
		end
	end,
	KnitStart = function(self)
		task.spawn(function()
			while true do
				for _, player in Players:GetPlayers() do
					self:updateLeaderstatsForPlayer(player)
				end
				task.wait(0.1)
			end
		end)
	end,
})
return leaderstats
