<script lang="ts">
    import type { BackendResponse, ServiceExtensive } from '$lib/types/backend';
    import { enhance, applyAction } from "$app/forms";
    import type { PageProps } from "./$types";
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    let { data, form }: PageProps = $props();
    let selectedOption = $state();

    //Object.entries;
    let commands = $derived(Object.entries(data?.service?.commands!).map(([key, value]) => ({
        ...(value as unknown as ServiceExtensive[string]["commands"][string]),
        key: key
    })));

    console.log($state.snapshot(data?.service));

    function preventDefault(fn: any) {
        return function (event: any) {
            event.preventDefault();
        };
    }
</script>

<form method="POST" class="instance" action="?/start" onsubmit={preventDefault} use:enhance={({ formData, formElement, action, cancel }) => {
    return async ({ result, update }) => {
        if (result.type === 'success') {
            /*const resultData = result.data as unknown;
            if (typeof resultData === "object" && resultData !== null && "success" in resultData && typeof resultData.success === "boolean") {
                if (resultData.success === true && "virtualmachines" in resultData && typeof resultData.virtualmachines === "object") {
                    servers.push(resultData as TensordockDetails);
                    selected = servers[servers.length - 1];
                } else if (resultData.success === false && "error" in resultData) {
                    console.error("Error", resultData.error);
                }
            }*/
        } else if (result.type === 'redirect') {
            goto(result.location, { invalidateAll: true });
        }

        await update({invalidateAll: false, reset: false});
        //await applyAction(result);
    }
}}
>
    <!--header>
        <div>Add server:</div>
        <div class="status"><strong>•</strong></div>
    </header>
    <input name="authkey" placeholder="Authorization key" autocomplete="off" required />
    <input name="authtoken" placeholder="Authorization token" autocomplete="off" required />
    <input name="server" placeholder="Virtual Machine UUID" autocomplete="off" required /-->
    <pre>{JSON.stringify(data?.service!, null, 2)}</pre>
    <label for="command">Select an option:</label>
    <select id="command" name="command" bind:value={selectedOption}>
        {#each commands as command}
            <option value={command.key}>{command.key.charAt(0).toUpperCase() + command.key.slice(1)}: {command.description}</option>
        {/each}
    </select>
    <button type="submit">Connect</button>
</form>

<style>

</style>