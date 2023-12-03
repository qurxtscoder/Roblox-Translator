-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local KnitServer = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitServer
local _fn = KnitServer
local _result = script.Parent
if _result ~= nil then
	_result = _result:FindFirstChild("services")
end
_fn.AddServicesDeep(_result)
local _exp = KnitServer.Start()
local _arg0 = function()
	print("Server starting!")
end
_exp:andThen(_arg0)
local _exp_1 = KnitServer.OnStart()
local _arg0_1 = function()
	print("Server started!")
end
_exp_1:andThen(_arg0_1)
