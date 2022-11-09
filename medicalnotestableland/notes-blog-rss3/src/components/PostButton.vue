<script setup lang="ts">
import postButtonIconPng from '@/assets/post-button-icon.png'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

</script>
<template>
  <button
    class="border border-[#282828] rounded-[10px]
      w-[78px] h-[48px] focus:outline-none
      flex items-center justify-center"
  >
    <span class="text-2xl font-semibold font-cg">
      {{ t('button.post', 'Post') }}
    </span>
    <img class="ml-1" :src="postButtonIconPng" />
  </button>
</template>
