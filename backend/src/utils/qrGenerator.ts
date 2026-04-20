import QRCode from 'qrcode';
import { ENV } from '../config/env';

/**
 * Tạo QR code dạng base64 PNG cho mã PIN.
 * Nội dung QR: URL tham gia phòng chơi.
 */
export const generateQRCode = async (pin: string): Promise<string> => {
  const joinUrl = `${ENV.FRONTEND_URL}/tham-gia?pin=${pin}`;

  const base64 = await QRCode.toDataURL(joinUrl, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  return base64;
};
