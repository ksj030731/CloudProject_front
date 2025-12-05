import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { QrCode, Camera, CheckCircle, X, Smartphone } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScanModalProps {
  isOpen: boolean;
  courseName: string;
  onClose: () => void;
  // 변경됨: 스캔된 텍스트(data)를 부모에게 전달해야 하므로 인자 추가
  onScan: (data: string) => void;
}

export function QRScanModal({ isOpen, courseName, onClose, onScan }: QRScanModalProps) {
  const [scanStatus, setScanStatus] = useState<'ready' | 'scanning' | 'success' | 'error'>('ready');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // 모달이 닫히거나 컴포넌트가 사라질 때 스캐너 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      cleanupScanner();
    };
  }, []);

  // scanStatus가 'scanning'으로 바뀌면 스캐너를 렌더링
  useEffect(() => {
    if (scanStatus === 'scanning') {
      // DOM이 그려질 시간을 아주 잠깐 확보
      const timer = setTimeout(() => {
        startScanner();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanStatus]);

  const cleanupScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(err => console.error("Scanner clear error", err));
      scannerRef.current = null;
    }
  };

  const startScanner = () => {
    // 이미 켜져있으면 리턴
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "reader", // 이 ID를 가진 div에 카메라 화면이 렌더링됩니다.
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        // 스캔 성공 시 호출
        handleScanSuccess(decodedText);
      },
      (errorMessage) => {
        // 스캔 대기/실패 중 (콘솔이 너무 지저분해지므로 로그는 생략하거나 주석 처리)
        // console.log(errorMessage);
      }
    );
  };

  const handleScanSuccess = (decodedText: string) => {
    cleanupScanner(); // 스캔 성공하면 카메라 끄기
    setScanStatus('success');
    
    // 성공 화면을 1.5초 정도 보여주고 데이터 전달 및 닫기
    setTimeout(() => {
      onScan(decodedText); // 부모 컴포넌트(App.tsx)로 스캔된 텍스트 전달
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    cleanupScanner();
    setScanStatus('ready');
    onClose();
  };

  const handleManualInput = () => {
    // 수동 인증 (데모/테스트용)
    // 실제로는 별도 입력 폼을 띄우거나 해야 하지만 여기선 테스트용 코드로 패스
    const manualCode = "MANUAL_PASS"; 
    handleScanSuccess(manualCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            완주 인증
          </DialogTitle>
          <DialogDescription>{courseName} 종점에 있는 QR 코드를 스캔하세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 1. 준비 상태 */}
          {scanStatus === 'ready' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <QrCode className="w-12 h-12 text-blue-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">QR 코드 스캔 준비</h3>
                <p className="text-gray-600 text-sm">
                  카메라 권한을 허용하고 QR 코드를 사각형 안에 맞춰주세요.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  인증 방법
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• 완주 지점의 QR 코드를 찾으세요</li>
                  <li>• 카메라로 QR 코드를 비추세요</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => setScanStatus('scanning')} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  스캔 시작
                </Button>
                <Button variant="outline" onClick={handleManualInput} className="flex-1">
                  수동 인증
                </Button>
              </div>
            </div>
          )}

          {/* 2. 스캔 중 (카메라 화면) */}
          {scanStatus === 'scanning' && (
            <div className="text-center space-y-4">
              {/* 라이브러리가 여기에 Video 요소를 삽입합니다 */}
              <div id="reader" className="w-full mx-auto overflow-hidden rounded-lg border-2 border-slate-200"></div>
              
              <div className="space-y-2">
                <p className="text-gray-600 text-sm animate-pulse">
                  QR 코드를 찾는 중...
                </p>
              </div>

              <Button variant="outline" onClick={handleClose} className="w-full">
                취소
              </Button>
            </div>
          )}

          {/* 3. 성공 화면 */}
          {scanStatus === 'success' && (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-600">인식 성공!</h3>
                <p className="text-gray-600">
                  완주 처리를 진행합니다...
                </p>
              </div>
              
              {/* 축하 애니메이션 효과 */}
              <div className="animate-bounce mt-4">
                <div className="text-2xl">🎉</div>
              </div>
            </div>
          )}

          {/* 4. 에러 화면 (필요시 사용) */}
          {scanStatus === 'error' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-600">오류 발생</h3>
              <Button onClick={() => setScanStatus('ready')}>다시 시도</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}