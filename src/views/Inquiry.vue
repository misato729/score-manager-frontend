<template>
    <div class="top-wrapper">
      <!-- ページタイトル -->
      <header class="page-title">
        <h1>お問い合わせ</h1>
        <h2>ご意見・ご連絡はこちらから</h2>
      </header>

      <!-- 忍者AdMax広告 -->
      <AdNinja />
  
      <!-- メールでの問い合わせ -->
      <section class="card" style="max-width: 800px">
        <h2 class="title">個別のお問い合わせ</h2>
        <p class="lead">
          不具合報告、機能のご要望、その他個別対応が必要な内容については以下のメールアドレスかXアカウントにご連絡ください。
        </p>
        <p><a href="mailto:rbplus.rank.manager@gmail.com" class="link">rbplus.rank.manager@gmail.com</a></p>
        <p>Xアカウント：<a href="https://x.com/Rbplus_manager" class="link">@Rbplus_manager</a></p>
      </section>
  
      <!-- Googleフォーム -->
      <section class="card" style="max-width: 800px">
        <h2 class="title">フォームでのご連絡</h2>
        <p class="lead">
          難易度表の修正リクエストや、設置店舗情報の提供などについては、以下のフォームから送信をお願いします。
        </p>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfpFuuTDnhOgjHN9q9a2SroXizKWe0-GvfWsmyrPdi9ddKl-Q/viewform?embedded=true"
          width="100%"
          height="650"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >読み込んでいます…</iframe>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  // 特になし
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
  </style>
  