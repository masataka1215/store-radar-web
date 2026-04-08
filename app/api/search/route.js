import { NextResponse } from 'next/server'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

const GENRE_MAP = {
  '和食': '和食', '日本料理': '日本料理', '寿司': '寿司',
  '海鮮・魚介': '海鮮 魚介', 'そば（蕎麦）': 'そば 蕎麦', 'うなぎ': 'うなぎ',
  '焼き鳥': '焼き鳥', 'お好み焼き': 'お好み焼き', 'もんじゃ焼き': 'もんじゃ',
  '洋食': '洋食', 'フレンチ': 'フランス料理', 'イタリアン': 'イタリアン',
  'スペイン料理': 'スペイン料理', 'ステーキ': 'ステーキ', '中華料理': '中華料理',
  '韓国料理': '韓国料理', 'タイ料理': 'タイ料理', 'ラーメン': 'ラーメン',
  'カレー': 'カレー', '鍋': '鍋料理', 'もつ鍋': 'もつ鍋',
  '居酒屋': '居酒屋', 'パン': 'パン ベーカリー', 'スイーツ': 'スイーツ',
  'バー・お酒': 'バー', '天ぷら': '天ぷら', '焼肉': '焼肉',
  '料理旅館': '料理旅館', 'ビストロ': 'ビストロ', 'ハンバーグ': 'ハンバーグ',
  'とんかつ': 'とんかつ', '串揚げ': '串揚げ 串カツ', 'うどん': 'うどん',
  'しゃぶしゃぶ': 'しゃぶしゃぶ', '沖縄料理': '沖縄料理',
  'ハンバーガー': 'ハンバーガー', 'パスタ': 'パスタ', 'ピザ': 'ピザ',
  '餃子': '餃子', 'ホルモン': 'ホルモン', 'カフェ': 'カフェ',
  '喫茶店': '喫茶店', 'ケーキ': 'ケーキ', 'タピオカ': 'タピオカ',
  '食堂': '食堂', 'ビュッフェ・バイキング': 'バイキング ビュッフェ',
}

// 職種の自動分類
const GENRE_CLASSIFY = [
  { label: '居酒屋', keywords: ['居酒屋', '酒場', '炉端', '酒'] },
  { label: 'ラーメン', keywords: ['ラーメン', 'らーめん', '拉麺', '麺'] },
  { label: '中華', keywords: ['中華', '中国料理', '餃子', '麻婆', '点心'] },
  { label: 'イタリアン', keywords: ['イタリアン', 'イタリア', 'ピザ', 'パスタ', 'トラットリア'] },
  { label: 'フレンチ', keywords: ['フレンチ', 'フランス料理', 'ビストロ'] },
  { label: 'そば・うどん', keywords: ['そば', 'うどん', '蕎麦'] },
  { label: '焼肉', keywords: ['焼肉', '焼き肉', 'ホルモン', 'カルビ'] },
  { label: '和食', keywords: ['和食', '日本料理', '割烹', '懐石', '定食'] },
  { label: '寿司', keywords: ['寿司', '鮨', 'すし', '握り'] },
  { label: '多国籍料理', keywords: ['アジア', 'タイ', '韓国', 'インド', 'メキシコ', 'エスニック'] },
  { label: 'カレー', keywords: ['カレー', 'curry'] },
  { label: 'バー', keywords: ['バー', 'bar', 'BAR', 'ワイン', 'ダイニングバー'] },
  { label: '鉄板焼', keywords: ['鉄板焼', '鉄板', 'お好み焼き', 'もんじゃ'] },
  { label: 'スイーツ', keywords: ['スイーツ', 'ケーキ', 'パフェ', 'デザート'] },
  { label: 'カフェ', keywords: ['カフェ', 'cafe', 'coffee', 'コーヒー', '喫茶'] },
  { label: 'パン屋', keywords: ['パン', 'ベーカリー', 'bakery'] },
]

function classifyGenre(name) {
  for (const g of GENRE_CLASSIFY) {
    for (const kw of g.keywords) {
      if (name.includes(kw)) return g.label
    }
  }
  return '不明'
}

const AREA_COORDS = {
  '大阪市北区': {lat:34.7024,lng:135.4937,pref:'大阪府'},
  '大阪市中央区': {lat:34.6863,lng:135.5090,pref:'大阪府'},
  '大阪市西区': {lat:34.6778,lng:135.4897,pref:'大阪府'},
  '大阪市浪速区': {lat:34.6627,lng:135.5020,pref:'大阪府'},
  '大阪市天王寺区': {lat:34.6488,lng:135.5163,pref:'大阪府'},
  '大阪市阿倍野区': {lat:34.6348,lng:135.5141,pref:'大阪府'},
  '大阪市住吉区': {lat:34.6097,lng:135.5082,pref:'大阪府'},
  '大阪市城東区': {lat:34.6927,lng:135.5397,pref:'大阪府'},
  '大阪市淀川区': {lat:34.7274,lng:135.4897,pref:'大阪府'},
  '大阪市東淀川区': {lat:34.7468,lng:135.5212,pref:'大阪府'},
  '大阪市福島区': {lat:34.6968,lng:135.4712,pref:'大阪府'},
  '大阪市都島区': {lat:34.7077,lng:135.5286,pref:'大阪府'},
  '京都市中京区': {lat:35.0116,lng:135.7681,pref:'京都府'},
  '京都市下京区': {lat:34.9934,lng:135.7561,pref:'京都府'},
  '京都市上京区': {lat:35.0297,lng:135.7517,pref:'京都府'},
  '京都市東山区': {lat:34.9981,lng:135.7819,pref:'京都府'},
  '京都市左京区': {lat:35.0397,lng:135.7819,pref:'京都府'},
  '京都市伏見区': {lat:34.9348,lng:135.7681,pref:'京都府'},
  '神戸市中央区': {lat:34.6913,lng:135.1956,pref:'兵庫県'},
  '神戸市灘区': {lat:34.7168,lng:135.2341,pref:'兵庫県'},
  '神戸市東灘区': {lat:34.7227,lng:135.2712,pref:'兵庫県'},
  '尼崎市': {lat:34.7334,lng:135.4068,pref:'兵庫県'},
  '西宮市': {lat:34.7368,lng:135.3412,pref:'兵庫県'},
  '奈良市': {lat:34.6851,lng:135.8048,pref:'奈良県'},
  '橿原市': {lat:34.5063,lng:135.7948,pref:'奈良県'},
  '大津市': {lat:35.0045,lng:135.8686,pref:'滋賀県'},
  '草津市': {lat:34.9836,lng:135.9597,pref:'滋賀県'},
}

const KNOWN_CHAINS = [
  'スターバックス','マクドナルド','吉野家','すき家','松屋','サイゼリヤ',
  'ガスト','スシロー','くら寿司','はま寿司','天下一品','丸亀製麺',
  'ケンタッキー','モスバーガー','ドミノ','コメダ','ドトール','タリーズ',
  '餃子の王将','大阪王将','リンガーハット',
]

function isChain(name) {
  if (KNOWN_CHAINS.some(c => name.includes(c))) return true
  if (/(.+)(店|支店|号店|本店)$/.test(name)) return true
  return false
}

async function getDetails(place_id) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=formatted_phone_number,website,formatted_address&language=ja&key=${API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return {
    phone: data.result?.formatted_phone_number || '',
    website: data.result?.website || '',
    address: data.result?.formatted_address || '',
  }
}

function parseAddress(address) {
  // 「日本、〒xxx-xxxx 大阪府大阪市北区〇〇」→ 都道府県と市区町村以降に分割
  address = address.replace(/日本、?/, '').replace(/〒\d{3}-\d{4}\s*/, '').trim()
  const prefMatch = address.match(/^(東京都|北海道|(?:大阪|京都)府|.+?県)(.+)$/)
  if (prefMatch) {
    return { pref: prefMatch[1], city: prefMatch[2] }
  }
  return { pref: '', city: address }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area')
  const genre = searchParams.get('genre')

  const coords = AREA_COORDS[area]
  if (!coords) return NextResponse.json({ error: 'エリアを選択してください' }, { status: 400 })

  const keyword = GENRE_MAP[genre] || '飲食店'
  const today = new Date().toISOString().slice(0, 10)

  const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.lat},${coords.lng}&radius=1000&keyword=${encodeURIComponent(keyword)}&language=ja&key=${API_KEY}`

  const res = await fetch(searchUrl)
  const data = await res.json()

const filtered = (data.results || [])
    .filter(p => !isChain(p.name))
    .filter(p => (p.user_ratings_total ?? 999) <= 50)
    .slice(0, 20)

  const results = await Promise.all(filtered.map(async (p) => {
    const details = await getDetails(p.place_id)
    const { pref, city } = parseAddress(details.address)
    return {
      会社名: p.name,
      担当者: '梁川 允孝',
      コール時間設定: '9~10時',
      ステータス: '新規',
      電話番号: details.phone,
      業界: '飲食店',
      職種: classifyGenre(p.name),
      都道府県: pref || coords.pref,
      ウェブサイトURL: details.website,
      市区町村: city,
      google評価: p.rating || '',
      口コミ数: p.user_ratings_total || '',
      取得日: today,
    }
  }))

  return NextResponse.json(results)
}