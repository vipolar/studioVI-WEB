<script lang="ts">
    import type { TensordockDetails } from '$lib/types/workspaces/tensordock';
    import type { ModelSimple, ServiceSimple, UtilitySimple } from '$lib/types/backend';
    import { enhance, applyAction } from "$app/forms";
    import { goto } from '$app/navigation';

    interface Props {
        server: TensordockDetails;
        featureType: 'models' | 'services' | 'utilities';
    }
    let { featureType, server }: Props = $props();

    function preventDefault(fn: any) {
        return function (event: any) {
            event.preventDefault();
        };
    }
</script>

<article>
    <header><button class="models" type="submit" form={`load${featureType}`}>Available {featureType}</button></header>
    {#if server[featureType] && server[featureType].length > 0}
        <ul>
            {#each server[featureType] as entry}
            {@const identifier = Object.keys(entry)[0]}
            <li>
                <details>
                    <summary>{entry[identifier].name}</summary>
                    <p>{entry[identifier].description}</p>
                    </details>
            </li>
            {/each}
        </ul>
    {/if}
</article>

<form method="POST" class="hiddenform" id={`load${featureType}`} action={`?/${featureType}`} onsubmit={preventDefault}
    use:enhance={({ formData, formElement, action, cancel }) => {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                const resultData = result.data as unknown;
                if (resultData !== null && typeof resultData === "object") {
                    if (featureType === 'models' && featureType in resultData) {
                        server.models = resultData.models as ModelSimple[];
                    } else if (featureType === 'services' && featureType in resultData) {
                        server.services = resultData.services as ServiceSimple[];
                    } else if (featureType === 'utilities' && featureType in resultData) {
                        server.utilities = resultData.utilities as UtilitySimple[];
                    }
                }
            } else if (result.type === 'redirect') {
                goto(result.location, { invalidateAll: true });
            }

            await update({invalidateAll: false, reset: false});
            await applyAction(result);
        }
    }}>
    <input type="hidden" name="id" value={server.id} />
    <input type="hidden" name="server" value={server.ipAddress} />
    <input type="hidden" name="port" value={server?.portForwards.find(port => port.internal_port === 80)?.external_port} />
</form>
