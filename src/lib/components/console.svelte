<script lang="ts">
	import { writable, type Unsubscriber } from 'svelte/store';	
    import { source, type Source } from 'sveltekit-sse';
    import { ServiceError } from '$lib/types/errors';
    import { onDestroy, onMount } from "svelte";

    interface Props {
		service: string;
        instance?: string;
	}

    let selected = $state();
    let remoteConsole = $state();
    let remoteConsoleSource: Source | null;
    let activeProcesses: string[] = $state([]);
    let { service, instance }: Props = $props();
    const remoteConsoleStore = writable<string[]>([]);
    let remoteConsoleLogUnsubscribe: Unsubscriber | null;
    let remoteConsoleErrorUnsubscribe: Unsubscriber | null;
    let remoteConsoleMessageUnsubscribe: Unsubscriber | null;

/*    let remoteConsoleHTMLDivElement: HTMLDivElement | null = null;

    $: if (remoteConsoleHTMLDivElement) {
        conremoteConsoleHTMLDivElementsoleBox.scrollTop = remoteConsoleHTMLDivElement.scrollHeight;
    }
*/
    function subscribeToService() {
        if (remoteConsoleSource != null) {
            return;
        }

        remoteConsoleSource = source(`/api/services/instances?service=${service}&instance=${instance}`, {
            open({ }) {
                console.log(`Establishing ${service} connection...`); /* DEBUG */
            },
            close({ }) {
                console.log(`Severing ${service} SSE connection...`); /* DEBUG */
                fetch(`/api/services/instances?service=${service}&instance=${instance}&terminate=${false}`, {
                    method: 'DELETE'
                }).then(response => {
                    if (response.status === 204) {
                        unsubscribeFromService();
                    } else {
                        throw new Error(`Failed to delete cookie. Server responded with ${response.status}`);
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
            },
            error({ }) {
                console.log(`Error in ${service} SSE connection...`); /* DEBUG */
                unsubscribeFromService();
            }
        });

        if (remoteConsoleLogUnsubscribe == null) {
            remoteConsoleLogUnsubscribe = remoteConsoleSource.select('log').subscribe((message: any) => {
                remoteConsoleStore.update(arr => arr.concat(message));
                console.log(message);
            });
        }

        if (remoteConsoleErrorUnsubscribe == null) {
            remoteConsoleErrorUnsubscribe = remoteConsoleSource.select('error').subscribe((message: any) => {
                remoteConsoleStore.update(arr => arr.concat(message));
                console.error(message);
            });
        }

        if (remoteConsoleMessageUnsubscribe == null) {
            remoteConsoleMessageUnsubscribe = remoteConsoleSource.select('message').subscribe((message: any) => {
                remoteConsoleStore.update(arr => arr.concat(message));
            });
        }
    }

    function unsubscribeFromService() {
        if (remoteConsoleSource != null) {
            remoteConsoleSource.close();
            remoteConsoleSource = null;
        }

        if (remoteConsoleLogUnsubscribe != null) {
            remoteConsoleLogUnsubscribe();
            remoteConsoleLogUnsubscribe = null;
        }

        if (remoteConsoleErrorUnsubscribe != null) {
            remoteConsoleErrorUnsubscribe();
            remoteConsoleErrorUnsubscribe = null;
        }

        if (remoteConsoleMessageUnsubscribe != null) {
            remoteConsoleMessageUnsubscribe();
            remoteConsoleMessageUnsubscribe = null;
        }
    }

    onDestroy(() => {
        unsubscribeFromService();
    });

    onMount(async () => {
        if (!service) {
            console.error('Service is not defined!');
            return;
        }

        const response = await fetch(`/api/services/instances?service=${service}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch UUIDs: ${response.status}`);
        }

        activeProcesses = await response.json();
        console.log($state.snapshot(activeProcesses));
	});
</script>

<select bind:value={selected} onchange={() => (console.log('change'))}>
    {#each activeProcesses as process}
        <option value={process}>
            {process}
        </option>
    {/each}
    <option value={null}>{`<Create new ${service} instance>`}</option>
</select>

<button onclick={subscribeToService}>Launch {service}</button>
<button onclick={unsubscribeFromService}>Stop {service}</button>
<div class="console" bind:this={remoteConsole}>
    {#each $remoteConsoleStore as line}
        <div class="console-line">{line}</div>
    {/each}
</div>

<style>
    .console {
        width: 100%;
        height: 300px;
        padding: 10px;
        overflow-y: auto;
        border-radius: 5px;
        font-family: monospace;
        color: rgb(0, 255, 0);
        border: 1px solid #444444;
        background: rgba(0, 0, 0, 0.856);
    }

    .console-line {
        white-space: pre-wrap;
    }
</style>
