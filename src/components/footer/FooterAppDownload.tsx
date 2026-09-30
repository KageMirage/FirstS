'use client';

import React from 'react';

interface FooterAppDownloadProps {
  onDownloadApk: (e: React.MouseEvent) => void;
  onAppStoreClick: (storeName: string) => void;
}

export const FooterAppDownload: React.FC<FooterAppDownloadProps> = ({
  onDownloadApk,
  onAppStoreClick,
}) => {
  return (
    <div className="md:col-span-5 space-y-3 pr-0 md:pr-4">
      <h4 className="text-base font-normal text-white">
        Скачайте приложение
      </h4>
      <div className="text-xs text-neutral-300 leading-relaxed font-light space-y-0.5">
        <p>Не упустите возможность купить технику по самым выгодным ценам.</p>
        <p>Мы уже собрали более 200 компаний-партнеров!</p>
      </div>
      
      <div className="pt-1">
        <button
          type="button"
          onClick={onDownloadApk}
          className="text-xs text-neutral-300 underline underline-offset-2 hover:text-white transition-colors cursor-pointer"
        >
          APK-файл для Android
        </button>
      </div>

      {/* App Badges */}
      <div className="flex items-center gap-3 pt-3">
        {/* Google Play Badge */}
        <button
          type="button"
          onClick={() => onAppStoreClick('Google Play')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-900 border border-neutral-700/80 text-left transition-colors cursor-pointer min-w-[135px]"
        >
          <svg className="w-5 h-6 shrink-0" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0077 15.9687L0.127808 30.6588C0.128329 30.6618 0.129372 30.6644 0.129893 30.6674C0.555553 32.2624 2.01661 33.437 3.75067 33.437C4.44385 33.437 5.09466 33.2501 5.65277 32.9221L5.6971 32.8962L21.3207 23.9064L14.0077 15.9687Z" fill="#EA4335"/>
            <path d="M28.0501 13.4672L28.0368 13.4581L21.2917 9.55902L13.6925 16.3019L21.3181 23.9048L28.0276 20.0444C29.204 19.4112 30.0025 18.1746 30.0025 16.7487C30.0025 15.333 29.2147 14.1025 28.0501 13.4672Z" fill="#FBBC04"/>
            <path d="M0.127294 2.7777C0.0438569 3.0845 0 3.40586 0 3.73956V29.6974C0 30.0305 0.0433351 30.353 0.127815 30.6587L14.4854 16.3445L0.127294 2.7777Z" fill="#4285F4"/>
            <path d="M14.1101 16.7183L21.2943 9.55656L5.6884 0.534302C5.12115 0.195522 4.45914 3.8147e-06 3.7507 3.8147e-06C2.01665 3.8147e-06 0.55363 1.17663 0.127841 2.77368C0.127319 2.77524 0.127319 2.77628 0.127319 2.77771L14.1101 16.7183Z" fill="#34A853"/>
          </svg>
          <div className="leading-tight">
            <p className="text-[7px] uppercase tracking-wider text-neutral-400">СКАЧАЙТЕ</p>
            <p className="text-[11px] font-bold text-white">Google Play</p>
          </div>
        </button>

        {/* App Store Badge */}
        <button
          type="button"
          onClick={() => onAppStoreClick('App Store')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-900 border border-neutral-700/80 text-left transition-colors cursor-pointer min-w-[135px]"
        >
          <svg className="w-5 h-6 shrink-0" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.2365 15.0545C19.2647 12.8692 20.4383 10.8014 22.3 9.65679C21.1255 7.97937 19.1583 6.91584 17.1115 6.8518C14.9285 6.62267 12.8122 8.15808 11.6998 8.15808C10.5658 8.15808 8.85305 6.87455 7.00871 6.9125C4.60468 6.99017 2.36352 8.35697 1.19391 10.4587C-1.32029 14.8117 0.555077 21.209 2.96347 24.7276C4.16844 26.4506 5.5767 28.3752 7.41939 28.3069C9.22257 28.2321 9.89602 27.1571 12.0726 27.1571C14.229 27.1571 14.8608 28.3069 16.7409 28.2635C18.6758 28.2321 19.8949 26.5329 21.0576 24.7936C21.9233 23.566 22.5895 22.2091 23.0315 20.7734C20.7577 19.8117 19.2392 17.5233 19.2365 15.0545Z" fill="white"/>
            <path d="M15.6853 4.53781C16.7403 3.27133 17.2601 1.6435 17.1342 0C15.5224 0.169287 14.0336 0.939613 12.9644 2.15749C11.9188 3.34742 11.3747 4.94661 11.4775 6.5273C13.0899 6.5439 14.675 5.79446 15.6853 4.53781Z" fill="white"/>
          </svg>
          <div className="leading-tight">
            <p className="text-[7px] uppercase tracking-wider text-neutral-400">СКАЧАЙТЕ</p>
            <p className="text-[11px] font-bold text-white">App Store</p>
          </div>
        </button>
      </div>
    </div>
  );
};
