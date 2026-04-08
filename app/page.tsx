'use client'
import { useState } from 'react'

const AREAS = [
  'すべて',
  '--- 大阪 ---',
  '大阪市北区','大阪市中央区','大阪市西区','大阪市浪速区',
  '大阪市天王寺区','大阪市阿倍野区','大阪市住吉区','大阪市城東区',
  '大阪市淀川区','大阪市東淀川区','大阪市福島区','大阪市都島区',
  '--- 京都 ---',
  '京都市中京区','京都市下京区','京都市上京区','京都市東山区',
  '京都市左京区','京都市伏見区',
  '--- 兵庫 ---',
  '神戸市中央区','神戸市灘区','神戸市東灘区','尼崎市','西宮市',
  '--- 奈良 ---',
  '奈良市','橿原市',
  '--- 滋賀 ---',
  '大津市','草津市',
]

const GENRES = [
  'すべて',
  '居酒屋','和食', '日本料理', '寿司', '海鮮・魚介', 'そば（蕎麦）', 'うなぎ', '焼き鳥',
  'お好み焼き', 'もんじゃ焼き', '洋食', 'フレンチ', 'イタリアン', 'スペイン料理',
  'ステーキ', '中華料理', '韓国料理', 'タイ料理', 'ラーメン', 'カレー', '鍋',
  'もつ鍋', '居酒屋', 'パン', 'スイーツ', 'バー・お酒', '天ぷら', '焼肉',
  '料理旅館', 'ビストロ', 'ハンバーグ', 'とんかつ', '串揚げ', 'うどん',
  'しゃぶしゃぶ', '沖縄料理', 'ハンバーガー', 'パスタ', 'ピザ', '餃子', 'ホルモン',
  'カフェ', '喫茶店', 'ケーキ', 'タピオカ', '食堂', 'ビュッフェ・バイキング',
]
export default function Home() {
  const [stores, setStores] = useState<any[]>([])
  const [area, setArea] = useState('すべて')
  const [genre, setGenre] = useState('すべて')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (area === 'すべて' || area.startsWith('---')) {
      alert('エリアを選択してください')
      return
    }
    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams({ area, genre })
    const res = await fetch(`/api/search?${params}`)
    const data = await res.json()
    setStores(data)
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">関西飲食店 営業リスト</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select className="border rounded px-3 py-2 text-sm" value={area} onChange={e => {
          if (e.target.value.startsWith('---')) return
          setArea(e.target.value)
        }}>
          {AREAS.map(a => (
            a.startsWith('---')
              ? <option key={a} disabled style={{fontWeight:'bold', color:'#888'}}>{a}</option>
              : <option key={a}>{a}</option>
          ))}
        </select>

        <select className="border rounded px-3 py-2 text-sm" value={genre} onChange={e => setGenre(e.target.value)}>
          {GENRES.map(g => <option key={g}>{g}</option>)}
        </select>

        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          検索
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500 mb-4">検索中...</p>}
      {!loading && searched && <p className="text-sm text-gray-500 mb-4">{stores.length}件</p>}
      {!searched && <p className="text-sm text-gray-400 mb-4">エリアと職種を選んで検索してください</p>}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">会社名</th>
              <th className="text-left px-4 py-3">住所</th>
              <th className="text-left px-4 py-3">評価</th>
              <th className="text-left px-4 py-3">口コミ数</th>
              <th className="text-left px-4 py-3">担当者</th>
              <th className="text-left px-4 py-3">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.会社名}</td>
                <td className="px-4 py-3 text-gray-500">{s.住所}</td>
                <td className="px-4 py-3">{s.google評価 ? `★ ${s.google評価}` : '-'}</td>
                <td className="px-4 py-3">{s.口コミ数 || '-'}</td>
                <td className="px-4 py-3">{s.担当者}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{s.ステータス}</span>
                </td>
              </tr>
            ))}
            {!loading && searched && stores.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">データがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}