import {
	ArrayPath,
	OmitFirstParam,
	Path,
	PathValue,
	PathValues,
	ReplicationTypes,
	StringPath,
	StringPathValue,
	Task,
} from "./util";

import { ReplicaService } from "./server/ReplicaService";
import { ReplicaController } from "./shared/ReplicaController";

export type Replica<C extends keyof Replicas = keyof Replicas> = ReplicaInstance<
	Replicas[C]["Data"],
	Replicas[C]["Tags"],
	Replicas[C]["WriteLib"]
>;

export interface ReplicaInstance<
	D extends Record<string, unknown> = {},
	T extends Record<string, unknown> = {},
	WL extends Record<string, unknown> = {},
> {
	/**
	 * Table representing the state wrapped by the `Replica`. Note that after wrapping a table with a `Replica` you may no longer write directly to that table (doing so would potentially desynchronize state among clients and in some cases even break code) \- all changes must be applied through [mutators](https://madstudioroblox.github.io/ReplicaService/api/#built-in-mutators).
	 * ```ts
	 * const PlayerData = {
	 *   Coins: 100
	 * }
	 * const PlayerStatsReplica = ReplicaService.NewReplica({
	 *   ClassToken: ReplicaService.NewClassToken("PlayerStats"),
	 *   Data: PlayerData, // Replica does not create a deep copy!
	 *   Tags: {
	 *     Player: Player
	 *   },
	 *   Replication: "All"
	 * });
	 *
	 * print(PlayerStatsReplica.Data === PlayerData); // true
	 * print(PlayerStatsReplica.Data.Coins); // 100
	 * PlayerStatsReplica.SetValue(["Coins"], 420);
	 * print(PlayerData.Coins, PlayerStatsReplica.Data.Coins); // 420 420
	 * ```
	 */
	readonly Data: D;
	/**
	 * An identifier that is unique for every `Replica` within a Roblox game session.
	 */
	readonly Id: number;
	/**
	 * The `className` parameter that has been used for the [ReplicaClassToken](https://madstudioroblox.github.io/ReplicaService/api/#replicaservicenewclasstoken) used to create this `Replica`.
	 */
	readonly Class: keyof Replicas;
	/**
	 * A custom static `Replica` identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the `Replica`'s lifespan.
	 * ```ts
	 * const CharacterReplica = ReplicaService.NewReplica({
	 *   ClassToken: ReplicaService.NewClassToken("Character"),
	 *   Tags: {
	 *     Player: Player,
	 *     Character: Character,
	 *     Appearance: "Ninja"
	 *   },
	 *   Replication: "All"
	 * });
	 * ```
	 */
	readonly Tags: T;
	/**
	 * Reference to the parent `Replica`. All **nested replicas** *will* have a parent. All **top level replicas** will have their `Parent` property set to `nil`. **Nested replicas** will never become **top level replicas** and vice versa.
	 */
	readonly Parent: Replica | undefined;
	/**
	 * An array of replicas parented to this `Replica`.
	 */
	readonly Children: Replica[];
	/**
	 * Returns `false` if the `Replica` was destroyed.
	 */
	IsActive(): boolean;
	/**
	 * Creates a brief string description of a `Replica`, excluding `Replica.Data` contents. Used for debug purposes.
	 * ```ts
	 * print(Replica.Identify()) // "[Id:7;Class:Flower;Tags:{Model=FlowerModel}]"
	 * ```
	 */
	Identify(): string;
	/**
	 * Signs up a task, object, instance or function to be ran or destroyed when the `Replica` is destroyed. The cleanup task is performed instantly if the `Replica` is already destroyed.
	 * ```ts
	 * const FlowerReplica = ReplicaService.NewReplica({
	 *   ClassToken: ReplicaService.NewClassToken("Flower"),
	 *   Data: {
	 *     HasBees: false,
	 *     HoneyScore: 10
	 *   },
	 *   Tags: {
	 *     Model: FlowerModel
	 *   },
	 *   Replication: "All"
	 * });
	 * FlowerReplica.AddCleanupTask(FlowerModel);
	 * FlowerReplica.Destroy(); // Destroys the replica for all subscribed clients first, then runs all the cleanup tasks including destroying the FlowerModel.
	 * ```
	 */
	AddCleanupTask(task: Task): void;
	/**
	 * Removes the cleanup task from the cleanup list.
	 */
	RemoveCleanupTask(task: Task): void;

	/**
	 * Sets any individual `value` within `Replica.Data` to `value`. Parameter `value` can be `nil` and will set the value located in `path` to `nil`.
	 */
	SetValue<P extends Path<D, "Main">>(path: P, value: PathValue<D, P>): void;
	/**
	 * Sets multiple keys located in `path` to specified `values`.
	 * ```ts
	 * Replica.SetValues(["Fruit"], {
	 *   Apples: 5,
	 *   Oranges: 2,
	 *   // WARNING: undefined (which it's nil) values will not work with replica:SetValues()
	 *   Bananas: undefined, // THIS IS INVALID, USE
	 *   // Replica.SetValue(["Fruit", "Bananas"], undefined)
	 * });
	 * print(Replica.Data.Fruit.Oranges); // 2
	 * ```
	 */
	SetValues<P extends Path<D, "Objects">>(path: P, values: PathValues<D, P>): void;
	/**
	 * Performs `table.insert(t, value)` where `t` is a numeric sequential array `table` located in `path`.
	 */
	ArrayInsert<P extends Path<D, "Arrays">>(
		path: P,
		value: PathValue<D, P> extends Array<infer T> ? T : never,
	): number;
	/**
	 * Performs `t[index] = value` where `t` is a numeric sequential array `table` located in `path`.
	 */
	ArraySet<P extends Path<D, "Arrays">>(
		path: P,
		index: number,
		value: PathValue<D, P> extends Array<infer T> ? T : never,
	): void;
	/**
	 * Performs `table.remove(t, index)` where `t` is a numeric sequential array `table` located in `path`.
	 */
	ArrayRemove<P extends Path<D, "Arrays">>(
		path: P,
		index: number,
	): PathValue<D, P> extends Array<infer T> ? T : never;

	/**
	 * Calls a function within a [WriteLib](https://madstudioroblox.github.io/ReplicaService/api/#writelib) that has been assigned to this `Replica` for both the server and all clients that have this `Replica` replicated to them.
	 */
	Write<P extends StringPath<WL, "Callbacks">>(
		functionName: P,
		...params: Parameters<OmitFirstParam<StringPathValue<WL, P>>>
	): ReturnType<StringPathValue<WL, P>>;
	/**
	 * Changes the `Parent` of the `Replica`.
	 *
	 * **Only nested replicas can have their parents changed (nested replicas are replicas that were initially created with a parent).**
	 *
	 * If a `Replica`, from a single player's perspective, is moved from a non-replicated parent to a replicated parent, the replica will be created for the player as expected. Likewise, parenting a replica to a non\-replicated replica will destroy it for that player. This feature is useful for controlling visible game chunks with entities that can move between those chunks.
	 */
	SetParent(replica: Replica): void;
	/**
	 * Changes replication settings (subscription settings) for select players.
	 *
	 * **Only top level replicas can have their replication settings changed (top level replicas are replicas that were initially created without a parent).**
	 */
	ReplicateFor(type: ReplicationTypes): void;
	/**
	 * Changes replication settings (subscription settings) for select players.
	 *
	 * **Only top level replicas can have their replication settings changed (top level replicas are replicas that were initially created without a parent).**
	 *
	 * ⚠️ **Warning:** Selectively destroying `Replica:DestroyFor(player)` for clients when the replica is replicated to `"All"` will throw an error \- Call `Replica:DestroyFor("All")` first.
	 */
	DestroyFor(type: ReplicationTypes): void;
	/**
	 * Simulates the behaviour of [RemoteEvent.OnServerEvent](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#OnServerEvent).
	 */
	ConnectOnServerEvent(listener: (player: Player, ...params: unknown[]) => void): RBXScriptConnection;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireClient()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireClient).
	 */
	FireClient(player: Player, ...params: unknown[]): void;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireAllClients()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireAllClients).
	 */
	FireAllClients(...params: unknown[]): void;
	/**
	 * Destroys replica and all of its descendants (Depth\-first). `Replica` destruction signal is sent to the client first, while cleanup tasks assigned with `Replica:AddCleanupTask()` will be performed after.
	 */
	Destroy(): void;

	/**
	 * Listens to WriteLib mutator functions being triggered. See [WriteLib](https://madstudioroblox.github.io/ReplicaService/api/#writelib) section for examples.
	 */
	ListenToWrite<P extends StringPath<WL, "Callbacks">>(
		functionName: P,
		listener: (...params: Parameters<OmitFirstParam<StringPathValue<WL, P>>>) => void,
	): RBXScriptConnection;
	/**
	 * Creates a listener which gets triggered by `Replica:SetValue()` calls.
	 */
	ListenToChange<P extends Path<D, "Main">>(
		path: P,
		listener: (newValue: PathValue<D, P>, oldValue: PathValue<D, P>) => void,
	): RBXScriptConnection;
	/**
	 * Creates a listener which gets triggered by `Replica:SetValue()` calls when a new key is created inside `path` (value previously equal to `nil`). Note that this listener can't reference the key itself inside `path`.
	 */
	ListenToNewKey<P extends Path<D, "Main">>(
		path: P,
		listener: (newValue: PathValue<D, P>, newKey: string) => void,
	): RBXScriptConnection;
	/**
	 * Creates a listener which gets triggered by `Replica:ArrayInsert()` calls.
	 */
	ListenToArrayInsert<P extends Path<D, "Arrays">>(
		path: P,
		listener: (newIndex: number, newValue: PathValue<D, P> extends Array<infer T> ? T : never) => void,
	): RBXScriptConnection;
	/**
	 * Creates a listener which gets triggered by `Replica:ArraySet()` calls.
	 */
	ListenToArraySet<P extends Path<D, "Arrays">>(
		path: P,
		listener: (index: number, newValue: PathValue<D, P> extends Array<infer T> ? T : never) => void,
	): RBXScriptConnection;
	/**
	 * Creates a listener which gets triggered by `Replica:ArrayRemove()` calls.
	 */
	ListenToArrayRemove<P extends Path<D, "Arrays">>(
		path: P,
		listener: (oldIndex: number, oldValue: PathValue<D, P> extends Array<infer T> ? T : never) => void,
	): RBXScriptConnection;
	/**
	 * Allows the developer to parse exact arguments that have been passed to any of the [built-in mutators](https://madstudioroblox.github.io/ReplicaService/api/#built-in-mutators).
	 *
	 * Possible parameter reference for `Replica:ListenToRaw()`:
	 * ```ts
	 * // ("SetValue", path, value)
	 * // ("SetValues", path, values)
	 * // ("ArrayInsert", path, value)
	 * // ("ArraySet", path, index, value)
	 * // ("ArrayRemove", path, index, oldValue)
	 *
	 * // path: Array<string>
	 * ```
	 */
	ListenToRaw<A extends "SetValue" | "SetValues" | "ArrayInsert" | "ArraySet" | "ArrayRemove">(
		listener: A extends "SetValue"
			? (action: "SetValue", path: ArrayPath<D, "Main">, value: PathValue<D, ArrayPath<D, "Main">>) => void
			: A extends "SetValues"
			? (
					action: "SetValues",
					path: ArrayPath<D, "Objects">,
					values: PathValues<D, ArrayPath<D, "Objects">>,
			  ) => void
			: A extends "ArrayInsert"
			? (
					action: "ArrayInsert",
					path: ArrayPath<D, "Arrays">,
					value: PathValue<D, ArrayPath<D, "Arrays">> extends Array<infer T> ? T : never,
			  ) => void
			: A extends "ArraySet"
			? (
					action: "ArraySet",
					path: ArrayPath<D, "Arrays">,
					index: number,
					value: PathValue<D, ArrayPath<D, "Arrays">> extends Array<infer T> ? T : never,
			  ) => void
			: A extends "ArrayRemove"
			? (
					action: "ArrayRemove",
					path: ArrayPath<D, "Arrays">,
					index: number,
					oldValue: PathValue<D, ArrayPath<D, "Arrays">> extends Array<infer T> ? T : never,
			  ) => void
			: never,
	): RBXScriptConnection;
	/**
	 * Creates a listener which gets triggered when a new child `Replica` is created.
	 */
	ListenToChildAdded(listener: (replica: Replica) => void): RBXScriptConnection;
	/**
	 * Returns a first child `Replica` of specified class if one exists.
	 */
	FindFirstChildOfClass<C extends keyof Replicas>(replicaClass: C): Replica<C> | undefined;
	/**
	 * Simulates the behaviour of [RemoteEvent.OnClientEvent](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#OnClientEvent).
	 */
	ConnectOnClientEvent(listener: (...params: unknown[]) => void): RBXScriptConnection;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireServer()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireServer).
	 */
	FireServer(...params: unknown[]): void;
}

export declare const ReplicaService: ReplicaService;
export declare const ReplicaController: ReplicaController;
