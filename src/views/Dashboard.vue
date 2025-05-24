<template>
  <div class="dashboard-wrapper">
    <!-- ✅ モード切替（右上） -->
    <div class="top-controls">
      <ModeSwitch />
    </div>

    <!-- ✅ タイトル -->
    <h1 class="page-title">レベル11難易度表</h1>



    <!-- ✅ Progress セクション -->
    <section class="card">
      <h2 class="section-title">Progress</h2>
      <ProgressSection />
    </section>

    <!-- ✅ Tier セクション -->
    <section class="card">
      <h2 class="section-title">Tier</h2>
      <TierSection />
    </section>

  </div>
</template>

<script setup lang="ts">

import ModeSwitch from '@/components/common/ModeSwitch.vue'
import ProgressSection from '@/components/dashboard/ProgressSection.vue'
import TierSection from '@/components/dashboard/TierSection.vue'
</script>

<style scoped>
.dashboard-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.top-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: bold;
  border-left: 8px solid #a48be0;
  padding-left: 12px;
  margin-bottom: 12px;
}

.card {
  background: #fff;
  max-width: 800px; 
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}
</style>
