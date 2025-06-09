<script lang="ts">
    import { writable, type Unsubscriber } from 'svelte/store';	
    import { source, type Source } from 'sveltekit-sse';
    import { ServiceError } from '$lib/types/errors';
    import { onDestroy, onMount } from "svelte";
    import { page } from '$app/state';

    let { data } = $props();
    let remoteConsole = $state();
    let remoteConsoleSource: Source | null;
    const remoteConsoleStore = writable<string[]>([]);
    let remoteConsoleLogUnsubscribe: Unsubscriber | null;
    let remoteConsoleErrorUnsubscribe: Unsubscriber | null;
    let remoteConsoleMessageUnsubscribe: Unsubscriber | null;

    function beforeOnDestroy(event: any) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave?";
    }

    function terminateServiceInstance() {
        fetch(`./${page.params.instance}/sse?terminate=${true}`, {
            method: 'DELETE'
        });
    }

    function stopServiceInstance() {
        fetch(`./${page.params.instance}/sse?terminate=${false}`, {
            method: 'DELETE'
        });
    }

    onMount(async () => {
        remoteConsoleSource = source(`./${page.params.instance}/sse`, {
            open({ }) {
                console.log(`Establishing ${data.service} connection...`);
            },
            close({ }) {
                console.log(`Severing ${data.service} SSE connection...`);
                fetch(`./${page.params.instance}/sse`, {
                    method: 'DELETE'
                });
                /* TODO: validate? */
            },
            error({ }) {
                console.log(`Error in ${data.service} SSE connection...`);
            }
        });


        remoteConsoleSource.select('start').subscribe((message: string) => {
            if (message && message.length > 0) {
                remoteConsoleStore.update(arr => arr.concat(message));
                console.log(message);
    
            }
        });

        if (remoteConsoleLogUnsubscribe == null) {
            remoteConsoleLogUnsubscribe = remoteConsoleSource.select('log').subscribe((message: string) => {
                if (message && message.length > 0) {
                    remoteConsoleStore.update(arr => arr.concat(message));
                    console.log(message);
                }
            });
        }

        if (remoteConsoleErrorUnsubscribe == null) {
            remoteConsoleErrorUnsubscribe = remoteConsoleSource.select('error').subscribe((message: string) => {
                try {
                    if (message && message.length > 0) {
                        const error: ServiceError = JSON.parse(message);
                        remoteConsoleStore.update(arr => arr.concat(error.message));
                        console.error(error);
                    }
                } catch (error) {
                    console.log("Error", error);
                }
            });
        }

        if (remoteConsoleMessageUnsubscribe == null) {
            remoteConsoleMessageUnsubscribe = remoteConsoleSource.select('message').subscribe((message: string) => {
                if (message && message.length > 0) {
                    remoteConsoleStore.update(arr => arr.concat(message));
                }
            });
        }
	});

    onDestroy(() => {
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
    });
</script>

<svelte:window on:beforeunload={beforeOnDestroy}/>

<button onclick={stopServiceInstance}>Stop</button>
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
