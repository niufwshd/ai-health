import detectCore from "./detectCore";

const poseDefine = {};

// 1. 简单坐 - 冥想  男左女右原则 ，以女性为例
poseDefine.sit_think = (postmakers) => {
  //躯干和头部基本一条直线
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 160 || angle1 > 180) return false;

  //大臂和躯干的夹角基本为0度
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 > 40 || angle1 < 0) return false;

  //大腿和躯干的夹角基本为90度
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 < 80 || angle1 > 90) return false;

  //通过合十动作，长度计算代替角度计算
  if (
    !(
      Math.abs(postmakers[20].x - postmakers[19].x) <= 0.05 &&
      Math.abs(postmakers[20].y - postmakers[19].y) <= 0.05 &&
      Math.abs(postmakers[18].x - postmakers[17].x) <= 0.05 &&
      Math.abs(postmakers[18].y - postmakers[17].y) <= 0.05
    )
  ) {
    return false;
  }
  return true;
};

//山式
poseDefine.stand_straight = (postmakers) => {
  //躯干和头部基本一条直线

  debugger;
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 130 || angle1 > 180) return false;

  //大臂和躯干的夹角基本为0度
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 > 15 || angle1 < 0) return false;

  //大腿和躯干的夹角基本为180度
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 < 170 || angle1 > 180) return false;

  //小臂和大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[14],
    postmakers[16]
  );
  if (angle1 < 130 || angle1 > 180) return false;

  //小腿和大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 160 || angle1 > 180) return false;

  return true;
};

//站立前屈
poseDefine.stand_straight_bend = (postmakers) => {
  //躯干和头部基本一条直线
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 110 || angle1 > 180) return false;

  //大腿和躯干的夹角基本为0度
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 > 15 || angle1 < 0) return false;

  if (
    !(
      Math.abs(postmakers[16].x - postmakers[28].x) <= 0.02 &&
      Math.abs(postmakers[16].y - postmakers[28].y) <= 0.02
    )
  ) {
    return false;
  }
  //大臂和躯干的夹角基本为90度
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 > 100 || angle1 < 90) return false;

  //小腿和大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 160 || angle1 > 180) return false;

  return true;
};

//三角式
poseDefine.triangle = (postmakers) => {
  debugger;
  //躯干和头部基本一条直线
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 120 || angle1 > 180) return false;

  //右大臂和躯干大约90-到100度
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 90 || angle1 > 120) return false;

  //左大臂和躯干大约90-到100度
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[11],
    postmakers[23]
  );
  if (angle1 < 80 || angle1 > 120) return false;

  //左食指或者拇指和左脚跟的距离为0
  if (
    !(
      (Math.abs(postmakers[19].x - postmakers[29].x) <= 0.2 &&
        Math.abs(postmakers[19].y - postmakers[29].y) <= 0.2) ||
      (Math.abs(postmakers[17].x - postmakers[29].x) <= 0.2 &&
        Math.abs(postmakers[17].y - postmakers[29].y) <= 0.2)
    )
  ) {
    return false;
  }

  //小腿和大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 130 || angle1 > 180) return false;

  //右小腿和右大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[23],
    postmakers[25],
    postmakers[27]
  );
  if (angle1 < 150 || angle1 > 180) return false;

  //左小腿和左大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 > 180 || angle1 < 120) return false;
  return true;
};

poseDefine.warrior1 = (postmakers) => {
  //躯干和头部基本一条直线
  debugger;
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 120 || angle1 > 180) return false;

  //右大臂和躯干成直线
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 > 180 || angle1 < 150) return false;

  //左大臂和躯干成直线
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[11],
    postmakers[23]
  );
  if (angle1 > 180 || angle1 < 150) return false;

  //左小腿和大腿的夹角等于90
  angle1 = detectCore.countAngle(
    postmakers[23],
    postmakers[25],
    postmakers[27]
  );
  if (angle1 < 90 || angle1 > 120) return false;

  //左大腿和躯干的夹角大约95 到 105
  angle1 = detectCore.countAngle(
    postmakers[11],
    postmakers[23],
    postmakers[25]
  );
  if (angle1 < 95 || angle1 > 120) return false;

  //右大腿和右小腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 150 || angle1 > 185) return false;

  //右小臂和左大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[14],
    postmakers[16]
  );
  if (angle1 < 100 || angle1 > 180) return false;

  //左小臂和右大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[11],
    postmakers[13],
    postmakers[15]
  );
  if (angle1 < 100 || angle1 > 180) return false;
  return true;
};

poseDefine.warrior2 = (postmakers) => {
  debugger;
  //躯干和头部基本一条直线
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 120 || angle1 > 180) return false;

  //右大臂和躯干大约垂直
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 80 || angle1 > 110) return false;

  //右大臂和躯干大约垂直
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[11],
    postmakers[23]
  );
  if (angle1 < 80 || angle1 > 95) return false;

  //右小腿和大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 110 || angle1 > 180) return false;

  //右大腿和躯干的夹角等于90
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 < 85 || angle1 > 95) return false;

  //右大腿和右小腿的夹角等于90
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 85 || angle1 > 115) return false;

  //右小臂和右大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[14],
    postmakers[16]
  );
  if (angle1 < 150 || angle1 > 180) return false;

  //左小臂和左大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[11],
    postmakers[13],
    postmakers[15]
  );
  if (angle1 < 140 || angle1 > 180) return false;
  return true;
};

poseDefine.warrior3 = (postmakers) => {
  //躯干和头部基本一条直线
  debugger;
  // let angle1 = detectCore.countAngle(
  //   postmakers[8],
  //   postmakers[12],
  //   postmakers[24]
  // );
  // if (angle1 < 130 || angle1 > 180) return false; 误差太大

  //右大臂和躯干水平
  let angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 155 || angle1 > 180) return false;

  //左大臂和躯干水平
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[11],
    postmakers[23]
  );
  if (angle1 < 125 || angle1 > 180) return false;

  //右小腿和大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 150 || angle1 > 180) return false;

  //右大腿和躯干的夹角水平
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 < 140 || angle1 > 180) return false;

  //右大腿和右小腿水平
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 150 || angle1 > 180) return false;

  // //右小臂和右大臂的夹角为180
  // angle1 = detectCore.countAngle(
  //   postmakers[12],
  //   postmakers[14],
  //   postmakers[16]
  // );
  // if (angle1 < 170 || angle1 > 180) return false;

  //左小臂和左大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[11],
    postmakers[13],
    postmakers[15]
  );
  if (angle1 < 150 || angle1 > 180) return false;

  return true;
};

poseDefine.tilt_plated = (postmakers) => {
  debugger;
  //躯干和头部基本一条直线
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 100 || angle1 > 180) return false;

  //大腿和躯干的夹角基本为180度
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 < 160 || angle1 > 180) return false;

  //小腿和大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 160 || angle1 > 180) return false;

  //小臂和大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[14],
    postmakers[16]
  );
  if (angle1 < 130 || angle1 > 180) return false;

  //右手和右小臂的夹角为垂直，类似平板支撑
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[16],
    postmakers[18]
  );
  if (angle1 < 85 || angle1 > 105) return false;

  //左手和左小臂的夹角为垂直，类似平板支撑
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[15],
    postmakers[17]
  );
  if (angle1 < 85 || angle1 > 120) return false;
  return true;
};

poseDefine.down_dog = (postmakers) => {
  debugger;
  //躯干和头部基本一条直线
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 120 || angle1 > 180) return false;

  //右大臂和躯干水平
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 130 || angle1 > 180) return false;

  //左大臂和躯干水平
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[11],
    postmakers[23]
  );
  if (angle1 < 130 || angle1 > 180) return false;

  //大腿和躯干的夹角基本为90度
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 < 40 || angle1 > 95) return false;

  //小腿和大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 150 || angle1 > 180) return false;

  //小臂和大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[11],
    postmakers[13],
    postmakers[15]
  );
  if (angle1 < 110 || angle1 > 180) return false;

  return true;
};

poseDefine.up_dog = (postmakers) => {
  debugger;
  //躯干和头部基本一条直线
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 130 || angle1 > 180) return false;

  //右大臂和躯干水平
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 10 || angle1 > 180) return false;

  //左大臂和躯干水平
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[11],
    postmakers[23]
  );
  if (angle1 < 10 || angle1 > 180) return false;

  //大腿和躯干的夹角基本为225度
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 < 110 || angle1 > 230) return false;

  //小腿和大腿的夹角等于180
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 140 || angle1 > 180) return false;

  //小臂和大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[14],
    postmakers[16]
  );
  if (angle1 < 140 || angle1 > 180) return false;

  //右手和右小臂的夹角为垂直，类似平板支撑
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[16],
    postmakers[18]
  );
  if (angle1 < 85 || angle1 > 115) return false;

  //左手和左小臂的夹角为垂直，类似平板支撑
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[15],
    postmakers[17]
  );
  if (angle1 < 85 || angle1 > 125) return false;

  //右小腿和右脚面的夹角为180，类似
  angle1 = detectCore.countAngle(
    postmakers[26],
    postmakers[28],
    postmakers[32]
  );
  if (angle1 < 90) return false;

  //左小腿和左脚面的夹角为180，类似
  angle1 = detectCore.countAngle(
    postmakers[25],
    postmakers[27],
    postmakers[31]
  );
  if (angle1 < 90) return false;

  return true;
};

poseDefine.foot_bind = (postmakers) => {
  debugger;
  //躯干和头部基本一条直线
  let angle1 = detectCore.countAngle(
    postmakers[8],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 140 || angle1 > 180) return false;

  //右大臂和躯干贴合
  angle1 = detectCore.countAngle(
    postmakers[14],
    postmakers[12],
    postmakers[24]
  );
  if (angle1 < 20 || angle1 > 40) return false;

  //左大臂和躯干贴合
  angle1 = detectCore.countAngle(
    postmakers[13],
    postmakers[11],
    postmakers[23]
  );
  if (angle1 < 20 || angle1 > 40) return false;

  //大腿和躯干的夹角基本为90度
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[24],
    postmakers[26]
  );
  if (angle1 < 60 || angle1 > 90) return false;

  //小腿和大腿贴合0
  angle1 = detectCore.countAngle(
    postmakers[24],
    postmakers[26],
    postmakers[28]
  );
  if (angle1 < 20 || angle1 > 40) return false;

  //小臂和大臂的夹角为180
  angle1 = detectCore.countAngle(
    postmakers[12],
    postmakers[14],
    postmakers[16]
  );
  if (angle1 < 140 || angle1 > 180) return false;

  //左手和左脚,右手和右脚的距离为0
  if (
    !(
      (Math.abs(postmakers[19].x - postmakers[31].x) <= 0.2 &&
        Math.abs(postmakers[19].y - postmakers[31].y) <= 0.2) ||
      (Math.abs(postmakers[20].x - postmakers[32].x) <= 0.2 &&
        Math.abs(postmakers[20].y - postmakers[32].y) <= 0.2)
    )
  ) {
    return false;
  }

  return true;
};
export default poseDefine;
