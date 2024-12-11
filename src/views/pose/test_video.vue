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
      <source src="sofa/video/1.mp4" type="video/mp4" />
      <p>This browser does not support the video element.</p>
    </video>
    <canvas
      class="output_canvas"
      ref="output_canvas"
      :width="boxWidth"
      :height="boxHeight"
    >
    </canvas>
    <div>counter: {{ this.counter }} 个</div>
  </div>
</template>
<script>
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import detectCore from "@/api/har/detectCore.js";

export default {
  name: "PoseMonitorPage",
  data() {
    return {
      ctx: null,
      canvasElement: "",
      stage: "DOWN",
      counter: 0,
      boxHeight: 400,
      boxWidth: 500,
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

      // const camera = new Camera(this.inputVideo, {
      //   onFrame: async () => {
      //     await pose.send({ image: this.inputVideo });
      //   },
      //   width: this.boxWidth,
      //   height: this.boxHeight,
      // });
      // camera.start();

      const vid = document.getElementById("input_video");
      //leftVideo.currentTime = TIME_IN_SECONDS;
      // leftVideo.addEventListener("canplay", () => {
      //   let stream;
      //   const fps = 20;
      //   if (leftVideo.captureStream) {
      //     stream = leftVideo.captureStream(fps);
      //   } else if (leftVideo.mozCaptureStream) {
      //     stream = leftVideo.mozCaptureStream(fps);
      //   } else {
      //     console.error("Stream capture is not supported");
      //     stream = null;
      //   }
      //   // this.ctx.drawImage(
      //   //   leftVideo,
      //   //   0,
      //   //   0,
      //   //   this.canvasElement.width,
      //   //   this.canvasElement.height
      //   // );
      //   //let img = this.canvasElement.toDataURL("image/jpeg");
      //   pose.send({ image: this.$refs.input_video });
      // });

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

      if (
        detectCore.fullBodyInCamera(
          results,
          canvasElement.width,
          canvasElement.height
        )
      ) {
        //销毁timer
        if (this.timer != null) {
          this.timer = null;
        }
        //识别
        this.findBehavior(results.poseLandmarks);
      } else {
        if (this.timer == null) {
          this.timer = setInterval(() => {
            alert("请将全身置于摄像头框中!");
          }, 30 * 1000);
        }
      }
    },
    // 获取角度
    findAngle1(poseLandmarks, point = [11, 23, 25]) {
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
    findAngle2(poseLandmarks, point = [23, 25, 27]) {
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

      // 角度大于120度默认为躺下
      if (angle1 <= 55) {
        if (this.direction == 0) {
          this.counter += 0.5;
          this.direction = 1;
        }
      }
      // 角度小于60度默认为上身已经前倾
      if (angle1 > 120) {
        if (this.direction == 1) {
          this.counter += 0.5;
          this.direction = 0;
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
  width: 400px;
  height: 300px;
}
</style>
