// 测试四课数据和天地盘标记的一致性
import { calculateDaLiuRen, DI_ZHI, zhiIndex } from './src/utils/daLiuRen.js';

// 测试当前日期
const date = new Date('2026-04-14');
const result = calculateDaLiuRen(date);

console.log('=== 四课数据 ===');
result.siKe.forEach((ke, index) => {
  console.log(`${index + 1}课: 上神=${ke.shang}, 下神=${ke.xia}, 关系=${ke.direction}`);
});

console.log('\n=== 天地盘四课标记 ===');
// 模拟天地盘的四课标记逻辑
function isSiKe(zhi, siKe) {
  return siKe.some(ke => ke.shang === zhi || ke.xia === zhi);
}

// 检查哪些地支被标记为四课位置
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const siKeZhi = diZhi.filter(zhi => isSiKe(zhi, result.siKe));
console.log('四课相关地支:', siKeZhi);

console.log('\n=== 验证结果 ===');
// 验证四课数据是否正确
const { dayGan, dayZhi, tianPan } = result;
const ganJiGong = result.siKe[0].xia; // 第一课下神是日干寄宫

console.log(`日干: ${dayGan}, 日支: ${dayZhi}, 寄宫: ${ganJiGong}`);
console.log(`第一课上神: ${tianPan[zhiIndex(result.siKe[0].xia)]} (应该是 ${result.siKe[0].shang})`);
console.log(`第二课上神: ${tianPan[zhiIndex(result.siKe[0].shang)]} (应该是 ${result.siKe[1].shang})`);
console.log(`第三课上神: ${tianPan[zhiIndex(result.siKe[2].xia)]} (应该是 ${result.siKe[2].shang})`);
console.log(`第四课上神: ${tianPan[zhiIndex(result.siKe[2].shang)]} (应该是 ${result.siKe[3].shang})`);