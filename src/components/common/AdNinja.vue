<template>
  <div class="ninja-ad">
    <iframe
      ref="adIframe"
      :srcdoc="iframeContent"
      width="728"
      height="90"
      frameborder="0"
      scrolling="no"
      style="border: none; overflow: hidden"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
const iframeContent = `
  <div id="admax-banner-71116c76-8d59-40a8-ad37-7667c8f380f3" style="display:inline-block;width:728px;height:90px;"></div>
  <script>
    window.admaxbanner = {
      admax_id: 'admax-banner-71116c76-8d59-40a8-ad37-7667c8f380f3',
      tag_id: '72c75eb6b5a26d1116998f18665d0711',
      type: 'b',
      width: 728,
      height: 90
    };
    document.write('<scr' + 'ipt type="text/javascript" charset="utf-8" src="https://adm.shinobi.jp/st/s.js"></scr' + 'ipt>');
  <\/script>
`
</script>

<style scoped>
.ninja-ad {
  margin: 1rem 0;
  text-align: center;
}
</style>
