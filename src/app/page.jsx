'use client';
import { useState } from 'react';

export default function Home() {
  // useStateを使った値（状態）管理
  const [getMessage, setGetMessage] = useState('');
  const [multiplyNumber, setMultiplyNumber] = useState('');
  const [multiplyResult, setMultiplyResult] = useState('');
  const [postMessage, setPostMessage] = useState('白馬');
  const [postResult, setPostResult] = useState('');

  // FastAPIのエンドポイント設定
  const handleGetRequest = async () => {
    if (getMessage) {
      setGetMessage('');
    } else {
      try {
        const response = await fetch('http://localhost:8000/api/hello');
        const data = await response.json();
        setGetMessage(data);
      } catch (error) {
        console.error('Error:', error);
      }
  }
  };

  const handleMultiplyRequest = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/multiply/${multiplyNumber}`);
      const data = await response.json();
      setMultiplyResult(data.doubled_value.toString());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePostRequest = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: postMessage }),
      });
      const data = await response.json();
      setPostResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ユーザーインターフェースの構築
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Catch THE DAY.</h1>
      <div className="space-y-8">
        {/* GETリクエスト */}
        <section>
          <h2 className="text-xl font-bold mb-4">最高のゲレンデに会いに行くためのアプリ</h2>
          <button
            onClick={handleGetRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            THE DAY. とは何か？
          </button>
          {getMessage && (
            <>
            <img src={`data:image/jpeg;base64,${getMessage.image}`} alt="Sample" width={300} />
            <p className="mt-2" style={{whiteSpace: 'pre-line'}}>{getMessage.message}</p>
            </>
          )}
        </section>

        {/* POSTリクエスト */}
        <section>
          <h2 className="text-xl font-bold mb-4">現在の積雪量と明日の天気予報を確認する</h2>
          <div className="flex gap-2">
            <select
              name="selectedFruit"
              defaultValue="orange"
              className="border rounded px-5 py-1"
              onChange={(e) => setPostMessage(e.target.value)}
            >
              <option value="白馬">白馬</option>
              <option value="志賀高原">志賀高原</option>
              <option value="野沢温泉">野沢温泉</option>
              <option value="斑尾・妙高">斑尾・妙高</option>
              <option value="菅平">菅平</option>
              <option value="木曽">木曽</option>
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
            <p className="mt-2">現在の積雪量: {postResult.snow_amount.total}</p>
            <p className="mt-2">直近3日間の降雪量: {postResult.snow_amount.recent}</p>
            <br />
            <h4 className="text-xl font-bold mb-4">明日の天気</h4>
            <p className="mt-2">{postResult.weather_forcast.weather}</p>
            <p className="mt-2">降水確率: {postResult.weather_forcast.rain_probability}</p>
            <p className="mt-2 font-bold mb-4">周辺都市の最高・最低気温</p>
            <p className="mt-2">
              {Object.entries(postResult.weather_forcast.temparture).map(([key, value], index) => (
                <span key={index}>
                  {key}: {value.max_temp} / {value.min_temp}<br />
                </span>
              ))}
            </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}