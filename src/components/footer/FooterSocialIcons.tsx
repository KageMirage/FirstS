'use client';

import React, { useEffect, useState } from 'react';
import { apiService } from '../../api/endpoints';
import { SocialNetwork } from '../../types/api';

const DEFAULT_FALLBACK_NETWORKS: SocialNetwork[] = [
  {
    id: 1,
    desctop_name: 'Instagram',
    mobile_name: 'Instagram',
    link: 'https://www.instagram.com',
    icon: '',
    is_published: true,
    type: 'instagram',
  },
  {
    id: 2,
    desctop_name: 'Tik Tok',
    mobile_name: 'TikTok',
    link: 'https://tiktok.com',
    icon: '',
    is_published: true,
    type: 'tiktok',
  },
];

export const FooterSocialIcons: React.FC = () => {
  const [socials, setSocials] = useState<SocialNetwork[]>(DEFAULT_FALLBACK_NETWORKS);

  useEffect(() => {
    let isSubscribed = true;
    apiService
      .getSocialNetworks()
      .then((data) => {
        if (isSubscribed && Array.isArray(data) && data.length > 0) {
          const published = data.filter((item) => item.is_published !== false);
          if (published.length > 0) {
            setSocials(published);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load social networks:', err.message);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-4">
      {socials.map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="text-white hover:opacity-80 transition-opacity flex items-center justify-center w-6 h-6"
          title={item.desctop_name || item.mobile_name}
          aria-label={item.desctop_name || item.mobile_name}
        >
          {item.icon ? (
            <img
              src={item.icon}
              alt={item.desctop_name}
              className="w-5 h-5 object-contain invert brightness-0 hover:brightness-100"
              onError={(e) => {
                // If remote SVG fails, fallback to simple text or dot
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : item.type === 'instagram' ? (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
            </svg>
          ) : item.type === 'tiktok' ? (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.25-.26.47-.54.67-.84V11.2a8.16 8.16 0 0 0 5.06 1.76v-3.5a4.78 4.78 0 0 1-3.45-1.27z" />
            </svg>
          ) : (
            <span className="text-xs font-bold text-white hover:text-[#1976D2]">
              {item.desctop_name?.charAt(0) || '•'}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};
