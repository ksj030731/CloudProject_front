import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import aboutImage1 from '../img/introduce.png';
import aboutImage2 from '../img/introduce2.png';
import aboutImage3 from '../img/introduce3.png';
import aboutImage4 from '../img/introduce_map.png';
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
          </p>
        </div>

        {/* 메인 이미지 */}
        <div className="mb-16">
          <div className="relative rounded-2xl overflow-hidden">
            <ImageWithFallback
              src={aboutImage1}
              alt="부산 갈맷길 - 도시철도와 해안 풍경"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 갈맷길의 의미 */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-gray-50 to-indigo-50 border-gray-100">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    갈맷길의 의미
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-blue-100 text-blue-700 mt-1">🌊</Badge>
                      <div>
        				<p className="font-medium">부산갈맷길 이란?</p>
                        <p className="text-sm">부산 지역 전역에 조성된 부산의 그린웨이를 지칭 ‘갈맷길’은 부산광역시 시민 공모를 통해 2009년 명칭으로 선정되었다.<br/>
                            부산의 새인 ‘갈매기’와 ‘길’을 합성한 것으로 ‘갈매’는 순수 우리말로 ‘깊은 바다’라는 뜻 또한 가지고 있다.</p>
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
                <div className="relative md:col-span-2">
                    <div className="w-auto h-64 mx-auto overflow-hidden shadow-md border-1 border-white relative">
                        <ImageWithFallback
                            src={aboutImage2}
                            alt={"갈맷길을 상징하는 아름다운 풍경"}
                            className="w-full h-full object-cover"/>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* 갈맷길 조성 개요*/}
          <div className="mb-16">
              <h2 className="text-center mb-6 text-3xl font-bold">갈맷길 조성 개요</h2>
                  <Card className="bg-gradient-to-br from-gray-150 border-gray-150">
                      <CardContent className="p-8">
                          <div className="grid md:grid-cols-2 gap-8 items-center">
                              <div className="md:col-span-1">
                                  <div className="w-auto h-64 mx-auto overflow-hidden shadow-md border-1 border-white relative">
                                      <ImageWithFallback
                                          src={aboutImage3}
                                          alt={"갈맷길을 상징하는 아름다운 풍경"}
                                          className="w-full h-full object-cover"/>
                                  </div>
                              </div>

                              <div className="relative md:col-span-1">
                                  <div className="mt-6 p-4 text-right bg-gray-100 border-gray-100 rounded-lg">
                                      <p className="text-lg font-semibold">그린웨이</p>
                                      <p className="text-base mb-6">부산시는 2009년부터 집중적으로 걷기 좋은 탐방로 일명 그린웨이를 조성하였으며<br/>
                                          기존 산책로 및 등산로를 활용했으나, 데크을 깔거나 새로이 조성한 길도 있었다</p>
                                  </div>

                                  <div className="mt-6 p-4 text-right bg-gray-100 border-gray-100 rounded-lg">
                                      <p className="text-lg font-semibold">노선</p>
                                      <p className="text-base">지형에 맞게 해안길, 숲길, 강변길, 도심길로구분(총 9코스). 사포지향(산, 바다, 강, 온천)<br/>
                                          매력을 만끽할 수 있다. 2009년에서 2012년까지 갈맷길 20개 노선 263.8km가<br/>
                                          정해졌고, 노선과 구간을 재정비하여 21개 구간 278.8km로 확대하여 운영하였고<br/>
                                          1월부터는 기존 장거리 구간을 분할하는 등 이용객들이 더욱 쉽게 걸을 수 있도록<br/>
                                          노선을 일부 개선하여 9코스 23개 노선으로 운영하고 있다</p>
                                  </div>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
          </div>

          {/*9개 코스 간단 설명*/}
          <div className="container mx-auto px-4">
              {/* 헤더 */}
              <div className="text-center mb-6">
                  <h1 className="mb-4 text-3xl font-bold">갈맷길 9개의 코스</h1>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      갈맷길은 사포지향(바다, 강, 산, 온천)인 부산의 지역적 특성을 담고 있어 바닷가를 걷다보면 어느덧 산속이고, 산을 벗어나면 강이 있고,
                      몸이 노곤하면 온천이 반겨주는 부산에만 있는 길이다.
                      9개 코스 23개 구간으로 나누어지며 총 연장은 278.8㎞이다. 9개 코스를 모두 완보하려면 어른 걸음으로 약 91시간이 걸린다.
                  </p>
              </div>

              {/* 소개 지도 */}
              <div className="mb-16">
                  <div className="relative rounded-2xl overflow-hidden">
                      <ImageWithFallback
                          src={aboutImage4}
                          alt="갈맷길 전체 코스 지도"
                          className="w-full h-full object-cover"
                      />
                  </div>
              </div>
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
                    <p className="text-gray-600">부산광역시 부산진구 엄광로 176 동의대학교 정보공학관(건물번호 23번) 9층</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-blue-600">📞</span>
                  </div>
                  <div>
                    <p className="font-medium">전화번호</p>
                    <p className="text-gray-600">010-2716-0371</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-blue-600">✉️</span>
                  </div>
                  <div>
                    <p className="font-medium">이메일</p>
                    <p className="text-gray-600">20223058@office.deu.ac.kr</p>
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
                    <p className="text-gray-600">my-cloud-project2222.duckdns.org</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-blue-600">📱</span>
                  </div>
                  <div>
                    <p className="font-medium">모바일 앱</p>
                    <p className="text-gray-600">출시 준비 중</p>
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