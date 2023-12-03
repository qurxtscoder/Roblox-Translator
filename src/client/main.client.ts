import { KnitClient } from "@rbxts/knit";

KnitClient.AddControllersDeep(script.Parent?.FindFirstChild("controllers") as Folder);

KnitClient.Start().then(() => {
    print("Client starting!");
})

KnitClient.OnStart().then(() => {
    print("Client started!")
})