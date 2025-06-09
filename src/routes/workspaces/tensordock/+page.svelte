<script lang="ts">
    import type { TensordockDetails } from "$lib/types/workspaces/tensordock";
    import type { ServiceSimple } from '$lib/types/backend';
    import { enhance, applyAction } from "$app/forms";
    import type { PageProps } from "./$types";
    import { goto } from '$app/navigation';

    let selected: TensordockDetails | null | undefined = $state();
    let servers: TensordockDetails[] = $state([]);
    let { data, form }: PageProps = $props();

    let noRunningCheck = false;
    function preventDefault(fn: any) {
        return function (event: any) {
            event.preventDefault();
        };
    }

    async function onclick() {
		console.log($state.snapshot(servers));
        noRunningCheck = true;
	}

    $effect(() => {
        const selectedServer = selected;
		if (selectedServer && !selectedServer.services && (selectedServer.status === "running" || noRunningCheck)) {
            const httpPort = selectedServer?.portForwards.find(port => port.internal_port === 80)?.external_port;
            console.log("s");
            if (httpPort) {
                console.log(`Fetching services for server ${selectedServer.ipAddress}:${httpPort}`);
                fetch(`?/start?server=${encodeURIComponent(`${selectedServer.ipAddress}:${httpPort}`)}`)
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        return response.json();
                    })
                    .then(services => {
                        selectedServer.services = services as ServiceSimple[];
                    })
                    .catch(error => console.error("Error fetching services:", error));;
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
                <p>vCPUs: {selected.virtualmachines.specs.vcpus}</p>
                <p>Memory: {selected.virtualmachines.specs.ram}GB</p>
                <p>Storage: {selected.virtualmachines.specs.storage}GB</p>
                <p>GPU{selected.virtualmachines.specs.gpu.amount > 1 ? "s" : ""}: {selected.virtualmachines.specs.gpu.amount > 1 ? `${selected.virtualmachines.specs.gpu.amount} x` : ""} {selected.virtualmachines.specs.gpu.type}</p>
            </aside-->
            {#if selected.services}
            <article>
                <header>Available Services:</header>
                <ul>
                    {#each selected.services as service}
                    {@const identifier = Object.keys(service)[0]}
                    <li>
                        <details>
                            <summary>{service[identifier].name}</summary>
                            <p>{service[identifier].description}</p>
                            </details>
                    </li>
                    {/each}
                </ul>
            </article>
            {/if}
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
            {#each servers as server}
            {#if server.id}
            <li>
                <label>
                    <input type="radio" name="server" value={server} bind:group={selected} onclick={onclick} style="display: none;">
                    <form method="POST" class="server" id="{server.id}" action="?/services" onsubmit={preventDefault}
                        use:enhance={({ formData, formElement, action, cancel }) => {
                            return async ({ result, update }) => {
                                if (result.type === 'success') {
                                    const resultData = result.data as unknown;
                                    if (resultData !== null && typeof resultData === "object" && "services" in resultData) {
                                            server.services = resultData.services as ServiceSimple[];;
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
                            <div>
                                <p>{server.name}</p>
                                <p>{server.id}</p>
                            </div>
                            <input type="hidden" name="server" value={server.ipAddress} />
                            <input type="hidden" name="port" value={server?.portForwards.find(port => port.internal_port === 80)?.external_port} />
                            <div class={['status', {'running': server.status === "running"}, {'stopped': server.status === "stopped"}, {'severed': server.status === "stoppeddisassociated"}]}>•</div>
                        </header>
                        <!--p>OS: {server.virtualmachines.operating_system}</p-->
                        <p>ID: {server.id}</p>
                        <p>Type: {server.type.charAt(0).toUpperCase() + server.type.slice(1)}</p>
                        <p>IP: {server.ipAddress}</p>
                        <!--p>Location: {server.virtualmachines.city} / {server.virtualmachines.state} / {server.virtualmachines.country}</p-->
                        <button class="services" type="submit">Load services</button>
                    </form>
                </label>
            </li>
            {/if}
            {/each}

            <li>
                <label>
                    <input type="radio" name="server" value={null} bind:group={selected} style="display: none;" disabled={servers.length > 0}>
                    <form method="POST" class="server" action="?/connect" onsubmit={preventDefault}
                        use:enhance={({ formData, formElement, action, cancel }) => {
                            return async ({ result, update }) => {
                                if (result.type === 'success') {
                                    const resultData = result.data as unknown;
                                    if (resultData !== null && typeof resultData === "object" && "id" in resultData && resultData.id === formData.get("server")) {
                                            servers.push(resultData as TensordockDetails);
                                            selected = servers[servers.length - 1];
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
        box-shadow: 5px 10px 10px rgba(2, 128, 144, 0.2);
        padding: 20px 30px 30px 30px;
        background-color: white;
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
        box-shadow: 5px 10px 10px rgba(2, 128, 144, 0.2);
        padding: 20px 30px 30px 30px;
        background-color: white;
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
        -webkit-animation: wawes 6s infinite linear;
        -moz-animation: wawes 6s infinite linear;
        animation: wawes 6s infinite linear;
        bottom: -130%;
        left: 40%;
    }

    .server::after {
        background-color: rgba(2, 128, 144, 0.2);
        -webkit-animation: wawes 7s infinite;
        -moz-animation: wawes 7s infinite;
        animation: wawes 7s infinite;
        bottom: -125%;
        left: 35%;
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
        color: goldenrod;
    }

    .server > header > .status.running {
        -webkit-animation: published-flick 2s linear 0s infinite;
        -moz-animation: published-flick 2s linear 0s infinite;
        animation: published-flick 2s linear 0s infinite;
        text-shadow: 0px 0px 8px #88ff00;
        color: #88ff00;
    }

    .server > header > .status.stopped {
        color: #ffe600;
    }

    .server > header > .status.severed {
        color: #ff0000;
    }

    .server > input {
        background: white;
        padding: 10px 10px;
        margin: 15px -10px;
        border-radius: 5px;
        font-size: 16px;
        display: block;
        width: 100%;
        border: 0;
    }

    .server > button,
    .details > button {
        -webkit-transition: background-color 300ms;
        -moz-transition: background-color 300ms;
        transition: background-color 300ms;
        background-color: #2fa858;
        text-transform: uppercase;
        border-radius: 5px;
        padding: 10px 15px;
        margin-left: -5px;
        margin-top: 10px;
        color: #ffffff;
        cursor: pointer;
        font-size: 16px;
        border: 0;
    }

    .server > button.services {
        position: absolute;
        height: 100%;
        width: 100%;
        opacity: 0;
        margin: 0;
        left: 0;
        top: 0;
    }

    .server > button:hover,
    .details > button:hover {
        background-color: #339966;
    }

    @-webkit-keyframes wawes {
        from {
            -webkit-transform: rotate(0);
        }
        to {
            -webkit-transform: rotate(360deg);
        }
    }
    @-moz-keyframes wawes {
        from {
            -moz-transform: rotate(0);
        }
        to {
            -moz-transform: rotate(360deg);
        }
    }
    @keyframes wawes {
        from {
            -webkit-transform: rotate(0);
            -moz-transform: rotate(0);
            -ms-transform: rotate(0);
            -o-transform: rotate(0);
            transform: rotate(0);
        }
        to {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
</style>
