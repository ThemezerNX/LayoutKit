<template>
    <div :style="`
             max-width: ${maxWidth};
             width: ${width};
             ${shadow ? 'box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, var(--vs-shadow-opacity));' : ''}
             ${square ? '' : 'border-radius: 5px 20px 20px 20px;'}
             ${disabled ? 'pointer-events: none; opacity: 0.4;' : ''}
         `"
         class="card"
    >
        <slot/>
        <div v-if="!$slots.default" class="vs-card__text" style="padding-top: 10px">
            <div v-if="!!$slots.title" :class="{flex}" class="vs-card__title">
                <slot name="title"/>
            </div>
            <p v-if="!!$slots.subtitle" :class="{flex}">
                <slot name="subtitle"/>
            </p>
            <div v-if="!!$slots.content" :class="{flex}" class="content">
                <slot name="content"/>
            </div>
            <div v-if="!!$slots.content2" :class="{flex}" class="content">
                <slot name="content2"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "card",
    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
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
        width: {
            type: String,
            required: false,
            default: "auto",
        },
        maxWidth: {
            type: String,
            required: false,
            default: "auto",
        },
        flex: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>

<style scoped>
.card {
    border-bottom: 0 solid rgba(0, 0, 0, .03);
    background: rgba(var(--vs-background), 1);
    position: relative;
    overflow: hidden;
    transition: all .25s ease;
    height: auto;
    margin: auto;
}

h1, h2, h3, h4, h5, h6 {
    padding: 0;
    margin: 0;
}

.content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.flex {
    display: flex;
}
</style>