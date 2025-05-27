<template>
  <div class="dashboard-wrapper">
    <!-- ✅ モード切替（右上） -->
    <div class="top-controls" v-if="!isGuestView">
      <ModeSwitch />
    </div>

    <!-- ✅ タイトル -->
    <h1 class="page-title">レベル11難易度表</h1>
    <!-- ✅ ユーザーが存在しないときのエラーメッセージ -->
    <div v-if="userNotFound" class="not-found-message">
      このユーザーは存在しないか、アカウントが削除されています。
    </div>

    <!-- ✅ Progress セクション -->
    <section class="card" v-if="!isGuestView">
      <h2 class="section-title">Progress</h2>
      <ProgressSection
        :achieved="totalAchieved"
        :total="scoreStore.scores.length"
        :selectRank="uiStore.selectedRank"
        :allSongs="scoreStore.scores"
      />
    </section>

    <!-- ✅ Tier セクション -->
    <section class="card">
      <h2 class="section-title">Tier</h2>
      <TierSection :songs="scoreStore.scores" :editable="isEditable" :showFilter="!isGuestView" />
    </section>
  </div>
  <!-- ✅ 自分のマイページのみ表示 -->
  <div v-if="isEditable" style="margin-top: 40px; text-align: center;">
    <button @click="deleteAccount" class="danger-button">
      アカウントを削除する
    </button>
  </div>

</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ModeSwitch from '@/components/common/ModeSwitch.vue'
import ProgressSection from '@/components/dashboard/ProgressSection.vue'
import TierSection from '@/components/dashboard/TierSection.vue'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { useScoreStore } from '@/stores/scoreStore'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()
const scoreStore = useScoreStore()

// ✅ クエリから user を取得
const queryUserId = computed(() => {
  const q = route.query.user
  return typeof q === 'string' ? Number(q) : null
})

const currentUserId = computed(() => authStore.user?.id)

// ✅ ゲストかどうか
const isGuestView = computed(() => queryUserId.value === null)

// ✅ 編集可能か（クエリとログインID一致時）
const isEditable = computed(() =>
  queryUserId.value !== null && queryUserId.value === currentUserId.value
)

// ✅ スコアを読み込む
watch(
  () => [authStore.user, queryUserId.value],
  async ([user]) => {
    if (queryUserId.value !== null) {
      await scoreStore.loadScores(queryUserId.value)
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

const auth = useAuthStore()
const router = useRouter()

const deleteAccount = async () => {
  const confirmed = confirm('アカウントを削除すると戻せません。本当によろしいですか？')
  if (!confirmed) return

  try {
    await api.get('/sanctum/csrf-cookie') // 🔑 重要：トークンを再取得

    const userId = auth.user?.id
    if (!userId) throw new Error('ユーザー情報が取得できません')

    await api.delete(`/api/users/${userId}`)

    await auth.logout()
    router.push('/')
  } catch (e: any) {
    console.error('削除エラー:', e)
    alert('アカウント削除に失敗しました')
  }
}

// ✅ スコアデータが空で、ゲストでなく、自分でもない → 存在しないユーザー
const userNotFound = computed(() =>
  queryUserId.value !== null &&
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
.not-found-message {
  text-align: center;
  color: #ff4d4f;
  font-weight: bold;
  margin-bottom: 24px;
}


</style>
