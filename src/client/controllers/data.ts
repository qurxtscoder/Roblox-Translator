import { KnitClient as Knit, Signal } from "@rbxts/knit";
import { ReplicaController } from "@rbxts/replicaservice";

declare global {
    interface KnitControllers {
        data: typeof data;
    }
}

declare global {
    interface _G {
        Replicas: { [player: string]: any };
    }
}

const Client = Knit.Player

_G.Replicas = {};

const data = Knit.CreateController({
    Name: "data",

    isClientLoaded: false,
    clientLoaded: new Signal(),

    KnitInit() {
        ReplicaController.ReplicaOfClassCreated("PlayerData", (replica) => {
            const Player: Player = replica.Tags.Player;
            const Name: string = Player.Name;

            _G.Replicas[Name] = replica

            if (Player === Client) {
                this.clientLoaded.Fire(replica)
                this.isClientLoaded = true;
            }
        });

        ReplicaController.RequestData();
    },

    KnitStart() {
    },
});

export = data;