## SongCard.vue 設計書

### ● 目的
1曲ごとの表示・ランク・FC情報を編集または表示するカードコンポーネント。

###　UI要件
- 上半分に曲名(Songs.title)を表示する⭕️
- 下半分にランクプルダウンとFCチェックボックスを並列して配置する🔺もう少し上
- ランクプルダウンはNormal/Expertモードに対応したものにする⭕️
- ランクプルダウンで設定したランクに対応する色（@/constants/rank.tsに定義）にカードの背景色が変わる❌
- FCチェックボックスにチェックを入れると #ff69b4の色でカードの上に「FULL COMBO!!」と表示され、#ffb6c1の色でbox-shadow, ::afterでカードの裏から光るデザインにする❌
- 100%にチェックを入れると#E6B422でカードの上に「EXCELLENT!!!」と表示され、#E6B422をやや薄くした色でbox-shadow, ::afterでカードの裏から光る仕様にして、FCチェックボックスは非活性にする❌

### インポート
useUiStore 　from '@/stores/uiStore'（Pinia）
{ Song } from '@/types'
{ getRankColor } from '@/constants/rank'

### 関数
- interface Props{song: {title: string, rank: string, fc: boolean})：jirikiSectionのsongを受け継いだ
- props = defineProps<Props>()：Propsを使えるようにしたもの
- rankStore = useRankStore()を使えるようにしたもの
- uiStore = useUiStore()を使えるようにしたもの
- currentRanks = RankStore.modeがNormalならNormalのランクスケール、ExpertならExpertのランクスケールを代入する
- isExcellent = props.song.rank が'100%'の場合代入する
- isFC = props.song.fcが真、またはisExcellent.value？の場合に代入する
- editable = uiStoreがeditModeのときにtrue？

### ● Props
| 名前       | 型       | 説明                         |
|------------|----------|------------------------------|
| song       | Song     | 曲データ                      |
| editable   | boolean  | 編集モードかどうか             |

### ● Emits
| イベント名        | 用途                           |
|------------------|--------------------------------|
| update:rank      | ランクが変更されたとき通知       |
| update:fc        | FC状態が変更されたとき通知       |

### ● 状態変数（ref, reactive）
| 変数名         | 型       | 用途                        |
|----------------|----------|-----------------------------|
| selectedRank   | string   | 選択されたランク              |
| isFullCombo    | boolean  | FULL COMBO状態               |


### ● 表示制御
- 達成率に応じた背景色
- FC時のホットピンク演出
- editable=false時は非表示＆簡略表示
