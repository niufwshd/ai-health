let detectCore = {};

//0:俯卧撑；1:仰卧起坐；2: 深蹲； 3:引体向上 4: 开合跳

const actionType = [0, 1, 2, 3, 4, 5];

detectCore.countAngle = (point1, point2, point3) => {
  // 1.先求 point1 和point2之间的距离
  let temp12 =
    Math.pow(point1.x - point2.x, 2) +
    Math.pow(point1.y - point2.y, 2) +
    Math.pow(point1.z - point2.z, 2);
  let point12 = Math.pow(temp12, 0.5);
  // console.log(point12)
  let temp23 =
    Math.pow(point3.x - point2.x, 2) +
    Math.pow(point3.y - point2.y, 2) +
    Math.pow(point3.z - point2.z, 2);
  let point23 = Math.pow(temp23, 0.5);
  // console.log(point23)

  // 2.求向量
  let vector12 = [
    point1.x - point2.x,
    point1.y - point2.y,
    point1.z - point2.z,
  ];
  let vector23 = [
    point3.x - point2.x,
    point3.y - point2.y,
    point3.z - point2.z,
  ];

  //3.求arccos
  let top =
    vector12[0] * vector23[0] +
    vector12[1] * vector23[1] +
    vector12[2] * vector23[2];
  let bottom = point12 * point23;

  let angle = (Math.acos(top / bottom) * 180) / Math.PI;
  // 4.最后求解
  //console.log(angle);
  return angle;
};

detectCore.smoothStep = (x, min, max) => {
  if (x <= min) return 0;
  if (x >= max) return 1;
  x = (x - min) / (max - min);
  return x;
};

detectCore.fullBodyInCamera = (result, width, height) => {
  //判断是不是全身，判断边缘区域的值是不是为0
  // 坐标转换
  let poseMarks = [];
  for (let i = 0; i < result.poseLandmarks.length; i++) {
    let point = [];

    point.push(result.poseLandmarks[i].x * result.image.width);
    point.push(result.poseLandmarks[i].y * result.image.height);

    if (
      point[0] > result.image.width ||
      point[1] > result.image.height ||
      point[0] < 0 ||
      point[1] < 0
    ) {
      return false;
    }
  }
  return true;
};

// 判断身体式面对、左侧对、右侧对、还是背对相机 或者式其他方向 分别用0，1.2,3 4表示
detectCore.bodyDerection = (postmakers) => {
  //根据胯部的23 24两个点进行主判断，以11，12两个点做辅助判断
  // if (postmakers[23].z > 0 && postmakers[24].z > 0) {
  //   if (postmakers[23].z - postmakers[24].z <= 0.001) {
  //     return 0;
  //   }
  // }
  if (postmakers[23].visibility > 0.99 && postmakers[24].visibility > 0.99) {
    if (postmakers[11].visibility > 0.99 && postmakers[12].visibility > 0.99)
      if (
        Math.abs(postmakers[23].z - postmakers[24].z) < 0.3 &&
        Math.abs(postmakers[11].z - postmakers[12].z) < 0.3
      ) {
        return 0;
      }
  }

  if (postmakers[23].z < 0 && postmakers[24].z > 0) {
    if (postmakers[23].z + postmakers[24].z <= 0.001) {
      return 1;
    }
  }

  if (postmakers[23].z > 0 && postmakers[24].z < 0) {
    if (postmakers[23].z + postmakers[24].z <= 0.001) {
      return 2;
    }
  }

  //辅助判断
  if (postmakers[23].z > 0 && postmakers[24].z > 0) {
    if (postmakers[23].z - postmakers[24].z <= 0.002) {
      if (
        postmakers[11].z > 0 &&
        postmakers[12].z > 0 &&
        postmakers[11].z - postmakers[12].z <= 0.002
      ) {
        return 0;
      }
    }
  }
  //辅助判断左侧对相机
  if (postmakers[23].z < 0 && postmakers[24].z > 0) {
    if (postmakers[23].z + postmakers[24].z <= 0.002) {
      if (
        postmakers[11].z < 0 &&
        postmakers[12].z > 0 &&
        postmakers[11].z + postmakers[12].z <= 0.002
      ) {
        return 1;
      }
    }
  }

  //辅助判断左侧对相机
  if (postmakers[23].z > 0 && postmakers[24].z < 0) {
    if (postmakers[23].z + postmakers[24].z <= 0.002) {
      if (
        postmakers[11].z > 0 &&
        postmakers[12].z < 0 &&
        postmakers[11].z + postmakers[12].z <= 0.002
      ) {
        return 2;
      }
    }
  }

  return 4;
};

export default detectCore;
