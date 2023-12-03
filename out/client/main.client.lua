-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local KnitClient = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitClient
local _fn = KnitClient
local _result = script.Parent
if _result ~= nil then
	_result = _result:FindFirstChild("controllers")
end
_fn.AddControllersDeep(_result)
local _exp = KnitClient.Start()
local _arg0 = function()
	print("Client starting!")
end
_exp:andThen(_arg0)
local _exp_1 = KnitClient.OnStart()
local _arg0_1 = function()
	print("Client started!")
end
_exp_1:andThen(_arg0_1)
