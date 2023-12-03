import { KnitClient as Knit } from "@rbxts/knit";
import { Player } from "@rbxts/knit/Knit/KnitClient";
import { ReplicaController } from "@rbxts/replicaservice";

declare global {
    interface KnitControllers {
        data: typeof data;
    }
}

const data = Knit.CreateController({
    Name: "data",

    KnitInit() {
        ReplicaController.ReplicaOfClassCreated("PlayerData", (replica) => {
            print(
                `PlayerData replica received! Received player money: ${replica.Data.Money}`
            );
            const DataServer = Knit.GetService('data')
            print(DataServer.getDataForPlayerPromise().expect())

            replica.ListenToChange(["Money"], (newValue) => {
                print(`Money changed: ${newValue}`);
            });
        });

        ReplicaController.RequestData(); // This function should only be called once in the entire codebase! Read the documentation for more information.
    },

    KnitStart() {
    },
});

export = data;