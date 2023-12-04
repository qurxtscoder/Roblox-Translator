import Abbreviator from "@rbxts/abbreviate";
import { KnitServer as Knit } from "@rbxts/knit";
import { Players, RunService } from "@rbxts/services";

const abbreviator = new Abbreviator();
abbreviator.setSetting("suffixTable", [
    "k",
    "m",
    "b",
    "t",
    "qa",
    "qi",
    "sx",
    "sp",
    "oc",
    "no",
    "dd",
    "ud",
    "dd",
    "td",
    "qad",
    "qid",
    "sxd",
    "spd",
    "ocd",
    "nod",
    "vg",
    "uvg",
    "dvg",
    "tvg",
    "qavg",
    "qivg",
    "sxvg",
    "spvg",
    "ocvg",
]);
abbreviator.setSetting("decimalPlaces", 2);

declare global {
    interface KnitServices {
        leaderstats: typeof leaderstats;
    }
}

const leaderstats = Knit.CreateService({
    Name: "leaderstats",

    emojis: {
        Money: "💰",
        Gems: "💎",
    },
    stats: ["Money", "Gems"],

    updateLeaderstatsForPlayer(player: Player) {
        const data = Knit.GetService("data");
        const replica = data.getReplicaFromPlayer(player);
        if (replica === undefined) return;
        const leaderstats = player.FindFirstChild("leaderstats");
        if (leaderstats === undefined) return;
        for (const [key, value] of pairs(replica.Data)) {
            const emoji = this.emojis[key];
            const stat = leaderstats.FindFirstChild(`${(emoji && emoji + " ") || ""}${key}`) as StringValue;
            if (stat === undefined) continue;
            stat.Value = abbreviator.numberToString(value);
        }
    },

    KnitInit() {
        const data = Knit.GetService("data");

        const playerAdded = (player: Player) => {
            let replica = data.getReplicaFromPlayer(player);
            while (replica === undefined) {
                RunService.Heartbeat.Wait();
                replica = data.getReplicaFromPlayer(player);
            }
            const leaderstats = new Instance("Folder");
            leaderstats.Name = "leaderstats";
            leaderstats.Parent = player;

            for (const [key, value] of pairs(replica.Data)) {
                if (!this.stats.includes(key)) continue;
                const stat = new Instance("StringValue");
                const emoji = this.emojis[key];
                stat.Name = `${(emoji && emoji + " ") || ""}${key}`;
                stat.Value = abbreviator.numberToString(value);
                stat.Parent = leaderstats;
            }
        };

        Players.PlayerAdded.Connect(playerAdded);

        for (const player of Players.GetPlayers()) {
            playerAdded(player);
        }
    },

    KnitStart() {
        task.spawn(() => {
            while (true) {
                for (const player of Players.GetPlayers()) {
                    this.updateLeaderstatsForPlayer(player);
                }
                task.wait(0.1);
            }
        });
    },
});

export = leaderstats;
