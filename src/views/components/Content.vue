<template>
  <div class="content">
    <p id="title">{{ title || ' ' }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: String
})

</script>