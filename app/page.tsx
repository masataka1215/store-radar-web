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
  '和食','日本料理','寿司','海鮮・魚介','そば（蕎麦）','うなぎ','焼き鳥',
  'お好み焼き','もんじゃ焼き','洋食','フレンチ','イタリアン','スペイン料理',
  'ステーキ','中華料理','韓国料理','タイ料理','ラーメン','カレー','鍋',
  'もつ鍋','居酒屋','パン','スイーツ','バー・お酒','天ぷら','焼肉',
  '料理旅館','ビストロ','ハンバーグ','とんかつ','串揚げ','うどん',
  'しゃぶしゃぶ','沖縄料理','ハンバーガー','パスタ','ピザ','餃子','ホルモン',
  'カフェ','喫茶店','ケーキ','タピオカ','食堂','ビュッフェ・バイキング',
]

const STAFF = ['梁川 允孝', '長野 敏也', '有馬 時也', '井口 凌太']

const STATUSES = ['新規', '商談中', '成約', '失注', '対象外']

export default function Home() {
  const [stores, setStores] = useState<any[]>([])
  const [area, setArea] = useState('すべて')
  const [genre, setGenre] = useState('すべて')
  const [staff, setStaff] = useState('梁川 允孝')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

const handleSearch = async () => {
    if (area === 'すべて' || area.startsWith('---')) {
      alert('エリアを選択してください')
      return
    }
    setLoading(true)
    setSearched(false)
    setStores([])
    try {
      const params = new URLSearchParams({ area, genre, staff })
      const res = await fetch(`/api/search?${params}`)
      if (!res.ok) throw new Error('APIエラー')
      const data = await res.json()
      setStores(data)
    } catch (e) {
      alert('検索に失敗しました。もう一度試してください。')
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return (
    <div style={{minHeight:'100vh', background:'#f9f7f4', padding:'2rem'}}>
      <div style={{maxWidth:'1200px', margin:'0 auto'}}>

        {/* タイトル */}
        <h1 style={{fontSize:'24px', fontWeight:'600', marginBottom:'1.5rem', color:'#1a1a1a'}}>
          関西飲食店 営業リスト
        </h1>

        {/* フィルター */}
        <div style={{display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>エリア</div>
            <select style={{border:'1px solid #ddd', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', background:'white', minWidth:'160px'}}
              value={area} onChange={e => { if (e.target.value.startsWith('---')) return; setArea(e.target.value) }}>
              {AREAS.map(a => (
                a.startsWith('---')
                  ? <option key={a} disabled style={{fontWeight:'bold', color:'#aaa'}}>{a}</option>
                  : <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>職種</div>
            <select style={{border:'1px solid #ddd', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', background:'white', minWidth:'160px'}}
              value={genre} onChange={e => setGenre(e.target.value)}>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>担当者</div>
            <select style={{border:'1px solid #ddd', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', background:'white', minWidth:'140px'}}
              value={staff} onChange={e => setStaff(e.target.value)}>
              {STAFF.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={handleSearch}
            style={{background:'#1a1a1a', color:'white', border:'none', borderRadius:'8px', padding:'10px 24px', fontSize:'14px', cursor:'pointer', fontWeight:'500'}}>
            検索
          </button>
          {stores.length > 0 && (
  <button onClick={() => {
    const headers = ['会社名','担当者','コール時間設定','ステータス','電話番号','業界','職種','都道府県','市区町村','ウェブサイトURL','google評価','口コミ数','取得日']
    const rows = stores.map(s => headers.map(h => `"${(s[h] || '').toString().replace(/"/g, '""')}"`).join(','))
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], {type: 'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `営業リスト_${area}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }}
  style={{background:'#22c55e', color:'white', border:'none', borderRadius:'8px', padding:'10px 24px', fontSize:'14px', cursor:'pointer', fontWeight:'500'}}>
    CSVダウンロード
  </button>
)}
        </div>

        {/* 件数表示 */}
        {searched && !loading && (
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem', marginBottom:'1.5rem'}}>
            {[
              {label:'総件数', value: stores.length},
              {label:'エリア', value: area},
              {label:'担当者', value: staff},
            ].map(({label, value}) => (
              <div key={label} style={{background:'white', borderRadius:'12px', padding:'1rem 1.25rem', border:'1px solid #eee'}}>
                <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>{label}</div>
                <div style={{fontSize:'22px', fontWeight:'600', color:'#1a1a1a'}}>{value}</div>
              </div>
            ))}
          </div>
        )}
{loading && (
  <div style={{textAlign:'center', padding:'2rem', color:'#888', fontSize:'14px'}}>
    <div>🔍 検索中...</div>
    <div style={{fontSize:'12px', marginTop:'4px'}}>（エリアによって10〜30秒かかります）</div>
  </div>
)}
{!loading && searched && stores.length === 0 && (
  <p style={{color:'#e53e3e', fontSize:'14px', marginBottom:'1rem'}}>
    ⚠️ 該当する店舗が見つかりませんでした
  </p>
)}
{!loading && searched && stores.length > 0 && (
  <p style={{color:'#888', fontSize:'14px', marginBottom:'1rem'}}>{stores.length}件見つかりました</p>
)}
{!searched && !loading && (
  <p style={{color:'#aaa', fontSize:'14px', marginBottom:'1rem'}}>エリアと職種を選んで検索してください</p>
)}
        
        {/* テーブル */}
        <div style={{background:'white', borderRadius:'12px', border:'1px solid #eee', overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px'}}>
              <thead>
                <tr style={{background:'#f9f9f9', borderBottom:'1px solid #eee'}}>
                  {['会社名','担当者','コール時間','ステータス','電話番号','業界','職種','都道府県','市区町村','ウェブサイト','評価','口コミ数','取得日'].map(h => (
                    <th key={h} style={{textAlign:'left', padding:'12px 16px', color:'#666', fontWeight:'500', whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stores.map((s, i) => (
                  <tr key={i} style={{borderBottom:'1px solid #f0f0f0'}}>
                    <td style={{padding:'12px 16px', fontWeight:'500', whiteSpace:'nowrap'}}>{s.会社名}</td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap', color:'#555'}}>{s.担当者}</td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap', color:'#555'}}>{s.コール時間設定}</td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{background:'#e8f0fe', color:'#1a73e8', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500'}}>{s.ステータス}</span>
                    </td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap'}}>{s.電話番号 || '-'}</td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap', color:'#555'}}>{s.業界}</td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap'}}>
                      <span style={{background:'#f0f0f0', color:'#444', padding:'3px 10px', borderRadius:'20px', fontSize:'12px'}}>{s.職種}</span>
                    </td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap', color:'#555'}}>{s.都道府県}</td>
                    <td style={{padding:'12px 16px', color:'#555'}}>{s.市区町村}</td>
                    <td style={{padding:'12px 16px'}}>
                      {s.ウェブサイトURL
                        ? <a href={s.ウェブサイトURL} target="_blank" style={{color:'#1a73e8', textDecoration:'none', fontSize:'12px'}}>リンク</a>
                        : <span style={{color:'#ccc'}}>-</span>}
                    </td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap'}}>{s.google評価 ? `★${s.google評価}` : '-'}</td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap', color:'#555'}}>{s.口コミ数 || '-'}</td>
                    <td style={{padding:'12px 16px', whiteSpace:'nowrap', color:'#aaa'}}>{s.取得日}</td>
                  </tr>
                ))}
                {!loading && searched && stores.length === 0 && (
                  <tr><td colSpan={13} style={{textAlign:'center', padding:'3rem', color:'#aaa'}}>データがありません</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}