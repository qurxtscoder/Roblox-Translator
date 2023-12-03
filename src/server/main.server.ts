import { KnitServer } from "@rbxts/knit";

KnitServer.AddServicesDeep(script.Parent?.FindFirstChild("services") as Folder);

KnitServer.Start().then(() => {
    print("Server starting!");
})

KnitServer.OnStart().then(() => {
    print("Server started!")
})