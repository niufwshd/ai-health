// 迭代方式实现
export function padding(num, length) {
  for (var len = num.length; len < length; len = num.length) {
    num = "0" + num;
  }
  return num;
}
