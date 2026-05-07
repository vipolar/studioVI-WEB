<script lang="ts">
    import { workspacesCookiesPath, tensordockCookiePrefix } from '$lib/cookies/constants';
    import type { TensordockDetails } from "$lib/types/workspaces/tensordock";
    import { enhance, applyAction } from "$app/forms";
    import type { PageProps } from "./$types";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import ServerFeaturesLoader from '$lib/components/ServerFeaturesLoader.svelte';

    let selected: TensordockDetails | null | undefined = $state();
    let servers: TensordockDetails[] = $state([]);
    let { data, form }: PageProps = $props();

    let noRunningCheck = true;
    function preventDefault(fn: any) {
        return function (event: any) {
            event.preventDefault();
        };
    }

    $effect(() => {
        const selectedServer = $state.snapshot(selected);
        console.log("Selected server:", selectedServer);
	});

    onMount(() => {
        const savedServers = localStorage.getItem(`${tensordockCookiePrefix}servers`);
        if (savedServers) {
            servers = JSON.parse(savedServers) as TensordockDetails[];

            servers.forEach(server => {
                server.status = 'pending';
            });

            if (servers.length > 0) {
                selected = servers[0];
            }
        }
	});
</script>

<div class="tensordock">
    {#if selected && selected.type === "virtualmachine"}
    <div class="workspace">
        <header>
            <div>{selected.name}</div>
            <div>{selected.id}</div>
        </header>
        <div class="details">
            <!--aside>

                MAYBE MAKE IT LESS RESOURCE HEAVY?!

                <p>vCPUs: {selected.virtualmachines.specs.vcpus}</p>
                <p>Memory: {selected.virtualmachines.specs.ram}GB</p>
                <p>Storage: {selected.virtualmachines.specs.storage}GB</p>
                <p>GPU{selected.virtualmachines.specs.gpu.amount > 1 ? "s" : ""}: {selected.virtualmachines.specs.gpu.amount > 1 ? `${selected.virtualmachines.specs.gpu.amount} x` : ""} {selected.virtualmachines.specs.gpu.type}</p>
            </aside-->
            <ServerFeaturesLoader featureType="models" server={selected} />
            <ServerFeaturesLoader featureType="services" server={selected} />
            <ServerFeaturesLoader featureType="utilities" server={selected} />
            <!--sup>
                <table border="1" style="border-collapse: collapse; margin-left: auto;">
                    <thead>
                        <tr>
                            <th>Storage</th>
                            <th>Compute</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{selected.virtualmachines.storage_price}</td>
                            <td>{selected.virtualmachines.compute_price}</td>
                            <td>{selected.virtualmachines.total_price}</td>
                        </tr>
                    </tbody>
                </table>
                <p style="margin: 2px;">*Prices are in $/hr</p>
            </sup-->

            {#if selected.status !== "running"}
                <button type="button">Start</button>
                <button type="button">Remove</button>
            {:else}
                <button type="button">Connect</button>
                <button type="button">Stop</button>
            {/if}
            <pre>{JSON.stringify(selected, null, 2)}</pre>
        </div>
    </div>
    {/if}
    <div class="servers" style="{!selected ? "max-width: unset" : ""}">
        <ul>
            {#each servers.toReversed() as server}
            {#if server.id}
            <li>
                <label class={{'selected': selected?.id === server.id}}>
                    <input type="radio" name="server" value={server} style="display: none;" bind:group={selected}>
                    <div class="server">
                        <header>
                            <div>
                                <p>{server.name}</p>
                                <p>{server.id}</p>
                            </div>
                            <div class={['status', `${server.status.toLowerCase()}`]}>•</div>
                        </header>
                        <!--p>OS: {server.virtualmachines.operating_system}</p-->
                        <p>ID: {server.id}</p>
                        <p>Type: {server.type.charAt(0).toUpperCase() + server.type.slice(1)}</p>
                        <p>IP: {server.ipAddress}</p>
                        <!--p>Location: {server.virtualmachines.city} / {server.virtualmachines.state} / {server.virtualmachines.country}</p-->
                    </div>
                </label>
            </li>
            {/if}
            {/each}

            <li>
                <label class={['form', {'selected': !selected}]}>
                    <input type="radio" name="server" value={null} bind:group={selected} style="display: none;" disabled={servers.length > 0}>
                    <form method="POST" class="server" action="?/connect" onsubmit={preventDefault}
                        use:enhance={({ formData, formElement, action, cancel }) => {
                            return async ({ result, update }) => {
                                if (result.type === 'success') {
                                    const resultData = result.data as unknown;
                                    if (resultData !== null && typeof resultData === "object" && "id" in resultData && resultData.id === formData.get("server")) {
                                        const server = resultData as TensordockDetails;

                                        servers.push(server);
                                        selected = servers[servers.length - 1];
                                        localStorage.setItem(`${tensordockCookiePrefix}servers`, JSON.stringify(servers));
                                    }
                                } else if (result.type === 'redirect') {
                                    goto(result.location, { invalidateAll: true });
                                }

                                await update({invalidateAll: false, reset: false});
                                await applyAction(result);
                            }
                        }}
                    >
                        <header>
                            <div>Add server:</div>
                            <div class="status"><strong>•</strong></div>
                        </header>
                        <input name="token" placeholder="Authorization token" autocomplete="off" required />
                        <input name="server" placeholder="Virtual Machine UUID" autocomplete="off" required />
                        <button type="submit">Connect</button>
                    </form>
                </label>
            </li>
        </ul>
    </div>
</div>

<style>
    @import '$lib/styles/animations/flicker.css';
    @import '$lib/styles/animations/waves.css';
    @import '$lib/styles/animations/glow.css';

    .tensordock {
        font-family: "Asap", sans-serif;
        justify-content: space-between;
        align-items: stretch;
        flex-direction: row;
        position: relative;
        flex-wrap: nowrap;
        display: flex;
        row-gap: 8px;
        padding: 0;
        margin: 0;
    }

    .workspace {
        box-shadow: 5px 10px 10px var(--theme-box-shadow);
        background-color: var(--theme-bg-nav-default);
        padding: 20px 30px 30px 30px;
        box-sizing: border-box;
        border-radius: 10px;
        margin-right: 10px;
        position: relative;
        text-align: right;
        overflow: hidden;
        flex-grow: 1;
    }

    .workspace > .details {
        justify-content: space-between;
        flex-direction: column;
        display: flex;
    }

    .workspace > .details > article {
        text-align: left;
    }

    .servers {
        min-width: 400px;
        max-width: 450px;
        flex-grow: 1;
    }

    .servers > ul,
    .details > article > ul {
        position: relative;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .servers > ul > li {
        padding: 0px 0px 10px 0px;
        position: relative;
        margin: 0;
    }

    .server {
        box-shadow: 5px 10px 10px var(--theme-box-shadow);
        background-color: var(--theme-bg-nav-default);
        padding: 20px 30px 30px 30px;
        box-sizing: border-box;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
        width: 100%;
        z-index: 0;
        left: 0%;
        top: 0%;
        -webkit-transition:
            -webkit-transform 300ms,
            box-shadow 300ms;
        -moz-transition:
            -moz-transform 300ms,
            box-shadow 300ms;
        transition:
            transform 300ms,
            box-shadow 300ms;
    }

    label:hover > .server {
        transform: scale(1.02);
    }

    .server::before,
    .server::after {
        border-bottom-right-radius: 40%;
        border-bottom-left-radius: 35%;
        border-top-right-radius: 45%;
        border-top-left-radius: 40%;
        position: absolute;
        height: 900px;
        width: 900px;
        content: "";
        z-index: -1;
        left: 0%;
        top: 0%;
    }

    .server::before {
        background-color: rgba(69, 105, 144, 0.15);
        bottom: -130%;
        left: 40%;
    }

    label:hover > .server::before,
    label.selected > .server::before {
        -webkit-animation: wawes 6s infinite linear;
        -moz-animation: wawes 6s infinite linear;
        animation: wawes 6s infinite linear;
    }

    .server::after {
        background-color: rgba(2, 128, 144, 0.2);
        bottom: -125%;
        left: 35%;
    }

    label:hover > .server::after,
    label.selected > .server::after {
        -webkit-animation: wawes 7s infinite;
        -moz-animation: wawes 7s infinite;
        animation: wawes 7s infinite;
    }

    .server > header,
    .workspace > header {
        justify-content: space-between;
        align-items: stretch;
        flex-direction: row;
        position: relative;
        flex-wrap: nowrap;
        padding: 20px 0;
        display: flex;
        row-gap: 8px;
        margin: 0;
    }

    .server > header > .status {
        color: transparent;
        font-size: 20px;
    }

    .server > header > .status.pending {
        -webkit-animation: flicker 2s linear 0s infinite;
        -moz-animation: flicker 2s linear 0s infinite;
        animation: flicker 2s linear 0s infinite;
        color: var(--theme-fg-pending);
    }

    .server > header > .status.running {
        -webkit-animation: glow-success 2s linear 0s infinite;
        -moz-animation: glow-success 2s linear 0s infinite;
        animation: glow-success 2s linear 0s infinite;
        color: var(--theme-fg-success);
    }

    .server > header > .status.stopped {
        text-shadow: 0px 0px 8px var(--theme-fg-warning);
        color: var(--theme-fg-warning);
    }

    .server > header > .status.stoppeddisassociated {
        text-shadow: 0px 0px 8px var(--theme-fg-error);
        color: var(--theme-fg-error);
    }

    /*
    .server > button.services {
        position: absolute;
        height: 100%;
        width: 100%;
        opacity: 0;
        margin: 0;
        left: 0;
        top: 0;
    } */
</style>
