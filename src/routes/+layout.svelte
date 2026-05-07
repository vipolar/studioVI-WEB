<script lang="ts">
	import type { LayoutProps } from './$types';
    import { page } from '$app/state';
    import { onMount } from 'svelte';

	let { data, children }: LayoutProps = $props();

    let theme = $state<'light' | 'dark'>('light');

    $effect(() => {
        document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
    });
    
    onMount(() => {
		const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (saved) {
            theme = saved;
        }
	});
</script>

<header>
    <nav class="navbar">
        <banner class="navbarlogo">
            <a href="/">
                <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5cd1f6af-ed85-437b-ba2a-131693b7f3d8/dgj705j-d3f9ac19-283a-40b2-9364-ca6336901365.png/v1/fill/w_1063,h_752/gta_vi_logo_4k__no_background__by_giga_bitten_dgj705j-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTA1IiwicGF0aCI6IlwvZlwvNWNkMWY2YWYtZWQ4NS00MzdiLWJhMmEtMTMxNjkzYjdmM2Q4XC9kZ2o3MDVqLWQzZjlhYzE5LTI4M2EtNDBiMi05MzY0LWNhNjMzNjkwMTM2NS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.ypubH4VqNcA2SndhqgLFI71LvFmBBbEHF3m4NhMQpHw" alt="StudioVI Logo">
            </a>
            {#if page.url.pathname.startsWith("/workspaces") && !page.url.pathname.endsWith("/workspaces")}
                <svg>
                    <line x1="0" y1="0" x2="0" y2="44"></line>
                </svg>
                {#if page.url.pathname.startsWith("/workspaces/tensordock")}
                    <a href="/workspaces/tensordock">
                        <img src="https://tensordock.com/assets/img/brand.svg" alt="TensorDock Logo">
                    </a>
                {:else if page.url.pathname.startsWith("/workspaces/massedcompute")}
                    <a href="/workspaces/massedcompute">
                        <img src="https://massedcompute.com/wp-content/uploads/2023/08/logo-footer-1536x586.png" alt="MassedCompute Logo">
                    </a>
                {/if}
            {/if}
            <button class={['theme-toggle', `${page.url.pathname.replace(/\/+$/, "").split("/").pop()}`]} onclick={() => theme = theme == 'light' ? 'dark' : 'light'}>
                <b>{#if theme === 'light'}☀{:else}☼{/if}</b>
            </button>
        </banner>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/workspaces">Workspaces</a></li>
            <li><a href="/">Pricing</a></li>
            <li><a href="/">Contact</a></li>
        </ul>
        
    </nav>
</header>

<main>
    {@render children()}
</main>

<footer>
    <div>© {new Date().getFullYear()} StudioVI. All rights reserved.</div>
</footer>



<style>
    @import '$lib/styles/style.css';
    @import '$lib/styles/themes.css';

    header {
        background-color: var(--theme-bg-nav-default);
        border-bottom: 1px solid var(--theme-border);
        padding: 1.25rem 0;
    }

    header > nav {
        justify-content: space-between;
        width: var(--app-width);
        align-items: center;
        display: flex;
        margin: auto;
    }

    header > nav > banner {
        justify-content: flex-start;
        align-items: center;
        display: flex;
        height: 40px;
        gap: 10px;
    }

    header > nav > banner > svg {
        height: 100%;
        width: 2px;
    }

    header > nav > banner > svg > line {
        stroke: var(--theme-border);
        stroke-opacity: 0.505;
        stroke-width: 2;
    }

    :root[data-theme='dark'] header > nav > banner > svg > line {
        stroke-opacity: 1.0;
    }

    :root[data-theme='light'] header > nav > banner > svg > line {
        stroke-opacity: 0.5;
    }

    header > nav > banner > a {
        height: 100%;
    }

    header > nav > banner > a > img {
        height: 100%;
    }

    header > nav > ul {
        list-style: none;
        display: flex;
        padding: 0;
        margin: 0;
        gap: 20px;        
    }

    header > nav > ul > li {
        display: inline;
    }

    main {
 
    }

    button.theme-toggle {
        color: var(--theme-fg-default);
        background-color: transparent;
        border-radius: 999px;
        margin-left: -10px;
        margin-top: -35px;
        font-size: 12px;
        padding: 5px;
    }

    button.theme-toggle:hover {
        transform: scale(1.025);
    }

    :root[data-theme='dark'] button.theme-toggle:hover {
        background-color: #38444d;
    }

    :root[data-theme='light'] button.theme-toggle:hover {
        background-color: #f1f1f1;
    }

    button.theme-toggle.massedcompute {
        margin-top: -1px;
        font-size: 9px;
    }

    button.theme-toggle.tensordock {
        margin-top: -5px;
    }

    button.theme-toggle.runpod {
        margin-top: -5px;
    }

    footer {
        box-shadow: 5px 10px 10px var(--theme-box-shadow);
        background-color: var(--theme-bg-nav-default);
        border: 1px solid var(--theme-border);
        width: var(--app-width);
        border-radius: 5px;
        padding: .25rem 0;
        margin: 5px auto;
        bottom: 10px;
    }

    footer > div {
        width: fit-content;
        margin: auto;
    }
</style>