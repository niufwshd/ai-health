<!-- <template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="container">
      <video ref="inputvideo" class="input_video" />
      <div class="canvas-container">
        <canvas
          ref="outputcanvas"
          class="output_canvas"
          width="1280px"
          height="720px"
        />
      </div>
      <div class="loading">
        <div class="spinner" />
        <div class="message">Loading</div>
      </div>
      <a class="abs logo" href="http://www.mediapipe.dev" target="_blank">
        <div style="display: flex; align-items: center; bottom: 0; right: 10px">
          <img class="logo" src="" alt="图片" style="height: 50px" />
          <span class="title">MediaPipe</span>
        </div>
      </a>
      <div class="shoutout">
        <div>
          <a href="https://solutions.mediapipe.dev/holistic" target="_blank">
            Click here for more info
          </a>
        </div>
      </div>
    </div>
    <div ref="controlpanel" class="control-panel" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DeviceDetector from "device-detector-js";
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      activeEffect: "mask",
      canvasCtx: {},
      drawingUtils: {},
      videoElement: {},
      canvasElement: {},
      controlsElement: {},
      fpsControl: {},
      controls: {},
      mpHolistic: {},
    };
  },
  mounted() {
    console.log(this.window);
    let that = this;
    that.$nextTick(() => {
      that.testSupport([{ client: "Chrome" }]);
      ;
      that.controls = that.window;
      that.mpHolistic = that.window;
      that.drawingUtils = that.window;
      const config = {
        locateFile: (file) => {
          return (
            `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@` +
            `${that.mpHolistic.VERSION}/${file}`
          );
        },
      };
      // Our input frames will come from here.
      that.videoElement = that.$refs.inputvideo;
      that.canvasElement = that.$refs.outputcanvas;
      that.controlsElement = that.$refs.controlpanel;
      that.canvasCtx = that.canvasElement.getContext("2d");
      // We'll add that to our control panel later, but we'll save it here so we can
      // call tick() each time the graph runs.
      console.log(that.controls);
      that.fpsControl = that.controls.FPS();
      // Optimization: Turn off animated spinner after its hiding animation is done.
      const spinner = document.querySelector(".loading");
      spinner.ontransitionend = () => {
        spinner.style.display = "none";
      };

      const holistic = new that.mpHolistic.Holistic(config);
      holistic.onResults(that.onResults);

      // Present a control panel through which the user can manipulate the solution
      // options.
      new that.controls.ControlPanel(that.controlsElement, {
        selfieMode: true,
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        effect: "background",
      })
        .add([
          new that.controls.StaticText({ title: "MediaPipe Holistic" }),
          that.fpsControl,
          new that.controls.Toggle({
            title: "Selfie Mode",
            field: "selfieMode",
          }),
          new that.controls.SourcePicker({
            onSourceChanged: () => {
              // Resets because the pose gives better results when reset between
              // source changes.
              holistic.reset();
            },
            onFrame: async (input, size) => {
              const aspect = size.height / size.width;
              let width, height;
              if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight;
                width = height / aspect;
              } else {
                width = window.innerWidth;
                height = width * aspect;
              }
              that.canvasElement.width = width;
              that.canvasElement.height = height;
              await holistic.send({ image: input });
            },
          }),
          new that.controls.Slider({
            title: "Model Complexity",
            field: "modelComplexity",
            discrete: ["Lite", "Full", "Heavy"],
          }),
          new that.controls.Toggle({
            title: "Smooth Landmarks",
            field: "smoothLandmarks",
          }),
          new that.controls.Toggle({
            title: "Enable Segmentation",
            field: "enableSegmentation",
          }),
          new that.controls.Toggle({
            title: "Smooth Segmentation",
            field: "smoothSegmentation",
          }),
          new that.controls.Slider({
            title: "Min Detection Confidence",
            field: "minDetectionConfidence",
            range: [0, 1],
            step: 0.01,
          }),
          new that.controls.Slider({
            title: "Min Tracking Confidence",
            field: "minTrackingConfidence",
            range: [0, 1],
            step: 0.01,
          }),

          new that.controls.Slider({
            title: "Effect",
            field: "effect",
            discrete: { background: "Background", mask: "Foreground" },
          }),
        ])
        .on((x) => {
          const options = x;
          that.videoElement.classList.toggle("selfie", options.selfieMode);
          that.activeEffect = x["effect"];
          holistic.setOptions(options);
        });
    });
  },
  methods: {
    testSupport(supportedDevices) {
      ;
      const deviceDetector = new DeviceDetector();
      const detectedDevice = deviceDetector.parse(navigator.userAgent);
      let isSupported = false;
      for (const device of supportedDevices) {
        if (device.client !== undefined) {
          const re = new RegExp(`^${device.client}$`);
          if (!re.test(detectedDevice.client.name)) {
            continue;
          }
        }
        if (device.os !== undefined) {
          const re = new RegExp(`^${device.os}$`);
          if (!re.test(detectedDevice.os.name)) {
            continue;
          }
        }
        isSupported = true;
        break;
      }
      if (!isSupported) {
        alert(
          `This demo, running on ${detectedDevice.client.name}/${detectedDevice.os.name}, ` +
            `is not well supported at this time, continue at your own risk.`
        );
      }
    },
    removeElements(landmarks, elements) {
      for (const element of elements) {
        delete landmarks[element];
      }
    },
    removeLandmarks(results) {
      if (results.poseLandmarks) {
        this.removeElements(
          results.poseLandmarks,
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]
        );
      }
    },
    connect(ctx, connectors) {
      const canvas = ctx.canvas;
      for (const connector of connectors) {
        const from = connector[0];
        const to = connector[1];
        if (from && to) {
          if (
            from.visibility &&
            to.visibility &&
            (from.visibility < 0.1 || to.visibility < 0.1)
          ) {
            continue;
          }
          ctx.beginPath();
          ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
          ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
          ctx.stroke();
        }
      }
    },
    onResults(results) {
      // Hide the spinner.
      document.body.classList.add("loaded");
      // Remove landmarks we don't want to draw.
      this.removeLandmarks(results);
      // Update the frame rate.
      this.fpsControl.tick();
      // Draw the overlays.
      this.canvasCtx.save();
      this.canvasCtx.clearRect(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      if (results.segmentationMask) {
        this.canvasCtx.drawImage(
          results.segmentationMask,
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height
        );
        // Only overwrite existing pixels.
        if (this.activeEffect === "mask" || this.activeEffect === "both") {
          this.canvasCtx.globalCompositeOperation = "source-in";
          // This can be a color or a texture or whatever...
          this.canvasCtx.fillStyle = "#00FF007F";
          this.canvasCtx.fillRect(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
          );
        } else {
          this.canvasCtx.globalCompositeOperation = "source-out";
          this.canvasCtx.fillStyle = "#0000FF7F";
          this.canvasCtx.fillRect(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
          );
        }
        // Only overwrite missing pixels.
        this.canvasCtx.globalCompositeOperation = "destination-atop";
        this.canvasCtx.drawImage(
          results.image,
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height
        );
        this.canvasCtx.globalCompositeOperation = "source-over";
      } else {
        this.canvasCtx.drawImage(
          results.image,
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height
        );
      }
      // Connect elbows to hands. Do this first so that the other graphics will draw
      // on top of these marks.
      this.canvasCtx.lineWidth = 5;
      if (results.poseLandmarks) {
        if (results.rightHandLandmarks) {
          this.canvasCtx.strokeStyle = "white";
          this.connect(this.canvasCtx, [
            [
              results.poseLandmarks[this.mpHolistic.POSE_LANDMARKS.RIGHT_ELBOW],
              results.rightHandLandmarks[0],
            ],
          ]);
        }
        if (results.leftHandLandmarks) {
          this.canvasCtx.strokeStyle = "white";
          this.connect(this.canvasCtx, [
            [
              results.poseLandmarks[this.mpHolistic.POSE_LANDMARKS.LEFT_ELBOW],
              results.leftHandLandmarks[0],
            ],
          ]);
        }
      }
      // Pose...
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.poseLandmarks,
        this.mpHolistic.POSE_CONNECTIONS,
        { color: "white" }
      );
      this.drawingUtils.drawLandmarks(
        this.canvasCtx,
        Object.values(this.mpHolistic.POSE_LANDMARKS_LEFT).map(
          (index) => results.poseLandmarks[index]
        ),
        { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" }
      );
      this.drawingUtils.drawLandmarks(
        this.canvasCtx,
        Object.values(this.mpHolistic.POSE_LANDMARKS_RIGHT).map(
          (index) => results.poseLandmarks[index]
        ),
        { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
      );
      // Hands...
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.rightHandLandmarks,
        this.mpHolistic.HAND_CONNECTIONS,
        { color: "white" }
      );
      this.drawingUtils.drawLandmarks(
        this.canvasCtx,
        results.rightHandLandmarks,
        {
          color: "white",
          fillColor: "rgb(0,217,231)",
          lineWidth: 2,
          radius: (data) => {
            return this.drawingUtils.lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        }
      );
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.leftHandLandmarks,
        this.mpHolistic.HAND_CONNECTIONS,
        { color: "white" }
      );
      this.drawingUtils.drawLandmarks(
        this.canvasCtx,
        results.leftHandLandmarks,
        {
          color: "white",
          fillColor: "rgb(255,138,0)",
          lineWidth: 2,
          radius: (data) => {
            return this.drawingUtils.lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        }
      );
      // Face...
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.faceLandmarks,
        this.mpHolistic.FACEMESH_TESSELATION,
        { color: "#C0C0C070", lineWidth: 1 }
      );
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.faceLandmarks,
        this.mpHolistic.FACEMESH_RIGHT_EYE,
        { color: "rgb(0,217,231)" }
      );
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.faceLandmarks,
        this.mpHolistic.FACEMESH_RIGHT_EYEBROW,
        { color: "rgb(0,217,231)" }
      );
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.faceLandmarks,
        this.mpHolistic.FACEMESH_LEFT_EYE,
        { color: "rgb(255,138,0)" }
      );
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.faceLandmarks,
        this.mpHolistic.FACEMESH_LEFT_EYEBROW,
        { color: "rgb(255,138,0)" }
      );
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.faceLandmarks,
        this.mpHolistic.FACEMESH_FACE_OVAL,
        { color: "#E0E0E0", lineWidth: 5 }
      );
      this.drawingUtils.drawConnectors(
        this.canvasCtx,
        results.faceLandmarks,
        this.mpHolistic.FACEMESH_LIPS,
        { color: "#E0E0E0", lineWidth: 5 }
      );
      this.canvasCtx.restore();
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.abs {
  position: absolute;
}

a {
  color: white;
  text-decoration: none;
}

a:hover {
  color: lightblue;
}

body {
  bottom: 0;
  font-family: "Titillium Web", sans-serif;
  color: white;
  left: 0;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
  transform-origin: 0px 0px;
  overflow: hidden;
}

.container {
  position: absolute;
  background-color: #596e73;
  width: 100%;
  max-height: 100%;
}

.input_video {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.input_video.selfie {
  transform: scale(-1, 1);
}

.input_image {
  position: absolute;
}

.canvas-container {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.output_canvas {
  max-width: 100%;
  display: block;
  position: relative;
  left: 0;
  top: 0;
}

.logo {
  bottom: 10px;
  right: 20px;
}

.logo .title {
  color: white;
  font-size: 28px;
}

.logo .subtitle {
  position: relative;
  color: white;
  font-size: 10px;
  left: -30px;
  top: 20px;
}

.control-panel {
  position: absolute;
  left: 10px;
  top: 10px;
}

.loading {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  backface-visibility: hidden;
  justify-content: center;
  opacity: 1;
  transition: opacity 1s;
}

.loading .message {
  font-size: x-large;
}

.loading .spinner {
  position: absolute;
  width: 120px;
  height: 120px;
  animation: spin 1s linear infinite;
  border: 32px solid #bebebe;
  border-top: 32px solid #3498db;
  border-radius: 50%;
}

.loaded .loading {
  opacity: 0;
}

.shoutout {
  left: 0;
  right: 0;
  bottom: 40px;
  text-align: center;
  font-size: 24px;
  position: absolute;
}
</style> -->
<template>
  <div class="container">
    <video ref="input_video" width="100%" height="100%"></video>
    <canvas
      class="output_canvas"
      ref="output_canvas"
      :width="width"
      :height="height"
    ></canvas>
  </div>
</template>
<script>
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default {
  name: "HandModel",
  data: function () {
    return {
      number: null,
      ctx: null,
      width: null,
      height: null,
    };
  },
  computed: {
    inputVideo() {
      return this.$refs.input_video;
    },
  },
  mounted() {
    this.ctx = this.$refs.output_canvas.getContext("2d");
    this.init();
  },
  methods: {
    init() {
      const hands = new Hands({
        locateFile: (file) => {
          //return `/hpa/${file}`;
          return `https://fastly.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });
      hands.setOptions({
        maxNumHands: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      hands.onResults(this.onResults);

      const camera = new Camera(this.inputVideo, {
        onFrame: async () => {
          console.log(this.inputVideo);
          await hands.send({ image: this.inputVideo });
        },
      });
      camera.start();
    },
    onResults(results) {
      console.log("landmarks");
      this.width = results.image.width;
      this.height = results.image.height;
      this.ctx.save();
      this.ctx.clearRect(0, 0, results.image.width, results.image.height);
      this.ctx.drawImage(
        results.image,
        0,
        0,
        results.image.width,
        results.image.height
      );
      this.findHands(results);
      this.ctx.restore();
    },
    findHands(results, draw = true) {
      console.log("landmarks");
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          if (draw) {
            console.log(landmarks);
            drawLandmarks(this.ctx, landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.output_canvas {
  width: 100%;
  height: 100%;
}
</style>
