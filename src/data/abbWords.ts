export const validABBWords = [
  '亮晶晶',
  '笑瞇瞇',
  '黃澄澄',
  '白茫茫',
  '黑漆漆',
  '灰濛濛',
  '鬧哄哄',
  '香噴噴',
  '暖洋洋',
  '冷冰冰',
  '懶洋洋',
  '慢吞吞',
  '胖乎乎',
  '滑溜溜',
  '靜悄悄',
  '亂糟糟',
  '水汪汪',
  '轟隆隆',
] as const;

export type ValidABBWord = (typeof validABBWords)[number];
