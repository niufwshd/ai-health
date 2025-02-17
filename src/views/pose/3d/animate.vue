<template>
  <div>
    <div id="canvas" ref="canvas" class="container"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import Stats from "stats.js";
import { ref, nextTick } from "vue";

export default {
  name: "three3D",
  data() {
    return {
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer,
      controls: null,
      stats: null,
      canvas: {},
      gltfLoader: null,
      textureLoader: THREE.TextureLoader,
      raycaster: THREE.Raycaster,
      composer: null, // 效果合成器
      outlinePass: OutlinePass,
      modelData: THREE.Group,
      mouse: THREE.Vector2,
      intersects: null,
      ambientLight: null,
      directionalLight: null,
      material: THREE.MeshStandardMaterial,
      selectedObject: null,
      color: null,
      mixer: null,
      clock: null,
    };
  },
  mounted() {
    let that = this;
    that.scene = new THREE.Scene();
    that.gltfLoader = new GLTFLoader(); // 模型加载器
    that.textureLoader = new THREE.TextureLoader(); // 纹理加载器
    that.raycaster = new THREE.Raycaster(); // 射线检测器
    that.canvas = that.$refs["canvas"];

    that.clock = new THREE.Clock();

    that.$nextTick(() => {
      that.initScene();
      that.initCamera(that.canvas.clientWidth, that.canvas.clientHeight);
      that.initRenderer(that.canvas.clientWidth, that.canvas.clientHeight);
      that.initControls();
      that.render();
      that.initStats();
      that.initLight();
      that.initComposer();
      that.initModel();
    });

    window.addEventListener("resize", () => {
      // 更新摄像机
      that.camera.aspect = that.canvas.clientWidth / that.canvas.clientHeight;
      // 更新摄像机投影矩阵
      that.camera.updateProjectionMatrix();
      // 更新渲染器
      that.renderer.setSize(that.canvas.clientWidth, that.canvas.clientHeight);
      // 设置渲染器的像素比
      that.renderer.setPixelRatio(window.devicePixelRatio);
      that.render();
    });
  },

  methods: {
    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("rgb(226, 225, 225)");
    },
    // 相机
    initCamera(width, height) {
      this.camera = new THREE.PerspectiveCamera(
        100,
        width / height,
        0.01,
        1000
      );
      this.camera.position.set(-1, 1, 2);
      this.scene.add(this.camera);
    },
    // 渲染器
    initRenderer(width, height) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.shadowMap.enabled = true; // 开启阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 可根据需要选择阴影类型
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比例
      this.canvas.appendChild(this.renderer.domElement);
      this.renderer.render(this.scene, this.camera);
    },
    // 性能监测
    initStats() {
      this.stats = new Stats();
      this.canvas.appendChild(this.stats.dom);
    },
    // 控制器
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // 使动画循环使用时阻尼或自转 意思是否有惯性
      this.controls.enableZoom = true; //是否可以缩放
      this.controls.autoRotate = false; //是否自动旋转
      this.controls.enablePan = true; //是否开启右键拖拽
      this.controls.minDistance = 1.8; // 设置相机向内移动上限
      this.controls.maxDistance = 5; // 设置相机向外移动上限
      this.controls.minPolarAngle = Math.PI / 4; // 最小极角
      this.controls.maxPolarAngle = Math.PI / 2.1; // 最大极角
    },
    // 灯光
    initLight() {
      let that = this;
      that.ambientLight = new THREE.AmbientLight(
        new THREE.Color("rgb(206, 206, 206)")
      );
      that.directionalLight = new THREE.DirectionalLight(
        new THREE.Color("rgb(128, 128, 128)")
      );
      this.directionalLight.position.set(5.5, 4, 4.5);
      this.directionalLight.castShadow = true; // 产生阴影

      // 配置阴影属性
      this.directionalLight.shadow.mapSize.width = 2048;
      this.directionalLight.shadow.mapSize.height = 2048;
      this.directionalLight.shadow.camera.near = 0.5;
      this.directionalLight.shadow.camera.far = 500;
      this.directionalLight.shadow.camera.left = -10;
      this.directionalLight.shadow.camera.right = 10;
      this.directionalLight.shadow.camera.top = 10;
      this.directionalLight.shadow.camera.bottom = -10;

      this.scene.add(this.ambientLight, this.directionalLight);
    },
    // 效果合成器
    initComposer() {
      let that = this;
      that.composer = new EffectComposer(that.renderer);

      // 创建渲染通道
      that.renderPass = new RenderPass(that.scene, that.camera);
      that.composer.addPass(that.renderPass);

      this.outlinePass = new OutlinePass(
        new THREE.Vector2(that.canvas.clientWidth, that.canvas.clientHeight),
        that.scene,
        that.camera
      );
      that.outlinePass.visibleEdgeColor.set(new THREE.Color("rgb(255, 0, 0)")); // 设置轮廓线颜色
      that.outlinePass.edgeThickness = 2; // 轮廓的宽度
      that.outlinePass.edgeStrength = 10; // 轮廓线强
      that.outlinePass.edgeGlow = 0.1; //发光度
      that.outlinePass.pulsePeriod = 1.5; //闪烁
      that.composer.addPass(that.outlinePass);

      // 创建SMAAPass抗锯齿通道
      that.smaaPass = new SMAAPass(
        that.canvas.clientWidth,
        that.canvas.clientHeight
      );
      that.composer.addPass(that.smaaPass);
    },
    // 渲染
    render() {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      //;
      if (this.stats) {
        this.stats.update();
      }
      if (this.mixer) this.mixer.update(this.clock.getDelta());
      requestAnimationFrame(this.render);
    },
    // 模型加载
    initModel() {
      let that = this;
      that.gltfLoader.load(
        "http://localhost:8080/sofa/jumping-jack.glb",
        (gltf) => {
          console.log(gltf);
          gltf.scene.scale.set(1, 1, 1);
          gltf.scene.traverse(function (obj) {
            if (obj.isMesh) {
              //判断是否是网格模型
              obj.material.emissive = obj.material.color;
              obj.material.emissiveMap = obj.material.map;
            }
          });
          that.mixer = new THREE.AnimationMixer(gltf.scene);
          that.mixer.clipAction(gltf.animations[0]).play();
          that.scene.add(gltf.scene);
        }
      );
    },
  },
};
</script>

<style scoped>
.right {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.right .box {
  width: 50px;
  height: 50px;
}
.container {
  height: 800px;
  width: 1000px;
  background-color: #fafafa;
  position: fixed;
}
</style>
