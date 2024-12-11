// 获取assets静态资源
let getAssetsFile = (url) => {
  let hrf = new URL("/" + url, import.meta.url).href;
  return hrf;
};
export default getAssetsFile;
