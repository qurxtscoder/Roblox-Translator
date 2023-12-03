local RunService = game:GetService("RunService")
local ServerScriptService = game:GetService("ServerScriptService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local ServerFolder = script:FindFirstChild("server") --server will already have moved this on client join
local SharedFolder = script:WaitForChild("shared")

local ReplicaService = ServerFolder and ServerFolder:WaitForChild("ReplicaService") or nil
local ReplicaController = SharedFolder:WaitForChild("ReplicaController")

if RunService:IsServer() then
	ServerFolder.Parent = ServerScriptService
else
	SharedFolder.Parent = ReplicatedStorage
end

return {
	ReplicaService = RunService:IsServer() and require(ReplicaService) or {},
	ReplicaController = RunService:IsClient() and require(ReplicaController) or {},
}