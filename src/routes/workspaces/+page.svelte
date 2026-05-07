<script lang="ts">

</script>

<div class="poster-container">
    <div class="poster">
        <a href="/workspaces/tensordock">Go to TensorDock Workspaces →</a>
    </div>
    <div class="poster">
        <a href="/workspaces/massedcompute">Go to MassedCompute Workspaces →</a>
    </div>
    <div class="poster">
        <a href="/workspaces/runpod">Go to RunPod Workspaces →</a>
    </div>
</div>

<style>
    .poster-container {
        box-sizing: border-box;
        display: flex;
        width: 1024px;
        padding: 16px;
        gap: 16px;
    }

    .poster {
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: transform 0.2s ease;
        background-color: #eeeeee;
        border: 2px solid #cccccc;
        aspect-ratio: 2 / 3;
        font-size: 1.5rem;
        font-weight: bold;
        color: #222222;
        
        
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .poster:hover {
        transform: scale(1.02);
    }

    .poster::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom right,
            var(--theme-color) 0%,
            var(--auxilary-color) 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none; /* allows clicks to pass through */
    }

    .poster:hover::after {
        opacity: 1;
    }
</style>