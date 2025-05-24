## JirikiSection.vue 設計書

### ● 目的
Tier別に曲のカード（SongCard）を5列で表示するグループコンポーネント。

### UI要件
- Dashboard.vueのTierCard内のfilterの下に、地力S+, S, A+ A, B+, B, C, D, E, Fの順に表示する⭕️
- 地力ランクは中央に表示させる⭕️
- 地力セクションに該当する地力の曲がSongCardで表示される
- SongCardはGridレイアウトで最大５列❌
- filterPanel.vueでフィルターした時、該当のSongCardがフィルターされる（filterPanelからフィルタ情報をProp→DashBoardにSongCardをemitであってますか？）

### インポート
SongCard from '@/components/jiriki/SongCard.vue'
Song from '@/types' なにこれ

### ● 関数
interface Props { tierName: string, songs: Song[]}：Dashboard.vueのtierNameとsongsを受け継いだ
const props = defineProps<Props>()：Propsを使えるようにしたもの

### ● Props
| 名前      | 型       | 説明                       |
|-----------|----------|----------------------------|
| tierName  | string   | 地力難易度の段位名         |
| songs     | Song[]   | 該当Tierの曲リスト          |

### ● 使用コンポーネント
- SongCard.vue

### ● 状態変数
（基本的に内部状態は持たず、propsとv-forで描画）

### ● その他
- 曲リストはフィルタリング後のデータを親から受け取る
