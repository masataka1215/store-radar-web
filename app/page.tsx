'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AREAS = [
  'すべて',
  '--- 大阪 ---',
  '大阪市北区', '大阪市中央区', '大阪市西区', '大阪市浪速区',
  '大阪市天王寺区', '大阪市阿倍野区', '大阪市住吉区', '大阪市東住吉区',
  '大阪市城東区', '大阪市鶴見区', '大阪市生野区', '大阪市平野区',
  '大阪市西成区', '大阪市住之江区', '大阪市港区', '大阪市大正区',
  '大阪市此花区', '大阪市西淀川区', '大阪市淀川区', '大阪市東淀川区',
  '大阪市東成区', '大阪市旭区', '大阪市都島区', '大阪市福島区',
  '--- 京都 ---',
  '京都市中京区', '京都市下京区', '京都市上京区', '京都市東山区',
  '京都市左京区', '京都市右京区', '京都市伏見区', '京都市南区',
  '京都市北区', '京都市西京区', '京都市山科区',
  '--- 兵庫 ---',
  '神戸市中央区', '神戸市灘区', '神戸市東灘区', '神戸市兵庫区',
  '神戸市長田区', '神戸市須磨区', '神戸市垂水区', '神戸市西区',
  '尼崎市', '西宮市', '芦屋市', '伊丹市', '宝塚市',
  '--- 奈良 ---',
  '奈良市', '橿原市', '大和郡山市', '天理市', '桜井市',
  '--- 滋賀 ---',
  '大津市', '草津市', '守山市', '栗東市', '近江八幡市',
]
const GENRES = ['すべて','居酒屋','ラーメン','中華','イタリアン','フレンチ','そば・うどん','焼肉','和食','寿司','多国籍料理','カレー','バー','鉄板焼','スイーツ','カフェ','パン屋','その他飲食']
const STATUSES = ['すべて','新規','商談中','成約','失注','対象外']

export default function Home() {
　　const [stores, setStores] = useState<any[]>([])
  const [area, setArea] = useState('すべて')
  const [genre, setGenre] = useState('すべて')
  const [status, setStatus] = useState('すべて')
  const [loading, setLoading] = useState(false)

  const fetchStores = async () => {
    setLoading(true)
    let query = supabase.from('stores').select('*').limit(200)
    if (area !== 'すべて') query = query.eq('地域', area)
    if (genre !== 'すべて') query = query.eq('職種', genre)
    if (status !== 'すべて') query = query.eq('ステータス', status)
    const { data, error } = await query
    if (error) console.error(error)
    else setStores(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchStores() }, [])

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">関西飲食店 営業リスト</h1>

      {/* フィルター */}
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
        <select className="border rounded px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={fetchStores} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          検索
        </button>
      </div>

      {/* 件数 */}
      <p className="text-sm text-gray-500 mb-4">{loading ? '読み込み中...' : `${stores.length}件`}</p>

      {/* テーブル */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">会社名</th>
              <th className="text-left px-4 py-3">エリア</th>
              <th className="text-left px-4 py-3">職種</th>
              <th className="text-left px-4 py-3">電話番号</th>
              <th className="text-left px-4 py-3">評価</th>
              <th className="text-left px-4 py-3">ステータス</th>
              <th className="text-left px-4 py-3">取得日</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.会社名}</td>
                <td className="px-4 py-3 text-gray-500">{s.地域}</td>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{s.職種}</span>
                </td>
                <td className="px-4 py-3">{s.電話番号}</td>
                <td className="px-4 py-3">{s.google評価 ? `★ ${s.google評価}` : '-'}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{s.ステータス || '新規'}</span>
                </td>
                <td className="px-4 py-3 text-gray-400">{s.取得日}</td>
              </tr>
            ))}
            {!loading && stores.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">データがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}