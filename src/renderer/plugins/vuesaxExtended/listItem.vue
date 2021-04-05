<template>
    <li class="list-item mt-5">
        <p v-if="!!$slots.description">
            <slot name="description"/>
        </p>
        <slot v-if="!!$slots.button" name="button"/>
    </li>
</template>

<style lang="scss" scoped>
.list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>