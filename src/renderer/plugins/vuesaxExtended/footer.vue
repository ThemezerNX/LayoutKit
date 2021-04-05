<template>
    <footer class="footer"
            :style="`
                 ${shadow ? 'box-shadow: 0px 5px 25px 0px rgba(0, 0, 0, var(--vs-shadow-opacity));' : ''}
                 ${square ? '' : 'border-radius: 15px 15px 0px 0px;'}
                 ${fixed ? 'position: fixed;' : ''}
                 `"
    >
        <slot/>
    </footer>
</template>

<script>
export default {
    name: "card",
    props: {
        square: {
            type: Boolean,
            required: false,
            default: false,
        },
        shadow: {
            type: Boolean,
            required: false,
            default: false,
        },
        fixed: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>

<style lang="scss" scoped>
.footer {
    background: white;
    width: 100%;
    bottom: 0;
    left: 0;

    border-bottom: 0 solid rgba(0, 0, 0, .03);
    background: rgba(var(--vs-background), 1);
    overflow: hidden;
    transition: all .25s ease;
    margin: auto;
}

h1, h2, h3, h4, h5, h6 {
    padding: 0;
    margin: 0;
}

.content {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>