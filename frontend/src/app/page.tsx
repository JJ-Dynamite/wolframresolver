'use client';
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const solve = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ expression: expr }),
    });
    const data = await res.json();
    setResult(data.data);
    setLoading(false);
  };

  return (
    <>
      <Head><title>Wolfram Solver</title></Head>
      <main className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Wolfram Solver
          </h1>
          <p className="text-gray-400 text-xl mb-8">Instantly solve any math problem</p>
          <form onSubmit={solve} className="mb-8">
            <div className="flex gap-4">
              <input type="text" value={expr} onChange={e => setExpr(e.target.value)}
                placeholder="Enter math expression (e.g., x^2 + 2x + 1 = 0)"
                className="flex-1 px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white font-mono" />
              <button type="submit" disabled={loading} className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
                {loading ? '...' : 'Solve'}
              </button>
            </div>
          </form>
          {result && (
            <div className="bg-gray-800/50 rounded-xl p-6 text-left">
              <div className="mb-4">
                <span className="text-gray-400">Expression:</span>
                <span className="ml-2 text-white font-mono">{result.expression}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-400">Result:</span>
                <span className="ml-2 text-2xl text-orange-400 font-bold">{result.result}</span>
              </div>
              <div>
                <span className="text-gray-400">Steps:</span>
                <ul className="mt-2 space-y-1">
                  {result.steps?.map((s: string, i: number) => (
                    <li key={i} className="text-gray-300 ml-4">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
