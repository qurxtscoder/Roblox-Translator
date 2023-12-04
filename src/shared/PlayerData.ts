import { PlayerDataReplica } from "./data/Replicas";

export = {
    ChangeMoney: (
        replica: PlayerDataReplica,
        method: "Add" | "Sub",
        value: number
    ) => {

        const FinalValue =
            method === "Add"
                ? replica.Data.Money + value
                : replica.Data.Money - value;

        if (FinalValue < 0) return replica.SetValue(["Money"], 0);

        replica.SetValue(["Money"], FinalValue);
    },
};