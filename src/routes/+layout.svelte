<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<header>
    <nav class="navbar">
        <banner class="navbarlogo">
            <a href="/">
                <img src="https://www.myvi.in/content/dam/vodafoneideadigital/homespyder/Vi-logo.svg" alt="StudioVI Logo">
            </a>
            <svg>
                <line x1="0" y1="0" x2="0" y2="44" stroke="black" stroke-opacity="0.5"></line>
            </svg>
            <a href="/workspaces/tensordock">
                <img src="https://tensordock.com/assets/img/brand.svg" alt="TensorDock Logo">
            </a>
        </banner>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/workspaces">Workspaces</a></li>
            <li><a href="/">Pricing</a></li>
            <li><a href="/">Contact</a></li>
        </ul>
    </nav>
</header>
<aside>
    <nav>
        <a href="https://tensordock.com/">Go to Tensordock homepage →</a>
    </nav>
</aside>

<main>
    {@render children()}
</main>

<footer>
    <div>© {new Date().getFullYear()} StudioVI. All rights reserved.</div>
</footer>

<style>
/*    :global(body) {
        background: rgb(47, 168, 88);
        background-color: rgb(47, 168, 88);
        background: linear-gradient(180deg, rgba(51,153,102,1) 0%, rgba(47,168,88,1) 100%);
        background: -moz-linear-gradient(180deg, rgba(51,153,102,1) 0%, rgba(47,168,88,1) 100%);
        background: -webkit-linear-gradient(180deg, rgba(51,153,102,1) 0%, rgba(47,168,88,1) 100%);
    } */

    :global(body) {
        background: rgb(34,193,195);
        background-color: rgb(34,193,195);
        background: linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
        background: -moz-linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
        background: -webkit-linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
        font-family: "Asap", sans-serif;
        padding: 0;
        margin: 0;
    }

    :root {
        --app-width: 1024px;
    }

    header {
        border-bottom: 1px solid #d9e2ef;
        background-color: #ffffff;
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
        width: 1px;
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

    header > nav > ul > li > a {
        text-decoration: none;
        position: relative;
        color: #384c74;
        font-size: 18px;
    }

    header > nav > ul > li > a:visited {
        color: #384c74;
    }

    header > nav > ul > li > a:hover {
        color: #339966;
    }

    aside {
        border-bottom: 1px solid #d9e2ef;
        background-color: #ffffff;
        padding: .25rem 0;
    }

    aside > nav {
        justify-content: flex-end;
        width: var(--app-width);
        box-sizing: border-box;
        align-items: center;
        padding: 0 5px;
        display: flex;
        margin: auto;
    }

    aside > nav > a {
        text-decoration: none;
        position: relative;
        color: #384c74;
        font-size: 14px;
    }

    aside > nav > a:visited {
        color: #384c74;
    }

    aside > nav > a:hover {
        color: #339966;
    }

    main {
        width: var(--app-width);
        margin: 5px auto;
    }

    footer {
        box-shadow: 5px 10px 10px rgba(2, 128, 144, 0.2);
        background-color: #ffffff;
        border: 1px solid #d9e2ef;
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