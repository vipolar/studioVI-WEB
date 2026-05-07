<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

    /**
     * --theme-btn-hover: #339966;
     * --theme-a-hover: #339966;
     */
</script>

<header>
    <nav>
        <a href="https://tensordock.com/">Go to Tensordock homepage →</a>
    </nav>
</header>

<main>
    {@render children()}
</main>

<style>


    header {
        background-color: var(--theme-bg-nav-default);
        border-bottom: 1px solid var(--theme-border);
        padding: .25rem 0;
    }

    header > nav {
        justify-content: flex-end;
        width: var(--app-width);
        box-sizing: border-box;
        align-items: center;
        padding: 0 5px;
        display: flex;
        margin: auto;
    }

    header > nav > a {
        color: var(--theme-a-default);
        text-decoration: none;
        position: relative;
        font-size: 14px;
    }

    header > nav > a:visited {
        color: var(--theme-a-visited);
    }

    header > nav > a:hover {
        color: var(--theme-a-hover);
    }

    main {
        width: var(--app-width);
        margin: 5px auto;
    }
</style>