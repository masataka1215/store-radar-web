import { NextResponse } from 'next/server'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

const GENRE_MAP = {
  '居酒屋':'居酒屋','和食': '和食', '日本料理': '日本料理', '寿司': '寿司',
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

const AREA_COORDS = {
  '大阪市北区': {lat:34.7024,lng:135.4937},
  '大阪市中央区': {lat:34.6863,lng:135.5090},
  '大阪市西区': {lat:34.6778,lng:135.4897},
  '大阪市浪速区': {lat:34.6627,lng:135.5020},
  '大阪市天王寺区': {lat:34.6488,lng:135.5163},
  '大阪市阿倍野区': {lat:34.6348,lng:135.5141},
  '大阪市住吉区': {lat:34.6097,lng:135.5082},
  '大阪市城東区': {lat:34.6927,lng:135.5397},
  '大阪市淀川区': {lat:34.7274,lng:135.4897},
  '大阪市東淀川区': {lat:34.7468,lng:135.5212},
  '大阪市福島区': {lat:34.6968,lng:135.4712},
  '大阪市都島区': {lat:34.7077,lng:135.5286},
  '京都市中京区': {lat:35.0116,lng:135.7681},
  '京都市下京区': {lat:34.9934,lng:135.7561},
  '京都市上京区': {lat:35.0297,lng:135.7517},
  '京都市東山区': {lat:34.9981,lng:135.7819},
  '京都市左京区': {lat:35.0397,lng:135.7819},
  '京都市伏見区': {lat:34.9348,lng:135.7681},
  '神戸市中央区': {lat:34.6913,lng:135.1956},
  '神戸市灘区': {lat:34.7168,lng:135.2341},
  '神戸市東灘区': {lat:34.7227,lng:135.2712},
  '尼崎市': {lat:34.7334,lng:135.4068},
  '西宮市': {lat:34.7368,lng:135.3412},
  '奈良市': {lat:34.6851,lng:135.8048},
  '橿原市': {lat:34.5063,lng:135.7948},
  '大津市': {lat:35.0045,lng:135.8686},
  '草津市': {lat:34.9836,lng:135.9597},
}

const KNOWN_CHAINS = [
  'スターバックス','マクドナルド','吉野家','すき家','松屋','サイゼリヤ',
  'ガスト','スシロー','くら寿司','はま寿司','天下一品','丸亀製麺',
  'ケンタッキー','モスバーガー','ドミノ','コメダ','ドトール','タリーズ',
  '餃子の王将','大阪王将','リンガーハット',
]

function isChain(name) {
  return KNOWN_CHAINS.some(c => name.includes(c))
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area')
  const genre = searchParams.get('genre')

  const coords = AREA_COORDS[area]
  if (!coords) return NextResponse.json({ error: 'エリアを選択してください' }, { status: 400 })

  const keyword = GENRE_MAP[genre] || '飲食店'

  const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.lat},${coords.lng}&radius=1000&keyword=${encodeURIComponent(keyword)}&language=ja&key=${API_KEY}`

  const res = await fetch(searchUrl)
  const data = await res.json()

  const results = (data.results || [])
    .filter(p => !isChain(p.name))
    .slice(0, 30)
    .map(p => ({
      会社名: p.name,
      google評価: p.rating || '',
      口コミ数: p.user_ratings_total || '',
      住所: p.vicinity || '',
      place_id: p.place_id,
      ステータス: '新規',
      担当者: '梁川 允孝',
      コール時間設定: '9~10時',
    }))

  return NextResponse.json(results)
}




