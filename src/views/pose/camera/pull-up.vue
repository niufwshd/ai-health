<template>
  <div class="container">
    <canvas
      class="output_canvas"
      ref="output_canvas"
      :width="boxWidth"
      :height="boxHeight"
      ><video ref="input_video" class="input_video"></video
    ></canvas>
    <div>counter: {{ this.counter }} 个</div>
  </div>
</template>
<script>
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import detectCore from "@/api/har/detectCore";

export default {
  name: "PoseMonitorPage",
  data() {
    return {
      ctx: null,
      canvasElement: "",
      stage: "DOWN",
      counter: 0,
      boxHeight: 800,
      boxWidth: 1000,
      direction: 0, // 仰卧起坐 0:躺下 1:为坐起
      timer: null,
    };
  },
  // props: {
  //   boxWidth: {
  //     type: Number,
  //     require: true,
  //   },
  //   boxHeight: {
  //     type: Number,
  //     require: true,
  //   },
  // },
  computed: {
    inputVideo() {
      return this.$refs.input_video;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.canvasElement = document.getElementsByClassName("output_canvas")[0];
      this.ctx = this.canvasElement.getContext("2d");
      this.init();
    });
  },
  beforeDestroy() {
    this.timer = null;
    this.ctx = null;
    this.canvasElement = null;
  },
  methods: {
    init() {
      const pose = new Pose({
        locateFile: (file) => {
          return `/posemodel/${file}`; // 加载本地文件
          //return `https://fastly.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      pose.onResults(this.onResults);

      const camera = new Camera(this.inputVideo, {
        onFrame: async () => {
          await pose.send({ image: this.inputVideo });
        },
        width: this.boxWidth,
        height: this.boxHeight,
      });
      camera.start();
    },
    onResults(results) {
      if (!results.poseLandmarks) return;

      const canvasElement = this.canvasElement;
      const canvasCtx = this.ctx;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // canvasCtx.drawImage(results.poseLandmarks, 0, 0,
      //                     canvasElement.width, canvasElement.height);

      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = "source-in";
      canvasCtx.fillStyle = "#00FF00";
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = "destination-atop";
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      canvasCtx.globalCompositeOperation = "source-over";
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
      canvasCtx.restore();

      // if (
      //   detectCore.fullBodyInCamera(
      //     results,
      //     canvasElement.width,
      //     canvasElement.height
      //   )
      // ) {
      //   //销毁timer
      //   if (this.timer != null) {
      //     this.timer = null;
      //   }
      //识别
      this.findBehavior(results.poseLandmarks);
      // } else {
      //   if (this.timer == null) {
      //     this.timer = setInterval(() => {
      //       alert("请将全身置于摄像头框中!");
      //     }, 30 * 1000);
      //   }
      // }
    }, // 引体向上对应到mediapipe的部位编号就是16，14，12（左臂），15，13，11（右臂）
    findAngle1(poseLandmarks, point = [12, 14, 16]) {
      // 获取人体姿势的3个点
      const p1 = poseLandmarks[point[0]];
      const p2 = poseLandmarks[point[1]];
      const p3 = poseLandmarks[point[2]];

      // 获取3个点p1-p2-p3之间的角度，以p2为角的角度值，0-180度之间
      let angle = this.radiansToDegrees(
        Math.atan2(p1.y - p2.y, p1.x - p2.x) -
          Math.atan2(p3.y - p2.y, p3.x - p2.x)
      );
      angle = Number(angle);
      if (angle > 180) {
        angle = 360 - angle;
      }
      if (angle < 0) {
        angle += 30;
      }
      return angle;
    },
    findAngle2(poseLandmarks, point = [11, 13, 15]) {
      // 获取人体姿势的3个点
      const p1 = poseLandmarks[point[0]];
      const p2 = poseLandmarks[point[1]];
      const p3 = poseLandmarks[point[2]];

      // 获取3个点p1-p2-p3之间的角度，以p2为角的角度值，0-180度之间
      let angle = this.radiansToDegrees(
        Math.atan2(p1.y - p2.y, p1.x - p2.x) -
          Math.atan2(p3.y - p2.y, p3.x - p2.x)
      );
      angle = Number(angle);
      if (angle > 180) {
        angle = 360 - angle;
      }
      if (angle < 0) {
        angle += 30;
      }
      return angle;
    },
    // 检测动作，获取次数
    findBehavior(poseLandmarks) {
      const angle1 = this.findAngle1(poseLandmarks);
      const angle2 = this.findAngle2(poseLandmarks);
      console.log(angle1 + "," + angle2);
      let right_per = detectCore.smoothStep(angle1, 40, 140);
      let left_per = detectCore.smoothStep(angle2, 40, 140);
      console.log(right_per + "," + left_per);
      // 检测个数，我这里设置的是从20%做到80%，就认为是一个
      if (right_per >= 0.6) {
        if (this.dir == 0) {
          this.counter += 0.5;
          this.direction = 1;
        }
      }
      if (right_per <= 0.4) {
        if (this.direction == 1) {
          this.counter += 0.5;
          this.drawImage = 0;
        }
      }

      const canvasCtx = this.ctx;
      canvasCtx.save();
      canvasCtx.font = "26px Arial";
      canvasCtx.fillStyle = "red";
      canvasCtx.fillText("个数: " + this.counter.toString(), 20, 35);
      canvasCtx.restore();

      return this.counter;
    },
    // 弧度转角度
    radiansToDegrees(radians) {
      var pi = Math.PI;
      return radians / (pi / 180);
    },
  },
};
</script>
<style>
.input_video {
  width: 100%;
  height: 800px;
}
</style>
