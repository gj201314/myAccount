// EXPORTS: numberToChinese

const DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const UNITS_INT = ['', '拾', '佰', '仟'];
const UNITS_BIG = ['', '万', '亿', '兆'];

/**
 * 将数字金额转换为人民币财务大写
 * 例如：1234.56 → 人民币壹仟贰佰叁拾肆元伍角陆分
 */
export function numberToChinese(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num < 0) return '';
  if (num === 0) return '人民币零元整';

  // 保留两位小数
  const fixed = num.toFixed(2);
  const [intPartStr, decPartStr] = fixed.split('.');

  // 整数部分
  let intResult = '';
  const intStr = intPartStr;
  const len = intStr.length;

  if (parseInt(intStr, 10) === 0) {
    intResult = '零';
  } else {
    // 按 4 位一组从右往左分组
    const groups: string[] = [];
    let remaining = intStr;
    while (remaining.length > 0) {
      const end = remaining.length;
      const start = Math.max(0, end - 4);
      groups.unshift(remaining.slice(start, end));
      remaining = remaining.slice(0, start);
    }

    const groupResults: string[] = [];
    for (let g = 0; g < groups.length; g++) {
      const group = groups[g];
      const bigUnitIndex = groups.length - 1 - g;
      let groupStr = '';
      let zeroFlag = false;
      let hasNonZero = false;

      for (let i = 0; i < group.length; i++) {
        const digit = parseInt(group[i], 10);
        const unitIndex = group.length - 1 - i;

        if (digit === 0) {
          zeroFlag = true;
        } else {
          if (zeroFlag && hasNonZero) {
            groupStr += '零';
          }
          groupStr += DIGITS[digit] + UNITS_INT[unitIndex];
          zeroFlag = false;
          hasNonZero = true;
        }
      }

      if (hasNonZero) {
        groupStr += UNITS_BIG[bigUnitIndex];
      } else if (groupResults.length > 0 && !groupResults[groupResults.length - 1].endsWith('零')) {
        // 全零组，如果前面有内容且不以零结尾，加一个零
        groupStr = '零';
      }

      groupResults.push(groupStr);
    }

    intResult = groupResults.join('');
    // 去掉末尾多余的零
    intResult = intResult.replace(/零+$/, '');
  }

  // 小数部分
  const jiao = parseInt(decPartStr[0], 10);
  const fen = parseInt(decPartStr[1], 10);

  let decResult = '';
  if (jiao === 0 && fen === 0) {
    decResult = '整';
  } else {
    if (jiao === 0) {
      decResult = '零' + DIGITS[fen] + '分';
    } else {
      decResult += DIGITS[jiao] + '角';
      if (fen !== 0) {
        decResult += DIGITS[fen] + '分';
      }
    }
  }

  return '人民币' + intResult + '元' + decResult;
}
