<template>
  <div class="dashboard-wrapper">
    <!-- ✅ モード切替（右上） -->
    <div class="top-controls" v-if="!isGuestView">
      <ModeSwitch :mode="mode" @change="setMode" />
    </div>

    <!-- ✅ タイトル -->
    <h1 class="page-title">{{ pageTitle }}</h1>
    <!-- ✅ ユーザーが存在しないときのエラーメッセージ -->
    <div v-if="userNotFound" class="not-found-message">
      このユーザーは存在しないか、アカウントが削除されています。
    </div>
  
      <!-- 忍者AdMax広告 -->
      <AdNinja
        admaxId="admax-banner-xxx"
        tagId="e5d56508d18963b760f668e9750b78df"
        :width="728"
        :height="90"
      />

    <!-- ✅ Progress セクション -->
    <section class="card" v-if="!isGuestView">
      <h2 class="section-title">Progress</h2>
      <ProgressSection
        :mode="mode"
        :achieved="totalAchieved"
        :fullCombo="totalFullCombo"
        :total="scoreStore.scores.length"
        :selectRank="uiStore.selectedRank"
        :allSongs="scoreStore.scores"
      />
    </section>

    <!-- ✅ Tier セクション -->
    <section class="card">
      <h2 class="section-title">Tier</h2>
      <TierSection :mode="mode" :songs="scoreStore.scores" :editable="isEditable" :showFilter="!isGuestView" />
    </section>
  </div>
  <!-- ✅ 自分のマイページのみ表示 -->
  <div v-if="isEditable" style="margin-top: 40px; text-align: center;">
    <button
      @click="handleDelete"
      class="danger-button"
      :disabled="isProtectedDemoAccount"
    >
      アカウントを削除する
    </button>
  </div>

</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import ModeSwitch from '@/components/common/ModeSwitch.vue'
import ProgressSection from '@/components/dashboard/ProgressSection.vue'
import TierSection from '@/components/dashboard/TierSection.vue'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { useScoreStore } from '@/stores/scoreStore'
import { parseMode } from '@/utils/rank'
import type { Mode } from '@/types'
import api from '@/api/axios'
import AdNinja from '@/components/common/AdNinja.vue'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()
const scoreStore = useScoreStore()
const mode = computed(() => parseMode(route.query.mode))

function setMode(newMode: Mode) {
  router.push({ query: { ...route.query, mode: newMode }, hash: route.hash })
}

// ✅ パスからユーザーIDを取得
const routeUserId = computed(() => {
  const id = route.params.userId
  return typeof id === 'string' ? Number(id) : null
})

const currentUserId = computed(() => authStore.user?.id)
const isProtectedDemoAccount = computed(() => currentUserId.value === 8)

// ✅ ゲストかどうか
const isGuestView = computed(() => routeUserId.value === null)

const pageTitle = computed(() => {
  if (routeUserId.value !== null && scoreStore.displayUserName) {
    return `${scoreStore.displayUserName}さんのレベル11難易度表`
  }
  return 'レベル11難易度表'
})

// ✅ 編集可能か（パスとログインID一致時）
const isEditable = computed(() =>
  routeUserId.value !== null && routeUserId.value === currentUserId.value
)

// ✅ スコアを読み込む
watch(
  () => [authStore.user, routeUserId.value],
  async () => {
    if (routeUserId.value !== null) {
      await scoreStore.loadScores(routeUserId.value)
    } else {
      await scoreStore.loadScoresForGuest()
    }
  },
  { immediate: true }
)

// ✅ 達成曲数
const totalAchieved = computed(() =>
  scoreStore.scores.filter(score => score.rank !== '').length
)

// ✅ フルコンボ曲数
const totalFullCombo = computed(() =>
  scoreStore.scores.filter(score => score.fc).length
)

// ✅ アカウント削除
const router = useRouter()

const handleDelete = async () => {
  if (isProtectedDemoAccount.value) return

  const confirmed = confirm('アカウントを削除すると戻せません。本当に削除しますか？')
  if (!confirmed) return

  try {
    // ✅ アカウント削除（API叩く）
    await api.delete(`/api/users/${authStore.user?.id}`)
    console.log('✅ アカウント削除成功')

    // ✅ logoutは失敗する可能性があるのでtry-catch
    try {
      await api.post('/logout')
    } catch (e) {
      console.warn('⚠️ logout失敗（削除済ユーザー）:', e)
    }

    // ✅ Vueのストアからログイン情報を初期化
    authStore.clear()

    // ✅ トップページに戻す
    router.push('/')
    alert('アカウントを削除しました（自動的にログアウトされます）')
  } catch (err) {
    console.error('❌ 削除エラー:', err)
    alert('アカウントの削除に失敗しました')
  }
}

// ✅ スコアデータが空で、ゲストでなく、自分でもない → 存在しないユーザー
const userNotFound = computed(() =>
  routeUserId.value !== null &&
  !scoreStore.loading &&
  scoreStore.scores.length === 0 &&
  !isEditable.value
)

</script>

<style scoped>
.dashboard-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
}

.ninja-ad {
  max-width: 100%;
  overflow: hidden;
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
  max-width: 1000px;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.danger-button {
  background: #ff4d4f;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}

.danger-button:hover {
  background: #cc0000;
}

.danger-button:disabled,
.danger-button:disabled:hover {
  background: #aaa;
  cursor: not-allowed;
}

.not-found-message {
  text-align: center;
  color: #ff4d4f;
  font-weight: bold;
  margin-bottom: 24px;
}


</style>
