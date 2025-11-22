import React from 'react';
import { MapPin, Phone, Mail, Globe, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    갈맷길: [
      { name: '갈맷길 소개', href: '#' },
      { name: '코스 안내', href: '#' },
      { name: '완주 인증', href: '#' },
      { name: '이용 가이드', href: '#' }
    ],
    서비스: [
      { name: '모바일 앱', href: '#' },
      { name: '지도 서비스', href: '#' },
      { name: '커뮤니티', href: '#' },
      { name: 'API', href: '#' }
    ],
    고객지원: [
      { name: '자주 묻는 질문', href: '#' },
      { name: '공지사항', href: '#' },
      { name: '문의하기', href: '#' },
      { name: '신고하기', href: '#' }
    ],
    정책: [
      { name: '이용약관', href: '#' },
      { name: '개인정보처리방침', href: '#' },
      { name: '쿠키 정책', href: '#' },
      { name: '접근성 정책', href: '#' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* 메인 푸터 콘텐츠 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* 브랜드 및 연락처 정보 */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl" style={{ color: '#E6007E' }}>부산</span>
              <span className="text-xl font-bold">갈맷길</span>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              부산의 아름다운 바다와 산, 문화를 걸으며 만나는 특별한 여행길. 
              갈맷길과 함께 부산의 진정한 아름다움을 발견하세요.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">부산광역시 중구 중앙대로 63</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">064-740-6000</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@galmaetgil.co.kr</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">www.galmaetgil.co.kr</span>
              </div>
            </div>

            {/* 소셜 미디어 */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 링크 섹션들 */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>



        {/* 하단 저작권 */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2025 갈맷길. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <span>사업자등록번호: 123-45-67890</span>
              <span>통신판매업신고: 제2024-부산중구-0001호</span>
              <span>대표: 김갈맷</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>갈맷길은 부산광역시가 조성한 도보여행길입니다.</p>
            <p>본 웹사이트는 데모 목적으로 제작되었으며 실제 갈맷길 공식 사이트가 아닙니다.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}