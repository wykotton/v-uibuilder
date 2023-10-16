import { createLogger, RingBuffer } from "bunyan";
import { getConfigJson, IConfig } from "@/utils/utils";
const { logConfig } = getConfigJson("./conf/config.json") as IConfig;

const logs = function () {
  let logObj = null;
  this.info = function (...param) {
    if (!logObj) {
      logObj = createLogger(logConfig);
      logObj.info(...param);
    } else {
      logObj.info(...param);
    }
  };
};

/**
 * 读取缓冲区内存中的日志
 */
const ringbuffer = new RingBuffer({ limit: 100 });
const ringbufferLog = createLogger({
  name: "UI-builder",
  streams: [
    {
      level: "info",
      stream: process.stdout
    },
    {
      level: "debug",
      stream: process.stdout
    },
    {
      level: "trace",
      type: "raw", // use 'raw' to get raw log record objects
      stream: ringbuffer
    }
  ]
});

/**
 * 日志类型
 */
const LogTypeEnum = {
  LOGIN: `login`,
  LOG_OUT: `logout`,
  PROJECT: `project`,
  TRAINING: `training`,
  WORK_FLOW: `workflow`,
  TRAIN: `train`,
  SAMPLE: `sample`
};

const log = new logs();

export { log, ringbuffer, ringbufferLog, LogTypeEnum };
