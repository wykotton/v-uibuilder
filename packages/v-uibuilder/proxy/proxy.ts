export const proxyConfig = [
  {
    context: "/api/rest",
    // "target": "http://192.168.11.101:9207/cmgr",
    target: "http://192.168.11.34:6093/cmgr",
    rewrite: (path) => path.replace(/^\/api\/rest/, ""),
  },
  {
    context: "/upload",
    target: "http://192.168.11.199:18080/file/download/emei_root/upload",
  },
  {
    context: "/auth",
    // "target": "http://192.168.11.101:9207/"
    target: "http://192.168.11.34:9216/",
  },
  {
    context: "/engine",
    // "target": "http://192.168.11.199:8899/",
    target: "http://192.168.11.29:8899/",
    rewrite: (path) => path.replace(/^\/engine/, ""),
  },
  {
    context: "/app/MapTiles",
    // "target": "http://192.168.11.102:6092/app/MapTiles/"
    target: "http://192.168.11.21:7070/",
  },
  {
    context: "/doDynamicProxy",
    target: "http://192.168.11.101:9207/cmgr/doDynamicProxy.rest/",
  },
  {
    context: "/gw",
    target: "http://192.168.11.90:6085/rest",
    // target: "http://192.168.11.199:6080/rest",
    rewrite: (path) => path.replace(/^\/gw/, ""),
    // "target": "http://192.168.21.92:6085/rest"
  },
  // {
  //   context: "/rest/sso",
  //   target: "http://192.168.11.199:6080/",
  //   // "target": "http://192.168.11.199:6080/"
  //   // "target": "http://192.168.21.69:6085/rest"
  // },
  {
    context: "/hdfs",
    // "target": "http://192.168.11.101:9999/hdfs"
    target: "http://192.168.11.34:9999/hdfs",
  },
  {
    context: "/getFile",
    // "target": "http://192.168.21.92:6085/"
    // "target": "http://192.168.11.102:6107/getFile"
    target: "http://192.168.11.34:6107/",
  },
  {
    context: "/app/resource/asset",
    // "target": "http://192.168.21.92:6085/Emei_plugin/assets"
    target: "http://192.168.11.199:18080/file/download/emei_root/Emei_plugin/assets",
  },
  {
    context: "/app/resource/icon",
    // "target": "http://192.168.21.92:6085/Emei_plugin/assets"
    target: "http://192.168.11.199:18080/file/download/emei_root/resource/icon",
  },
  {
    context: "/resource/asset",
    // "target": "http://192.168.21.92:6085/Emei_plugin/assets"
    target: "http://192.168.11.199:18080/file/download/emei_root/Emei_plugin/assets",
  },
  {
    context: "/libs",
    // "target": "http://192.168.21.92:6085/Emei_plugin"
    target: "http://192.168.11.199:18080/file/download/emei_root/Emei_plugin",
  },
  {
    context: "/fonts",
    target: "http://192.168.11.199:18080/file/download/emei_root/fonts",
  },
  {
    context: "/Images",
    // "target": "http://192.168.21.92:6085/Emei_plugin/Cesium/Widgets/Images"
    target: "http://192.168.11.199:18080/file/download/emei_root/Emei_plugin/Cesium/Widgets/Images",
  },
  {
    context: "/tyqxgl",
    // "target": "http://192.168.11.102:6093/tyqxgl"
    target: "http://192.168.11.34:9216/tyqxgl",
  },
  {
    context: "/local",
    // "target": "http://192.168.21.92:6085/rest",
    // "target": "http://192.168.11.199:6085/rest"
    target: "http://192.168.11.199:6080/rest",
  },
  {
    context: "/uibd",
    target: "http://192.168.11.146:6085/uibd/mailbox",
  },
  {
    context: "/file",
    target: "http://192.168.11.199:18080/file",
  },
  {
    context: "/preview",
    target: "http://192.168.11.199:18080/files",
  },
  {
    context: "/icon",
    target: "http://192.168.11.199:18080/file",
  },
  {
    context: "/oozie",
    // target: "http://192.168.11.21:11000/oozie",
    target: "http://192.168.11.23:11000/oozie",
  },
  {
    context: "/deepCharts",
    target: "http://192.168.11.199:6096/deepCharts",
    rewrite: (path) => path.replace(/^\/deepCharts/, ""),
  },
  {
    context: "/elfinder",
    target: "http://192.168.11.199:12307/elfinder/",
  },
  {
    context: "/zzcore",
    target: "http://192.168.1.192:9999/zzcore/",
  },
];

export const createDIProxy = (arr = []) => {
  return arr.reduce((a, { context, target, rewrite }) => {
    a[context] = { target, rewrite };

    return a;
  }, {});
};
