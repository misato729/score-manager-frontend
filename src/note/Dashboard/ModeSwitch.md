1. 概要

ModeSwitch.vue は、Normal / Expert モードを切り替えるラジオボタン形式のUIコンポーネントです。Piniaストア（uiStore）とリアルタイムに連携し、アプリ全体の表示モードを切り替える役割を担います。

2. Props / Emits

| 項目    | 内容                          |
| ----- | --------------------------- |
| Props | なし                          |
| Emits | なし（`v-model` による双方向バインディング） |


3. 使用ストア

| ストア名    | 管理内容                    | 備考                                   |
| ------- | ----------------------- | ------------------------------------ |
| uiStore | `mode`（Normal / Expert） | `computed` で getter/setter を利用し双方向連携 |

const mode = computed<Mode>({
  get: () => uiStore.mode,
  set: (newMode) => {
    uiStore.setMode(newMode)
  }
})

4. UI構成

ラジオボタン（Normal / Expert）

区切りスラッシュ（/）

選択中のモードに応じて uiStore.mode が更新され、他のコンポーネントに反映される

5. スタイリングルール

.mode-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-label {
  font-size: 16px;
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 4px;
}

.radio-label input[type='radio'] {
  accent-color: black;
  width: 18px;
  height: 18px;
}

.divider {
  color: #999;
  font-size: 16px;
}

6. 今後の拡張予定（ToDo）



