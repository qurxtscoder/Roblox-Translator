import { KnitClient as Knit } from "@rbxts/knit";
import { PlayerDataReplica } from "server/services/data/Replicas";

declare global {
    interface KnitControllers {
        queue: typeof queue;
    }
}

const Client = Knit.Player

let Replica: PlayerDataReplica = undefined as unknown as PlayerDataReplica

const queue = Knit.CreateController({
    Name: "queue",

    KnitInit() {
        const dataController = Knit.GetController("data")
        const replica = dataController.isClientLoaded ? _G.Replicas[Client.Name] : dataController.clientLoaded.Wait()[0]
        Replica = replica
    },

    KnitStart() {
        Replica.ListenToChange(["Money"], (_new) => print(_new))
    },
});

export = queue;