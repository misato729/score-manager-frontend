<template>
  <div class="top-wrapper">
      <!-- サイト紹介セクション -->
      <header class="page-title">
      <h1>REFLEC BEAT plus レベル11</h1>
      <h2>難易度表＆クリアランク管理サイト</h2>
      </header>
      <section class="card intro-card" style="max-width: 800px">
        <h2 class="title">本サイトについて</h2>
        <p class="lead">
          <strong>REFLEC BEAT plus レベル11 難易度表＆クリアランク管理サイトにようこそ！</strong><br />
          本サイトは、KONAMIの音楽ゲーム「REFLEC BEAT Plus」のクリアランクを個人で管理するための非公式ツールです。
        </p>
        <ul>
          <li>クリアランク、FC/未FCを記録・可視化</li>
          <li>95%以上を1%刻みで管理するExpertモード</li>
          <li>クリアランク別のフィルター機能</li>
          <li>ランク・達成率に応じたカラースケール表示</li>
        </ul>
      </section>
  
      <!-- ログイン・登録 -->
      <section v-if="!auth.user" class="card login-card" style="max-width: 800px">
        <h2 class="title">ログイン/新規登録</h2>
        <p>以下のボタンからログインまたは新規登録をしてください。</p>
        <div class="button-row">
          <RouterLink to="/login" class="login-button">ログイン</RouterLink>
          <RouterLink to="/register" class="register-button">新規登録</RouterLink>
        </div>
      </section>
      <!-- 難易度表の作成基準 -->
    <section class="card rule-card" style="max-width: 800px">
      <h2 class="title purple">難易度表の作成基準</h2>
      <ul>
        <li><span class="important-note">AAA+基準</span></li>
        <li>常識の範囲での当たり譜面が基準（ZZで全て綺麗な階段など天文学的な確率の当たり譜面は想定しない）</li>
        <li>HIGH SPEED使用を想定</li>
        <li>全押し、意図的なLO捨て、物理サドプラによるギアチェンといったプレイ方法も想定内</li>
        <li>同地力内ではあいうえお順（アプリと同順）に整列</li>
        <li>地力F, E, DがリフレシアのLv13、地力C, B, B+がリフレシアのLv14、地力A, A+, S, S+がリフレシアのLv15に概ね相当</li>
        <li>リフレシアの詐称・逆詐称も考慮しているため、上記のレベルが必ずしも一致するとは限らない</li>
        <li>（例：Lv14のquaver♪は地力E、Lv13のRefrainは地力B+とした）</li>
      </ul>
    </section>
    
    <!-- ご利用にあたって -->
    <section class="card caution-card" style="max-width: 800px">
      <h2 class="title pink">ご利用にあたって</h2>
      <p class="important-note">
        本サイトはファンによる個人開発であり、KONAMIおよび関連企業とは一切関係ありません。
      </p>
      <p>
        掲載されている楽曲情報は非公式に分類・整理されたものであり、正確性や完全性を保証するものではありません。<br />
        個人情報の管理には細心の注意を払っておりますが、万が一のため他サイトとのパスワードの共有はお控えください。<br />
        本ツールの利用は自己責任でお願いいたします。
      </p>
    </section>

    <!-- プライバシーポリシー -->
    <section class="card caution-card" style="max-width: 800px">
      <h2 class="title pink">プライバシーポリシー</h2>
      <p>
        当サイト（<a href="https://rbplus-rank-manager.site" target="_blank" rel="noopener">rbplus-rank-manager.site</a>）では、Googleによる第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用しています。
      </p>
      <p>
        Googleを含む第三者広告配信事業者は、ユーザーの興味に応じた広告を表示するために、Cookieなどの技術を使用することがあります。これにより当サイトや他サイトへのアクセス情報に基づいた広告が表示されます。
      </p>
      <p>
        なお、取得される情報には氏名、住所、メールアドレス、電話番号などの個人を特定できる情報は一切含まれません。
      </p>
      <p>
        GoogleによるCookieの取り扱いなど詳細は、以下のページをご確認ください。<br />
        <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener">Googleの広告に関するポリシー</a>
      </p>
      <p>
        広告のパーソナライズを無効にしたい場合は、下記リンクより設定変更が可能です。<br />
        <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener">Google広告設定ページ</a><br />
      </p>
      <p>
        当サイトではアクセス解析ツールを使用する場合がありますが、収集される情報は匿名であり、個人を特定するものではありません。
      </p>
      <p>
        ご不明な点がありましたら、以下のメールアドレスまでご連絡ください。<br />
        <a href="mailto:rbplus.rank.manager@gmail.com" class="link">rbplus.rank.manager@gmail.com</a>
      </p>
    </section>


    <!-- 更新履歴 -->
    <section class="card update-card" style="max-width: 800px">
      <h2 class="title purple">更新履歴</h2>
      <ul>
        <li>ver.2025.06.01 : 本サイトをリリースしました。</li>
        <li>ver.2025.06.13 : 目標ランクが保存され、次回以降その値が自動で選ばれる仕様に修正しました。</li>
        <li>ver.2025.06.15 : 「楽曲一覧」「設置店舗」「お問い合わせ」ページを新設しました。</li>
      </ul>
    </section>

  </div>
</template>
  
  <script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'

  const auth = useAuthStore()

  </script>
  
  <style>
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



  
  .lead {
    margin-bottom: 12px;
    line-height: 1.6;
  }
  
  ul {
    padding-left: 1.2em;
  }
  
  .button-row {
    display: flex;
    gap: 20px;
    margin-top: 16px;
  }
  
  .login-button,
  .register-button {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 6px;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    width: 120px;
  }
  
  .login-button {
    background: #59aaff;
    color: white;
  }
  
  .login-button:hover {
    background: #1c8cff;
  }
  
  .register-button {
    background: #58d879;
    color: white;
  }
  
  .register-button:hover {
    background: #2bbd5f;
  }

  .rule-card .title.purple {
  border-left-color: #a48be0;
}

.caution-card .title.pink {
  border-left-color: #ff5cb8;
}

.important-note {
  color: #ff5cb8;
  font-weight: 1000;
}

  </style>
  
<style scoped>
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    border-left: 8px solid #a48be0; /* パープルのライン */
    padding-left: 12px;
    margin-bottom: 16px;
  }
</style>