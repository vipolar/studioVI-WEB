<script lang="ts">
    import type { ServiceExtensive } from '$lib/types/backend';
    import { enhance, applyAction } from "$app/forms";
    import type { PageProps } from "./$types";
    import { goto } from '$app/navigation';

    let { data, form }: PageProps = $props();

    let services = $derived(data?.services!.flatMap((service: {[s: string]: unknown;}) => Object.entries(service).map(([key, value]) => ({
        ...(value as ServiceExtensive),
        identifier: key
    }))));
</script>

{#each services as service}
    <details>
        <summary>{service.name}</summary>
        <p>{service.description}</p>
    </details>
{/each}

<div>
    <form method="POST" class="server" action="?/login" use:enhance={({ formData, formElement, action, cancel }) => {
                return async ({ result, update }) => {
                    if (result.type === 'success') {
                        const resultData = result.data as unknown;
                        if (resultData !== null) {
                            console.log(resultData);
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
            <div>Log in:</div>
            <div class="status"><strong>•</strong></div>
        </header>
        <input type="text" name="username" placeholder="Username" autocomplete="off" required />
        <input type="password" name="password" placeholder="Password" autocomplete="off" required />
        <button type="submit">Login</button>
    </form>
</div>


<style>
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