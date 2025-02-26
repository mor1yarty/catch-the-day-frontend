'use client';
import { useState } from 'react';

export default function Home() {
  // useStateを使った値（状態）管理
  const [getMessage, setGetMessage] = useState('');
  const [selectedArea, setSelectedArea] = useState("白馬");
  const [selectedDate, setSelectedDate] = useState("今日");
  const [postResult, setPostResult] = useState('');

  // FastAPIのエンドポイント設定
  const handleGetRequest = async () => {
    if (getMessage) {
      setGetMessage('');
    } else {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/hello');
        const data = await response.json();
        setGetMessage(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handlePostRequest = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ area: selectedArea, date: selectedDate }),
      });
      const data = await response.json();
      setPostResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Spotifyのプレイリストを開くための関数
  const handleOpenSpotify = () => {
    // ここにSpotifyプレイリストのURLを入力してください
    window.open('https://open.spotify.com/playlist/4NjajWg5JjMUV2Vk9RwghM', '_blank');
  };

  // Apple Musicのプレイリストを開くための関数
  const handleOpenAppleMusic = () => {
    // ここにApple MusicプレイリストのURLを入力してください
    window.open('https://music.apple.com/jp/playlist/%E3%82%B2%E3%83%AC%E3%83%B3%E3%83%87%E3%81%A7%E8%81%9E%E3%81%8D%E3%81%9F%E3%81%84%E5%86%AC%E3%82%BD%E3%83%B3%E3%82%B0%E3%83%97%E3%83%AC%E3%82%A4%E3%83%AA%E3%82%B9%E3%83%88/pl.b9cd3fcb98874817813ca84ac20d4f0b', '_blank');
  };

  // ユーザーインターフェースの構築
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Catch THE DAY.</h1>
      <div className="space-y-8">
        {/* GETリクエスト */}
        <section>
          <p className="mt-2">最高のゲレンデに会いに行くためのアプリ</p>
          <br />
          <button
            onClick={handleGetRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            THE DAY とは
          </button>
          {getMessage && (
            <>
              <img src={process.env.NEXT_PUBLIC_API_ENDPOINT + '/static/the_day.jpg'} alt="Sample" width={300} />
              <p className="mt-2" style={{ whiteSpace: 'pre-line' }}>{getMessage.message}</p>
            </>
          )}
        </section>

        {/* POSTリクエスト */}
        <section>
          <h2 className="text-xl font-bold mb-4">コンディションを確認する</h2>
          <div className="flex gap-2">
            <select
              name="selectedLocation"
              value={selectedArea}
              className="border rounded px-5 py-1"
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="白馬">白馬</option>
              <option value="志賀高原">志賀高原</option>
              <option value="野沢温泉">野沢温泉</option>
              <option value="斑尾・妙高">斑尾・妙高</option>
              <option value="菅平">菅平</option>
              <option value="木曽">木曽</option>
            </select>
            {/* 日付選択 */}
            <select
              name="selectedDate"
              value={selectedDate}
              className="border rounded px-2 py-1"
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="今日">今日</option>
              <option value="明日">明日</option>
              <option value="明後日">明後日</option>
              <option value="3日後">3日後</option>
              <option value="4日後">4日後</option>
              <option value="5日後">5日後</option>
            </select>
            <button
              onClick={handlePostRequest}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              送信
            </button>
          </div>
          {postResult && (
            <>
              <br />
              <h4 className="text-xl font-bold mb-4">積雪情報</h4>
              <p className="mt-2">現在までの積雪量: {postResult.snow_amount.total}</p>
              <p className="mt-2">直近3日間の降雪量: {postResult.snow_amount.recent}</p>
              <br />
              <h4 className="text-xl font-bold mb-4">天気予報</h4>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">時刻</th>
                    <th className="border px-4 py-2">天気</th>
                    <th className="border px-4 py-2">気温</th>
                    <th className="border px-4 py-2">降雪量</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(postResult.weather_forcast).map(([time, forecast], index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{time}</td>
                      <td className="border px-4 py-2">
                        <img
                          src={`http://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                          alt={forecast.weather}
                          className="w-8 h-8"
                        />
                      </td>
                      <td className="border px-4 py-2">{forecast.temp}</td>
                      <td className="border px-4 py-2">{forecast.snow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>

        {/* 音楽プレイリストボタン（Spotify & Apple Music 横並び） */}
        <section>
          <h2 className="text-xl font-bold mb-4">ゲレンデまでの道のりを楽しむ</h2>
          <div className="flex gap-4">
            <button
              onClick={handleOpenSpotify}
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-2 rounded"
            >
              Spotify
            </button>
            <button
              onClick={handleOpenAppleMusic}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Apple Music
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}