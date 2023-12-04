import { KnitServer as Knit } from "@rbxts/knit";
import { ReplicaService, Replica } from "@rbxts/replicaservice";
import { Players, ReplicatedStorage } from "@rbxts/services";
import DataStore from "@rbxts/suphi-datastore";

import { PlayerData } from "./template.d";
import { PlayerData as DataTemplate } from "./template"

const PlayerDataReplicaWriteLib: ModuleScript = ReplicatedStorage.WaitForChild("TS").WaitForChild("PlayerData") as ModuleScript; // This varies depending on your "default.project.json" paths.

declare global {
    interface KnitServices {
        data: typeof data;
    }
}

const data = Knit.CreateService({

    Name: "data",

    replicas: new Map<number, Replica | undefined>(),

    Client: {
        getDataFromPlayer(_: Player, player: Player): PlayerData | undefined {
            const replica = data.replicas.get(player.UserId);
            if (replica) return replica.Data;
        }
    },

    getReplicaFromPlayer(player: Player): Replica | undefined {
        return this.replicas.get(player.UserId);
    },

    getPlayerFromReplica(replica: unknown): Player | undefined {
        for (const obj of this.replicas) {
            if (obj[1] === replica) {
                return Players.GetPlayerByUserId(obj[0]);
            }
        }
    },

    KnitInit() {
        Players.PlayerAdded.Connect((player: Player) => {
            const dataStore = new DataStore<PlayerData>("Player", tostring(player.UserId));
            const [success] = dataStore.Open(DataTemplate);

            if (success !== "Success") player.Kick("Failed to load data store.");

            const PlayerDataReplica = ReplicaService.NewReplica({
                ClassToken: ReplicaService.NewClassToken("PlayerData"),
                Data: dataStore.Value,
                Replication: "All",
                WriteLib: PlayerDataReplicaWriteLib,
                Tags: {
                    "Player": player,
                    "Time Joined": os.time()
                }
            });

            this.replicas.set(player.UserId, PlayerDataReplica);

            while (task.wait(1)) {
                const replica = this.getReplicaFromPlayer(player)
                replica?.SetValue(["Money"], replica.Data.Money + 500)
            }
        });

        Players.PlayerRemoving.Connect((player: Player) => {
            const dataStore = DataStore.find<PlayerData>("Player", tostring(player.UserId));
            dataStore?.Destroy();

            this.replicas.set(player.UserId, undefined);
        });
    }
});

export = data;