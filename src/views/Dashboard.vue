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
  
      <!-- 忍者AdMax広告 -->
      <AdNinja
        admaxId="admax-banner-71116c76-8d59-40a8-ad37-7667c8f380f3"
        tagId="e5d56508d18963b760f668e9750b78df"
        :width="728"
        :height="90"
      />

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
    <button @click="handleDelete" class="danger-button">
      アカウントを削除する
    </button>
  </div>

</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import ModeSwitch from '@/components/common/ModeSwitch.vue'
import ProgressSection from '@/components/dashboard/ProgressSection.vue'
import TierSection from '@/components/dashboard/TierSection.vue'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { useScoreStore } from '@/stores/scoreStore'
import { updateTarget } from '@/api/userApi'
import api from '@/api/axios'
import AdNinja from '@/components/common/AdNinja.vue'

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


// ✅ アカウント削除
const router = useRouter()

const handleDelete = async () => {
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
  queryUserId.value !== null &&
  !scoreStore.loading &&
  scoreStore.scores.length === 0 &&
  !isEditable.value
)

// ✅ モード変更＆target保存のdebounced関数
const expertRanks = ['95%', '96%', '97%', '98%', '99%', '100%']
const applyModeAndSaveTarget = debounce(async (target: string | undefined) => {
  if (!target) return

  // ✅ モード切り替え
  if (expertRanks.includes(target)) {
    uiStore.setMode('Expert')
    if (import.meta.env.DEV) {
      console.log(`✅ [DEV] Expertモードに切り替え（target: ${target}）`)
    }
  } else {
    uiStore.setMode('Normal')
    if (import.meta.env.DEV) {
      console.log(`✅ [DEV] Normalモードに切り替え（target: ${target}）`)
    }
  }

  // ✅ selectedRank に反映
  uiStore.selectedRank = target
  if (import.meta.env.DEV) {
    console.log(`✅ [DEV] selectedRank に設定: ${target}`)
  }

  // ✅ APIに保存（ログイン時のみ）
  try {
    await updateTarget(target)
    if (import.meta.env.DEV) {
      console.log(`✅ [DEV] target更新成功（API保存完了）: ${target}`)
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ [DEV] target更新失敗（APIエラー）:', error)
    }
  }
}, 300)

// ✅ 自分のページかどうかを判定
const isMyPage = computed(() => {
  const paramUserId = route.query.user?.toString()
  const loginUserId = authStore.user?.id?.toString()
  return paramUserId === loginUserId
})

// ✅ targetを監視：自分のページのときだけ反映
watch(
  () => authStore.user?.target,
  (newTarget) => {
    if (isMyPage.value) {
      applyModeAndSaveTarget(newTarget)
    }
  },
  { immediate: true }
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
