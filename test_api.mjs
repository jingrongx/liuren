import {Solar, Lunar} from 'lunar-javascript';

// Test with a date close to a known jieqi
const testDates = [
  new Date(2026, 0, 5),   // 小寒附近
  new Date(2026, 1, 4),   // 立春附近
  new Date(2026, 3, 5),   // 清明附近
  new Date(2026, 5, 21),  // 夏至附近
  new Date(2026, 11, 22), // 冬至附近
];

for (const d of testDates) {
  const s = Solar.fromDate(d);
  const l = Lunar.fromSolar(s);
  console.log(`--- ${s.toYmd()} ---`);
  
  // Try various methods
  try { console.log('  l.getJieQi():', JSON.stringify(l.getJieQi())); } catch(e) { console.log('  l.getJieQi() error:', e.message); }
  try { 
    const jq = l.getCurrentJieQi(); 
    console.log('  l.getCurrentJieQi():', jq ? jq.getName() : null); 
  } catch(e) { console.log('  l.getCurrentJieQi() error:', e.message); }
  try { console.log('  l.getJieQiJd():', l.getJieQiJd()); } catch(e) {}
  
  // List all methods containing relevant keywords
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(l));
  const relevant = methods.filter(m => 
    /jie|qi|Jie|Qi|season|Season|month|Month|solar|Solar/i.test(m) && m.length < 30
  );
  console.log('  Relevant methods:', relevant.join(', '));
  
  // Try getting current/prev/next jieqi
  try {
    const prev = l.getPrevJieQi?.();
    const next = l.getNextJieQi?.();
    console.log('  prev:', prev ? (typeof prev === 'object' ? prev.getName?.() : prev) : 'N/A');
    console.log('  next:', next ? (typeof next === 'object' ? next.getName?.() : next) : 'N/A');
  } catch(e) {
    console.log('  prev/next error:', e.message);
  }
  
  // Try Solar fromYmd
  try {
    const s2 = Solar.fromYmd(2026, 1, 5);
    const l2 = Lunar.fromSolar(s2);
    console.log('  Solar.fromYmd l2.getJieQi():', JSON.stringify(l2.getJieQi()));
  } catch(e) {}
}
