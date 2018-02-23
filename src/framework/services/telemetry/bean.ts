export interface SyncStat {
  syncedEventCount: Number;
  syncTime: Number;
  syncedFileSize: String;
}

export class Actor {
  static readonly TYPE_SYSTEM = "System";
  static readonly TYPE_USER = "User";
  id: string;
  type: string;
}

export class Audit {
  env: string;
  props: Array<string>;
  currentState: string;
  prevState: string;
  actorType: string;
}

export class Context {
  channel: string;
  pdata: ProducerData;
  env: string;
  sid: string;
  did: string;
  cdata: Array<CorrelationData>;
}

export class DeviceSpecification {
  os: string = "";
  make: string = "";
  id: string = "";
  mem: number = -1.0;
  idisk: number = -1.0;
  edisk: number = -1.0;
  scrn: number = -1.0;
  camera: string;
  cpu: string = "";
  sims: number = -1;
  cap: Array<String> = [];
}

export class End {
  env: string;
  type: string;
  mode: string;
  duration: number;
  pageId: string;
  objId: string;
  objType: string;
  objVer: string;
  rollup: Rollup;
  summaryList: Array<{ [index: string]: any }>;
}

export class Error {
  errorCode: string;
  errorType: string;
  stacktrace: string;
  pageId: string;
  env: string;
}

export class Etags {
  app: Array<string>;
  partner: Array<string>;
  dims: Array<string>;
}

export class ExData {
  type: string;
  data: string;

}

export class Feedback {
  env: string;
  rating: number;
  comments: string;
  id: string;
  version: string;
  type: string;
}

export class GameData {
  id: string;
  ver: string;
}

export class CorrelationData {
  id: string;
  type: string;
}

export class Rollup {
  l1: string;
  l2: string;
  l3: string;
  l4: string;
}

export class Visit {
  objid: string;
  objtype: string;
  objver: string;
  section: string;
  index: number;
}

export class Impression {
  type: string;
  pageId: string;
  subType: string;
  uri: string;
  objectId: string;
  correlationData: Array<CorrelationData>;
  objectType: string;
  objectVersion: string;
  rollup?: Rollup
}


export class Interact {
  env: string;
  type: string;
  subType: string;
  id: string;
  pageId: string;
  pos: Array<{ [index: string]: string }> = [];
  values: Array<{ [index: string]: any }> = [];
  valueMap: { [index: string]: any };
  correlationData: Array<CorrelationData>;
  objId: string;
  objType: string;
  objVer: string;
  rollup: Rollup;
}

export class Interrupt {
  env: string;
  type: string;
  pageId: string;
}

export class Log {
  env: string;
  type: string;
  level: string;
  message: string;
  pageId: string;
  params: Array<{ [index: string]: any }>;
  actorType: string;
}

export class ProducerData {
  id: string;
  pid: string;
  ver: string;
}

export class Search {
  type: string;
  query: string;
  filters: { [index: string]: any };
  sort: { [index: string]: any };
  correlationid: string;
  size: number;
}

export class Share {
  env: string;
  direction: string;
  dataType: string;
  items: Array<{ [index: string]: any }>;

}

export class Start {
  env: string;
  type: string;
  deviceSpecification: DeviceSpecification;
  loc: string;
  mode: string;
  duration: number;
  pageId: string;
  objId: string;
  objType: string;
  objVer: string;
  rollup: Rollup;
}

export class TelemetryObject {
  id: string;
  type: string;
  version: string;
  rollup: Rollup;
}
