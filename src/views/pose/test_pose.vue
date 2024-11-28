<template>
  <div class="container">
    <div>
      <el-button size="mini" type="primary" @click="sit_think()"
        >简单坐冥想</el-button
      >
      <el-button size="mini" type="primary" @click="stand_straight()"
        >山式</el-button
      >
      <el-button size="mini" type="primary" @click="stand_straight_bend()"
        >直立前屈</el-button
      >
      <el-button size="mini" type="primary" @click="triangular()"
        >三角式</el-button
      >
      <el-button size="mini" type="primary" @click="Warrior1()"
        >战士1式</el-button
      >
      <el-button size="mini" type="primary" @click="Warrior2()"
        >战士2式</el-button
      >
      <el-button size="mini" type="primary" @click="Warrior3()"
        >战士3式</el-button
      >
      <el-button size="mini" type="primary" @click="tilt_plated()"
        >斜板式</el-button
      >
      <el-button size="mini" type="primary" @click="down_dog()"
        >下犬式</el-button
      >
      <el-button size="mini" type="primary" @click="up_dog()">上犬式</el-button>
      <el-button size="mini" type="primary" @click="foot_bind()"
        >绑脚式</el-button
      >
    </div>
    <canvas
      class="output_canvas"
      ref="output_canvas"
      :width="boxWidth"
      :height="boxHeight"
      ><video ref="input_video" class="input_video"></video
    ></canvas>
  </div>
</template>
<script>
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import poseDefine from "@/api/har/poseDefine.js";
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
      boxWidth: 600,
      img_src: Image,
      pose: Pose,
      timer: null,
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
      this.pose = new Pose({
        locateFile: (file) => {
          return `/posemodel/${file}`; // 加载本地文件
          //return `https://fastly.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });
      this.pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      this.pose.onResults(this.onResults);

      // let img1 = new Image();
      // img1.src = this.img_src;
      // //drawing of the test image - img1
      // this.img_src = new Image();
      // this.img_src.src = "hpa/image/sit_think.jpg";
      // let that = this;
      // this.img_src.onload = function () {
      //   that.pose.send({ image: that.img_src });
      // };
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
    findBehavior(poseLandmarks) {
      if (
        this.img_src.src.indexOf("hpa/image/sit_think.jpg") >= 0 &&
        poseDefine.sit_think(poseLandmarks)
      ) {
        console.log("it is sit_think");
      } else if (
        this.img_src.src.indexOf("hpa/image/stand.jpg") >= 0 &&
        poseDefine.stand_straight(poseLandmarks)
      ) {
        debugger;
        console.log("it is stand straight");
      } else if (
        this.img_src.src.indexOf("hpa/image/stand_bench.jpg") >= 0 &&
        poseDefine.stand_straight_bend(poseLandmarks)
      ) {
      } else if (
        this.img_src.src.indexOf("hpa/image/titl_plate.jpg") >= 0 &&
        poseDefine.tilt_plated(poseLandmarks)
      ) {
      } else if (
        this.img_src.src.indexOf("hpa/image/triangle.jpg") >= 0 &&
        poseDefine.triangle(poseLandmarks)
      ) {
      } else if (
        this.img_src.src.indexOf("hpa/image/down_dog.jpg") >= 0 &&
        poseDefine.down_dog(poseLandmarks)
      ) {
      } else if (
        this.img_src.src.indexOf("hpa/image/top_dog.jpg") >= 0 &&
        poseDefine.up_dog(poseLandmarks)
      ) {
      } else if (
        this.img_src.src.indexOf("hpa/image/Warriar1.jpg") >= 0 &&
        poseDefine.warrior1(poseLandmarks)
      ) {
      } else if (
        this.img_src.src.indexOf("hpa/image/Warriar2.jpg") >= 0 &&
        poseDefine.warrior2(poseLandmarks)
      ) {
      } else if (
        this.img_src.src.indexOf("hpa/image/Warriar3.jpg") >= 0 &&
        poseDefine.warrior3(poseLandmarks)
      ) {
      } else if (
        this.img_src.src.indexOf("hpa/image/foot_bind.jpg") >= 0 &&
        poseDefine.foot_bind(poseLandmarks)
      ) {
      }
    },
    sit_think() {
      this.init();
      this.img_src = new Image();
      this.img_src.src = "hpa/image/sit_think.jpg";
      this.pose.send({ image: this.img_src });
    },
    stand_straight() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      that.img_src.src = "hpa/image/stand.jpg";
    },
    stand_straight_bend() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/stand_bench.jpg";
    },
    tilt_plated() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/titl_plate.jpg";
    },
    down_dog() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/down_dog.jpg";
    },
    up_dog() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/top_dog.jpg";
    },
    triangular() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/triangle.jpg";
    },
    Warrior1() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/Warriar1.jpg";
    },
    Warrior2() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/Warriar2.jpg";
    },
    Warrior3() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/Warriar3.jpg";
    },
    foot_bind() {
      this.init();
      this.img_src = new Image();
      let that = this;
      this.img_src.onload = function () {
        that.pose.send({ image: that.img_src });
      };
      this.img_src.src = "hpa/image/foot_bind.jpg";
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
