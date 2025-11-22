import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import busanCityImage from '../img/introduce.png';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Award,
  Heart,
  Compass,
  Mountain,
  Waves
} from 'lucide-react';

export function About() {
  const milestones = [
    { year: '2007', event: '갈맷길 1코스 개설', icon: '🌟' },
    { year: '2010', event: '10개 코스 완성', icon: '🏃‍♂️' },
    { year: '2015', event: '전체 26개 코스 완성', icon: '🎯' },
    { year: '2020', event: '디지털 인증 시스템 도입', icon: '📱' },
    { year: '2024', event: '누적 방문객 100만명 돌파', icon: '🎉' }
  ];

  const features = [
    {
      icon: <Compass className="w-8 h-8 text-blue-600" />,
      title: '다양한 경로',
      description: '해안길, 산길, 도심길, 문화길 등 부산의 모든 매력을 담은 다양한 코스'
    },
    {
      icon: <Mountain className="w-8 h-8 text-green-600" />,
      title: '자연 친화',
      description: '부산의 아름다운 자연을 보호하며 지속가능한 관광 문화 조성'
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: '힐링 여행',
      description: '느린 걸음으로 부산의 숨겨진 아름다움과 여유를 발견하는 치유의 시간'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: '소통의 장',
      description: '지역 주민과 관광객이 함께 만들어가는 따뜻한 커뮤니티'
    }
  ];

  const statistics = [
    { label: '전체 코스', value: '9', unit: '개', color: 'text-blue-600' },
    { label: '전체 구간', value: '23', unit: '개', color: 'text-green-600' },
    { label: '총 거리', value: '278.8', unit: 'km', color: 'text-purple-600' },
    { label: '인증 스탬프', value: '69', unit: '개소', color: 'text-orange-600' }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h1 className="mb-6 text-4xl font-bold">갈맷길 이야기</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            부산의 아름다운 바다와 산, 문화를 걸으며 만나는 특별한 여행길.
            갈맷길은 '길'을 뜻하는 '갈'과 바람을 뜻하는 '맷'이 합쳐진 이름으로,
            부산의 바닷바람길을 따라 걷는 행복한 여정을 의미합니다.
          </p>
        </div>

        {/* 메인 이미지 */}
        <div className="mb-16">
          <div className="relative rounded-2xl overflow-hidden">
            <ImageWithFallback
              src={busanCityImage}
              alt="부산 갈맷길 - 도시철도와 해안 풍경"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">부산의 숨은 보석을 찾아서</h3>
              <p className="text-lg opacity-90">느린 걸음으로 만나는 부산의 진정한 아름다움</p>
            </div>
          </div>
        </div>

        {/* 갈맷길의 의미 */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    갈맷길의 의미
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-blue-100 text-blue-700 mt-1">갈</Badge>
                      <div>
        				<p className="font-medium">순우리말로 '길'</p>
                        <p className="text-sm">우리말로 표현한 길의 순수한 의미</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-green-100 text-green-700 mt-1">맷</Badge>
                      <div>
                        <p className="font-medium">순우리말로 '바람'</p>
                        <p className="text-sm">부산의 상징인 바닷바람이 함께하는 길</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white/70 rounded-lg">
                    <p className="text-gray-800 font-medium">
                      "부산의 바닷바람길을 따라 걷는 행복한 여정"
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      자연과 문화, 역사가 함께하는 부산만의 특별한 트레킹 코스
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center relative overflow-hidden">
                    <Waves className="w-32 h-32 text-white opacity-20 absolute" />
                    <div className="text-center text-white z-10">
                      <div className="text-4xl mb-2">🌊</div>
                      <div className="text-lg font-bold">갈맷길</div>
                      <div className="text-sm opacity-90">Galmaet-gil</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 주요 특징 */}
        <div className="mb-16">
          <h2 className="text-center mb-12 text-2xl font-bold">갈맷길의 특별함</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 통계 */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center text-2xl font-bold">
                <Award className="w-6 h-6 mr-2" />
                갈맷길 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                      <span className="text-lg ml-1">{stat.unit}</span>
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 역사 */}
        <div className="mb-16">
          <h2 className="text-center mb-12 text-2xl font-bold">갈맷길의 역사</h2>
          <Card>
            <CardContent className="p-8">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">{milestone.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          {milestone.year}
                        </Badge>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{milestone.event}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 비전 */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">우리의 비전</h2>
              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  갈맷길은 단순한 트레킹 코스를 넘어, 부산의 자연과 문화를 보존하고 
                  지속가능한 관광 문화를 만들어가는 플랫폼입니다.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  모든 사람이 부산의 아름다움을 느끼고, 자연과 함께하는 건강한 라이프스타일을 
                  실천할 수 있도록 지원하겠습니다.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌱</div>
                    <h4 className="font-semibold mb-1">환경 보호</h4>
                    <p className="text-sm text-gray-600">자연을 보호하는 지속가능한 관광</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🤝</div>
                    <h4 className="font-semibold mb-1">지역 상생</h4>
                    <p className="text-sm text-gray-600">지역 경제 활성화와 문화 보존</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💚</div>
                    <h4 className="font-semibold mb-1">웰빙 라이프</h4>
                    <p className="text-sm text-gray-600">건강하고 행복한 삶의 추구</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 연락처 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">문의사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">주소</p>
                    <p className="text-gray-600">부산광역시 중구 중앙대로 63</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-blue-600">📞</span>
                  </div>
                  <div>
                    <p className="font-medium">전화번호</p>
                    <p className="text-gray-600">064-740-6000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-blue-600">✉️</span>
                  </div>
                  <div>
                    <p className="font-medium">이메일</p>
                    <p className="text-gray-600">info@galmaetgil.co.kr</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-blue-600">🕐</span>
                  </div>
                  <div>
                    <p className="font-medium">운영시간</p>
                    <p className="text-gray-600">평일 09:00 - 18:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-blue-600">🌐</span>
                  </div>
                  <div>
                    <p className="font-medium">홈페이지</p>
                    <p className="text-gray-600">www.galmaetgil.co.kr</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-blue-600">📱</span>
                  </div>
                  <div>
                    <p className="font-medium">모바일 앱</p>
                    <p className="text-gray-600">App Store, Google Play에서 다운로드</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}