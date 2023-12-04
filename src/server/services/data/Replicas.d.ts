import { Replica } from "@rbxts/replicaservice";
import PlayerDataReplicaWriteLib from "../../../shared/PlayerData";

declare global {
  interface Replicas {
    PlayerData: {
      Data: {
        Money: number;
        Gems: number;
      };
      Tags: {
        "Player": Player,
        "Time Joined": number
      };
      WriteLib: typeof PlayerDataReplicaWriteLib;
      Player: Player
    };
  }
}

export type PlayerDataReplica = Replica<"PlayerData">;