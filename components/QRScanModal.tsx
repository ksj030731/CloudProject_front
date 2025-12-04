import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { QrCode, Camera, CheckCircle, X, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface QRScanModalProps {
  isOpen: boolean;
  courseName: string;
  onClose: () => void;
  onScan: (data?: any) => void;
}

export function QRScanModal({ isOpen, courseName, onClose, onScan }: QRScanModalProps) {
  const [scanStatus, setScanStatus] = useState<'ready' | 'scanning' | 'success' | 'error'>('ready');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown logic removed for real scanning, but keeping state if needed for future
  }, [scanStatus, countdown]);

  const handleStartScan = () => {
    setScanStatus('scanning');
  };

  const handleClose = () => {
    setScanStatus('ready');
    onClose();
  };

  const handleManualInput = () => {
    setScanStatus('success');
    setTimeout(() => {
      onScan();
      toast.success('수동 인증이 완료되었습니다!');
      handleClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            완주 인증
          </DialogTitle>
          <DialogDescription>{courseName} 완주를 인증해주세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {scanStatus === 'ready' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <QrCode className="w-12 h-12 text-blue-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">QR 코드를 스캔하세요</h3>
                <p className="text-gray-600 text-sm">
                  코스 완주 지점에 있는 QR 코드를 스캔하여 완주를 인증하세요.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  인증 방법
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• 완주 지점의 인증대에서 QR 코드를 찾으세요</li>
                  <li>• 카메라로 QR 코드를 스캔하세요</li>
                  <li>• 자동으로 완주가 인증됩니다</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleStartScan} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  QR 스캔 시작
                </Button>
                <Button variant="outline" onClick={handleManualInput} className="flex-1">
                  수동 인증
                </Button>
              </div>
            </div>
          )}

          {scanStatus === 'scanning' && (
            <div className="text-center space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-black aspect-square">
                <QrReader
                  onResult={(result, error) => {
                    if (!!result) {
                      // @ts-ignore
                      const text = result?.text || result;
                      if (text) {
                        setScanStatus('success');
                        setTimeout(() => {
                          const scannedId = parseInt(text as string, 10);
                          onScan(!isNaN(scannedId) ? scannedId : text);
                          handleClose();
                        }, 1000);
                      }
                    }
                  }}
                  constraints={{ facingMode: 'environment' }}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 border-2 border-white/50 pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-blue-400 rounded-lg"></div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  QR 코드를 사각형 안에 맞춰주세요
                </p>
              </div>

              <Button variant="outline" onClick={handleClose}>
                취소
              </Button>
            </div>
          )}

          {scanStatus === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-600">인증 완료!</h3>
                <p className="text-gray-600">
                  {courseName} 완주를 축하합니다!
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">완주 시간:</span>
                    <span className="font-medium">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">인증 방법:</span>
                    <span className="font-medium">QR 스캔</span>
                  </div>
                </div>
              </div>

              <div className="animate-bounce">
                <div className="text-2xl">🎉</div>
              </div>
            </div>
          )}

          {scanStatus === 'error' && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-12 h-12 text-red-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-600">스캔 실패</h3>
                <p className="text-gray-600 text-sm">
                  QR 코드를 인식할 수 없습니다. 다시 시도해주세요.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">문제 해결 방법:</h4>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• QR 코드가 깨끗하고 선명한지 확인하세요</li>
                  <li>• 충분한 조명이 있는지 확인하세요</li>
                  <li>• 카메라를 QR 코드에 더 가까이 대보세요</li>
                  <li>• 수동 인증을 이용해보세요</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleStartScan} className="flex-1">
                  다시 시도
                </Button>
                <Button variant="outline" onClick={handleManualInput} className="flex-1">
                  수동 인증
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center space-y-1 border-t pt-4">
          <p>• 완주 인증은 지정된 인증 지점에서만 가능합니다</p>
          <p>• 인증 후에는 취소할 수 없으니 신중히 진행해주세요</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}