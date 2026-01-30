
import React, { useState, useMemo, useEffect } from 'react';
import { BP_CENTERS_DATA } from './constants';
import BPCard from './components/BPCard';
import { searchExternalBP } from './services/geminiService';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [externalResults, setExternalResults] = useState<{ ids: number[]; reason: string } | null>(null);

  // 로컬 필터링 로직 개선: 단어 포함 여부를 더 유연하게 체크
  const filteredCenters = useMemo(() => {
    const rawInput = searchTerm.trim().toLowerCase();
    if (!rawInput) return BP_CENTERS_DATA;

    const lowerTerm = rawInput.replace(/\s/g, '');
    
    // 1단계: 전체 문구 포함 검색 (이름 또는 주소)
    let results = BP_CENTERS_DATA.filter(center => {
      const combined = (center.name + center.address).toLowerCase().replace(/\s/g, '');
      return combined.includes(lowerTerm);
    });

    // 2단계: 결과가 없고 입력어가 2단어 이상일 때 토큰 검색
    if (results.length === 0) {
      const tokens = rawInput.split(/\s+/).filter(t => t.length > 0);
      if (tokens.length > 1) {
        results = BP_CENTERS_DATA.filter(center => {
          const combined = (center.name + center.address).toLowerCase();
          return tokens.every(token => combined.includes(token));
        });
      }
    }

    return results;
  }, [searchTerm]);

  // 검색어가 바뀔 때마다 외부 결과 초기화 (자동 검색은 아니므로)
  useEffect(() => {
    setExternalResults(null);
  }, [searchTerm]);

  const handleExternalSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setExternalResults(null);
    try {
      const result = await searchExternalBP(searchTerm, BP_CENTERS_DATA);
      setExternalResults(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setExternalResults(null);
  };

  const aiRecommendedCenters = useMemo(() => {
    if (!externalResults) return [];
    // ID 순서대로가 아니라 AI가 추천한 순서대로 정렬하여 반환
    return externalResults.ids
      .map(id => BP_CENTERS_DATA.find(c => c.id === id))
      .filter((c): c is typeof BP_CENTERS_DATA[0] => c !== undefined);
  }, [externalResults]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Header */}
      <header className="glass-header sticky top-0 z-50 border-b border-slate-200/50 shadow-sm transition-all">
        <div className="max-w-5xl mx-auto px-6 py-6 md:py-8 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center text-white rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">N-Telecom</h1>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em] mt-1">BP Center Finder</p>
            </div>
          </div>

          <div className="w-full max-w-2xl relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-14 pr-14 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/40 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-lg text-slate-800 placeholder-slate-300"
              placeholder="전국 시, 군, 구, 동을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && filteredCenters.length === 0 && handleExternalSearch()}
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-indigo-500 transition-colors"
              >
                <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Local Results Section */}
        {filteredCenters.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                <h2 className="text-xl font-bold text-slate-800">지점 리스트 ({filteredCenters.length})</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCenters.map((center, index) => (
                <BPCard key={center.id} center={center} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Not Found & AI Trigger */}
        {filteredCenters.length === 0 && !externalResults && (
          <div className="py-20 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200 text-slate-200 mb-10 border border-slate-50">
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">"{searchTerm}" 지역의 정확한 검색 결과가 없습니다</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-12 leading-relaxed font-medium">
              입력하신 <span className="text-indigo-600 font-bold">"{searchTerm}"</span>은 리스트에 없습니다.<br/>
              지능형 분석을 통해 해당 지역에서 가장 가까운 BP센터를 찾아드릴까요?
            </p>
            <button
              onClick={handleExternalSearch}
              disabled={isLoading}
              className={`group relative inline-flex items-center px-12 py-5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-2xl shadow-slate-300 transition-all active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  인근 지역 센터 분석 중...
                </>
              ) : (
                <>
                  인접 지역 지능형 검색 실행
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* AI Results Section */}
        {externalResults && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="bg-indigo-50/40 rounded-[2.5rem] border border-indigo-100/50 p-8 md:p-12 shadow-inner">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-600 text-[10px] font-black text-white rounded-full tracking-[0.2em] uppercase">AI Smart Analysis</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    "{searchTerm}" 지역 지능형 분석 결과
                  </h3>
                  <p className="mt-4 text-slate-600 font-medium leading-relaxed">
                    {externalResults.reason}
                  </p>
                </div>
              </div>

              {aiRecommendedCenters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiRecommendedCenters.map((center, index) => (
                    <BPCard key={center.id} center={center} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-indigo-200">
                  <p className="text-slate-400 font-bold italic">분석 결과 인접한 유효 지점을 찾지 못했습니다.</p>
                </div>
              )}
              
              <div className="mt-12 text-center">
                 <button 
                  onClick={handleClear}
                  className="text-slate-400 hover:text-indigo-600 text-sm font-bold transition-all hover:scale-105"
                 >
                   ← 다른 지역 검색하기
                 </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 py-16 px-6 bg-slate-900 text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">N</div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase">N-Telecom BP Service</span>
          </div>
          <p className="text-[11px] text-center opacity-40 leading-relaxed max-w-sm">
            본 서비스는 앤텔레콤 공식 지점 정보를 바탕으로 제공되며,<br/>
            지능형 위치 분석 기술을 활용하여 사용자에게 가장 인접한 센터를 매칭합니다.
          </p>
          <p className="text-[10px] font-medium opacity-20 mt-4 tracking-widest">© 2024 N-TELECOM ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
