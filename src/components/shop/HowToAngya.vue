<template>
    <div class="top-wrapper">
      <!-- ページタイトル -->
      <header class="page-title">
        <h1>行脚機能の使い方</h1>
      </header>
  
      <section class="card" style="max-width: 800px">
        <h2 class="title">行脚とは？</h2>
        <p>行脚（あんぎゃ）とは、訪問した店舗や都道府県を記録するスタンプラリーのような機能で、様々な音ゲーに搭載されています。</p>
        <p>REFLEC BEATにはそのような機能はないので、本アプリで実装してみました。</p>
        <p>旅行や他機種の行脚のついでにリフレクの行脚も楽しんでいただけたら幸いです。</p>
      </section>

      <section class="card" style="max-width: 800px">
        <h2 class="title">やり方</h2>
        <p>本機能はログイン中にのみ使用可能です。</p>
        <p>①設置店舗に近づいた時（300m以内）、詳細ウィンドウ内にチェックインボタンが表示されます。</p>
        <img src="@/assets/angya1.png" alt="行脚のやり方1" class="angya-img"/>

        <p>②ユーザー名をクリックすると開くプルダウンから「行脚履歴」をクリックします。</p>
        <p>チェックインボタンを押した店舗は「行脚店舗一覧」に表示されるようになります。</p>
        <img src="@/assets/angya4.png" alt="行脚のやり方4" class="angya-img"/>
        <img src="@/assets/angya2.png" alt="行脚のやり方2" class="angya-img"/>

        <p>③行脚済みの店舗はピンの色が緑色になります。</p>
        <img src="@/assets/angya3.png" alt="行脚のやり方3" class="angya-img"/>

      </section>
  
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.top-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #ffece6, #e8fff2);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
}

.page-title {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 24px;
}

.page-title h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-title h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #444;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  padding: 24px;
  margin: 0 auto;
  box-sizing: border-box;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  border-left: 8px solid #a48be0;
  padding-left: 12px;
  margin-bottom: 16px;
}

.lead {
  margin-bottom: 12px;
  line-height: 1.6;
}

.link {
  color: #1c8cff;
  font-weight: bold;
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
}

.angya-img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
  border-radius: 8px; /* 角丸でやさしい印象に */
}
</style>
