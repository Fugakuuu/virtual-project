export type AssetType = "IMAGE" | "AUDIO" | "VIDEO" | "GIF";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  path: string;
  scale: number;
  duration: number | null;
  volume: number;
  exitAnimation: string;
  chromaKey: boolean;
  chromaColor: string;
}
