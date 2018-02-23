export class ImportContentProgress {
  currentCount: number;
  totalCount: number;
}


export class DownloadProgress {
  downloadId: number;
  identifier: string;
  downloadProgress: number = -1;
  status: number = -1;
}

