export interface AudioPlayerDataType {
  src?: string;
  wavePeaks?: number[];
  duration?: number;
  status?: "uploading" | "done";
}
