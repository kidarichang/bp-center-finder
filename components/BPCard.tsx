import { BP_CENTER } from "../constants";

type BPCardProps = {
  center: (typeof BP_CENTER)[number];
};

const BPCard = ({ center }: BPCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">{center.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{center.address}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
          BP
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs font-bold text-slate-500">대표번호</p>
          <a
            className="text-sm font-extrabold text-slate-900 hover:underline"
            href={`tel:${center.phone1.replaceAll("-", "")}`}
          >
            {center.phone1}
          </a>
        </div>

        {center.phone2 ? (
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-500">추가번호</p>
            <a
              className="text-sm font-extrabold text-slate-900 hover:underline"
              href={`tel:${center.phone2.replaceAll("-", "")}`}
            >
              {center.phone2}
            </a>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-500">추가번호</p>
            <p className="text-sm font-extrabold text-slate-400">없음</p>
          </div>
        )}

        {center.fax ? (
          <div className="bg-slate-50 rounded-xl p-3 col-span-2">
            <p className="text-xs font-bold text-slate-500">FAX</p>
            <p className="text-sm font-extrabold text-slate-900">{center.fax}</p>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-3 col-span-2">
            <p className="text-xs font-bold text-slate-500">FAX</p>
            <p className="text-sm font-extrabold text-slate-400">없음</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() =>
            window.open(
              `https://map.naver.com/v5/search/${encodeURIComponent(center.address)}`,
              "_blank"
            )
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          네이버 지도
        </button>
        <button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/${encodeURIComponent(center.address)}`,
              "_blank"
            )
          }
          className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          구글 지도
        </button>
      </div>
    </div>
  );
};

export default BPCard;
