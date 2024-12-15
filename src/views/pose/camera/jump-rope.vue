<template>
  <div class="container">
    <video
      id="input_video"
      ref="input_video"
      class="input_video"
      playsinline
      controls
      loop
      muted
    >
      <source src="sofa/video/demo.mp4" type="video/mp4" />
      <p>This browser does not support the video element.</p>
    </video>
    <canvas
      class="output_canvas"
      ref="output_canvas"
      :width="boxWidth"
      :height="boxHeight"
    >
      <video ref="input_video" class="input_video"></video
    ></canvas>
    <div>counter: {{ this.counter }} 个</div>
  </div>
</template>
<script>
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import detectCore from "@/api/har/detectCore.js";
import _ from "lodash";

export default {
  name: "PoseMonitorPage",
  data() {
    return {
      ctx: null,
      canvasElement: "",
      stage: "DOWN",
      counter: 0,
      boxHeight: 400,
      boxWidth: 240,
      direction: 0, // 仰卧起坐 0:躺下 1:为坐起
      timer: null,
      theta1: 0,
      hip_points: [],
      shoulder_points: [],
      thresholds: {
        buffer_time: 50, // 缓冲区时间
        dy_ratio: 0.5, // 移动幅度阈值
        up_ratio: 0.55, // 上升阈值
        down_ratio: 0.35, // 下降阈值
        flag_low: 150, // 翻转标志低点
        flag_high: 250, // 翻转标志高点
      },
      buffers: {
        center_y: [],
        center_y_up: [],
        center_y_down: [],
        center_y_flip: [],
        center_y_pref_flip: [],
      },
      cy_max: 100,
      cy_min: 100,
      prev_flip_flag: 0,
      flip_flag: 250,
    };
  },
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

      const vid = document.getElementById("input_video");
      if (vid.requestVideoFrameCallback) {
        // vid.play();
        const drawingLoop = (timestamp, frame) => {
          pose.send({ image: vid });
          vid.requestVideoFrameCallback(drawingLoop);
        };
        vid.requestVideoFrameCallback(drawingLoop);
      } else if (vid.seekToNextFrame) {
        const requestNextFrame = (callback) => {
          vid.addEventListener("seeked", () => callback(vid.currentTime), {
            once: true,
          });
          vid.seekToNextFrame();
        };
        //vid.play();
        // vid.pause();

        const drawingLoop = (timestamp) => {
          pose.send({ image: vid });
          requestNextFrame(drawingLoop);
        };
        requestNextFrame(drawingLoop);
      } else {
        console.error(
          "Your browser doesn't support any of these methods, we should fallback to timeupdate"
        );
      }
    },
    onResults(results) {
      if (!results.poseLandmarks) return;

      const canvasElement = this.canvasElement;
      const canvasCtx = this.ctx;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

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
      this.findBehavior(results);
      // } else {
      //   if (this.timer == null) {
      //     this.timer = setInterval(() => {
      //       alert("请将全身置于摄像头框中!");
      //     }, 30 * 1000);
      //   }
      // }
    },

    // 检测动作，获取次数
    findBehavior(result) {
      let arr = this.calculate_center_y(result.poseLandmarks);
      let cy = arr[0];
      let cy_shoulder_hip = arr[1];
      let cx = arr[2];
      this.buffers["center_y"].push(cy);
      this.cy_max = this.cy_max * 0.5 + 0.5 * _.max(this.buffers["center_y"]);
      this.buffers["center_y_up"].push(this.cy_max);
      this.cy_min = this.cy_min * 0.5 + 0.5 * _.min(this.buffers["center_y"]);
      this.buffers["center_y_down"].push(this.cy_min);

      this.prev_flip_flag = this.flip_flag;
      this.update_counters(cy, cy_shoulder_hip);
      this.buffers["center_y_flip"].push(this.flip_flag);
      this.buffers["center_y_pref_flip"].push(this.prev_flip_flag);

      if (this.prev_flip_flag < this.flip_flag) {
        this.counter += 1;
      }

      const canvasCtx = this.ctx;
      canvasCtx.save();
      canvasCtx.font = "26px Arial";
      canvasCtx.fillStyle = "red";
      canvasCtx.fillText("个数: " + this.counter.toString(), 20, 35);

      canvasCtx.fillStyle = "yellow";
      canvasCtx.beginPath();
      canvasCtx.arc(cx, cy, 5, 0, 2 * Math.PI);
      canvasCtx.stroke();
      canvasCtx.fill();
      canvasCtx.fillText("centroid", cx - 25, cy - 25);
      canvasCtx.restore();

      return this.counter;
    },
    // 弧度转角度
    radiansToDegrees(radians) {
      var pi = Math.PI;
      return radians / (pi / 180);
    },

    extract_hip_landmarks(poseLandmarks) {
      let that = this;
      this.hip_points = [poseLandmarks[23], poseLandmarks[24]];
      this.hip_points.forEach((element) => {
        element.x *= that.canvasElement.width;
        element.y *= that.canvasElement.height;
      });
    },
    extract_shoulder_landmarks(poseLandmarks) {
      let that = this;
      that.shoulder_points = [poseLandmarks[11], poseLandmarks[12]];
      that.shoulder_points.forEach((element) => {
        element.x *= that.canvasElement.width;
        element.y *= that.canvasElement.height;
      });
    },
    calculate_center_y(poseLandmarks) {
      this.extract_hip_landmarks(poseLandmarks);
      this.extract_shoulder_landmarks(poseLandmarks);
      let cy_hip = parseInt(
        _.mean([this.hip_points[0].y, this.hip_points[1].y])
      );
      let cy_shoulder = parseInt(
        _.mean([this.shoulder_points[0].y, this.shoulder_points[1].y])
      );
      let cx = _.mean([this.hip_points[0].x, this.hip_points[1].x]);
      return [cy_hip, cy_hip - cy_shoulder, cx];
    },
    update_counters(cy, cy_shoulder_hip) {
      let dy = this.cy_max - this.cy_min;
      if (dy > this.thresholds["dy_ratio"] * cy_shoulder_hip) {
        console.log("cymax:" + this.cy_max - this.thresholds["up_ratio"] * dy);
        console.log(
          "cymin:" + this.cy_min + this.thresholds["down_ratio"] * dy
        );
        if (
          cy > this.cy_max - this.thresholds["up_ratio"] * dy &&
          this.flip_flag == this.thresholds["flag_low"]
        ) {
          this.flip_flag = this.thresholds["flag_high"];
        } else if (
          cy < this.cy_min + this.thresholds["down_ratio"] * dy &&
          this.flip_flag == this.thresholds["flag_high"]
        ) {
          this.flip_flag = this.thresholds["flag_low"];
        }
      }
    },
  },
};
</script>
<style>
.input_video {
  width: 500px;
  height: 400px;
}
</style>
