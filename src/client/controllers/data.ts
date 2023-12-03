import { KnitClient as Knit } from "@rbxts/knit";
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