const hexList: string[] = [];
for (let i = 0; i <= 15; i++) {
  hexList[i] = i.toString(16);
}

export function buildUUID(): string {
  let uuid = '';
  for (let i = 1; i <= 36; i++) {
    if (i === 9 || i === 14 || i === 19 || i === 24) {
      uuid += '-';
    } else if (i === 15) {
      uuid += 4;
    } else if (i === 20) {
      uuid += hexList[(Math.random() * 4) | 8];
    } else {
      uuid += hexList[(Math.random() * 16) | 0];
    }
  }
  return uuid.replace(/-/g, '');
}

let unique = 0;
export function buildShortUUID(prefix = ''): string {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  unique++;
  return prefix + '_' + random + unique + String(time);
}

/**
 * 生成hashid
 * @param {*} hashLength
 */
export function createHash(hashLength = 12) {
  // 默认长度 24
  return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join("");
}

/**
 * 生成onlyid
 * @param {*} hashLength
 * @param {*} key
 */
export function createHashId(hashLength = 12, key = `drag-`) {
  let probeId = `${key}${createHash(hashLength)}`;
  while (document.querySelectorAll(`#${probeId}`).length) {
    // dom存在即重新构成
    probeId = `${key}${createHash(hashLength)}`;
  }
  return probeId;
}
