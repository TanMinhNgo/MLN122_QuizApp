import { generateQRCode } from '../utils/qrGenerator';

export const qrService = {
  async generate(pin: string): Promise<string> {
    return generateQRCode(pin);
  },
};
