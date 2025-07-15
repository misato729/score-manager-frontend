<template>
  <div class="ninja-ad">
    <iframe
      :srcdoc="generateIframeContent(admaxId, tagId, width, height)"
      :width="width"
      :height="height"
      frameborder="0"
      scrolling="no"
      style="border: none; overflow: hidden"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  admaxId: string
  tagId: string
  width: number
  height: number
}>()

function generateIframeContent(admaxId: string, tagId: string, width: number, height: number) {
  return `
    <div id="${admaxId}" style="display:inline-block;width:100%;height:100%;"></div>
    <script>
      window.admaxbanner = {
        admax_id: '${admaxId}',
        tag_id: '${tagId}',
        type: 'b',
        width: ${width},
        height: ${height}
      };
      document.write('<scr' + 'ipt src="https://adm.shinobi.jp/st/s.js"><\\/scr' + 'ipt>');
    <\/script>
  `
}
</script>

<style scoped>
.ninja-ad {
  margin: 1rem 0;
  text-align: center;
}
</style>
