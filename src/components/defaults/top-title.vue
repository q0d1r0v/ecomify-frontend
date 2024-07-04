<template>
    <div class="bg-[#111CEF] text-white" id="scroll-container">
        <div id="scroll-text">
            <span class="font-semibold">{{ $t('bars.top_title') }}</span> +998 99 999 99 99
        </div>
    </div>
</template>

<style scoped lang="scss">
#scroll-container {
    overflow: hidden;
}

#scroll-text {
    /* animation properties */
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);

    -moz-animation: my-animation 22s linear infinite;
    -webkit-animation: my-animation 22s linear infinite;
    animation: my-animation 22s linear infinite;
}

/* for Firefox */
@-moz-keyframes my-animation {
    from {
        -moz-transform: translateX(100%);
    }

    to {
        -moz-transform: translateX(-100%);
    }
}

/* for Chrome */
@-webkit-keyframes my-animation {
    from {
        -webkit-transform: translateX(100%);
    }

    to {
        -webkit-transform: translateX(-100%);
    }
}

@keyframes my-animation {
    from {
        -moz-transform: translateX(100%);
        -webkit-transform: translateX(100%);
        transform: translateX(100%);
    }

    to {
        -moz-transform: translateX(-100%);
        -webkit-transform: translateX(-100%);
        transform: translateX(-100%);
    }
}
</style>