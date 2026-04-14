// 测试四课角标标注逻辑
// 模拟四课数据
const siKe = [
  { shang: '寅', xia: '巳' }, // 1课
  { shang: '亥', xia: '寅' }, // 2课
  { shang: '卯', xia: '午' }, // 3课
  { shang: '子', xia: '卯' }  // 4课
];

console.log('=== 四课数据 ===');
siKe.forEach((ke, index) => {
  console.log(`${index + 1}课: 上神=${ke.shang}, 下神=${ke.xia}`);
});

// 模拟 getSiKeLabel 函数
function getSiKeLabel(zhi, siKe) {
  // 只为下神的格子添加角标，避免重复标注
  for (let i = 0; i < siKe.length; i++) {
    const ke = siKe[i];
    if (ke.xia === zhi) {
      return `${i + 1}课`;
    }
  }
  return '';
}

console.log('\n=== 四课角标测试 ===');
// 检查每个地支的课号
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
diZhi.forEach(zhi => {
  const label = getSiKeLabel(zhi, siKe);
  if (label) {
    console.log(`${zhi}: ${label}`);
  }
});

console.log('\n=== 验证是否有重复标注 ===');
// 检查是否有地支被标注多次
const labeledZhi = {};
let hasDuplicate = false;

diZhi.forEach(zhi => {
  const label = getSiKeLabel(zhi, siKe);
  if (label) {
    if (labeledZhi[zhi]) {
      console.log(`重复标注: ${zhi} 被标注为 ${labeledZhi[zhi]} 和 ${label}`);
      hasDuplicate = true;
    } else {
      labeledZhi[zhi] = label;
    }
  }
});

if (!hasDuplicate) {
  console.log('没有重复标注');
}