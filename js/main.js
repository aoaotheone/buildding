import * as THREE from "./libs/three.min"
import "./base/mesh"
import {makeBG, makeFloor} from "./base/mesh"
import * as AddLight from "./base/light"
import * as OIMO from "./libs/oimo"
import {createFont} from "./base/font"
import {createIsland} from "./base/island"
import {overHub, startHub, stopBTHub, stopHub,loadHub} from "./base/hub"
import {load} from "./base/load.js"
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // this.worker = wx.createWorker('workers/request/physijs_worker.js');
    this.count = 0
    this.boxDown = false //判断绳子是否放开
    this.inIsland = false //判断是否在小岛上
    this.gaming = false //判断是否在游戏
    this.updateBox = 0 //用于升降盒子的循环
    this.boxNum = 0 //已叠层数
    this.getInIsland = false //进岛动画是否在进行
    this.hidingHub = false //正在隐藏交互界面
    this.hidingOverHub = false
    this.hidingStopHub = false
    this.island = null
    this.buildA = false //建造塔A
    this.loaded = false //资源加载状态

    this.fileUrl = wx.env.USER_DATA_PATH //小程序文件路径
    this.fs = wx.getFileSystemManager()
    // this
    this.ToRad = Math.PI / 180;

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.scale = this.height/375


    wx.onTouchStart(this.onTouchStart.bind(this))
    wx.onTouchMove(this.onTouchMove.bind(this))
    wx.onTouchEnd(this.onTouchEnd.bind(this))

    this.init()
    

    this.loop()

  }

  start() {
    this.stopBTHub = stopBTHub()
    this.scene.add(this.stopBTHub)
    this.gaming = true
    this.populate(2)
  }
  stop() {
    this.scene.remove(this.stopBTHub)
    this.stopHub = stopHub()
    this.scene.add(this.stopHub)
    this.world.sleeping = true
    this.gaming = false
  }
  over() {
    this.scene.remove(this.stopBTHub)
    this.overHub = overHub()
    this.scene.add(this.overHub)
    this.gaming = false
  }
  continue() {
    this.scene.add(this.stopBTHub)
    this.gaming = true
    this.world.sleeping = false
  }

  //初始化函数
  init() {

    this.clock = new THREE.Clock()

    this.scene = new THREE.Scene() //新建场景
    this.box = new THREE.Object3D()
    this.box.position.set(-1550,-300,-500)
    this.box.rotation.set(Math.PI/50,-Math.PI/8,0)
    this.scene.add(this.box)

    this.meshs = []
    this.grounds = []


    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas, //绘图上下文
      alpha:true,
      antialias: true //开启抗锯齿
    })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor("#ffffff") // 设置背景的颜色
    this.renderer.shadowMap.enabled = true // 设置是否开启投影, 开启的话, 光照会产生投影
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap  // 设置投影类型, 这边的柔和投影

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 8000) // 新建一个透视摄像机, 并设置 视场, 视野长宽比例, 可见远近范围
    this.camera.position.set(340,120,0)  // 设置摄像机的位置

    this.view = new THREE.Vector3(0,50,0)
    this.camera.lookAt(this.view)  // 设置摄像机观察的方向





    this.scene.add(AddLight.directional(-800, 1200, 500)) //添加平行光
    this.scene.add(AddLight.directional(500,-200,0)) //添加平行光
    this.scene.add(AddLight.ambient()) //添加环境光




    // let groundGeometry = new THREE.BoxGeometry(210, 1, 210)
    // let groundMaterial = new THREE.MeshLambertMaterial({color: 0xffffff})
    // let ground = new THREE.Mesh(
    //   groundGeometry,
    //   groundMaterial
    // );
    // ground.position.set(0,-10,0)
    // ground.receiveShadow = true;
    // this.box.add(ground)
    // this.grounds.push(ground)

    this.bg = makeBG()
    this.scene.add(this.bg)

    this.loadHub = loadHub()
    this.scene.add(this.loadHub)

    this.scene.add(this.camera)

    // this.loadM()
    this.initOimoPhysics()
    this.gravity(9)


    // this.countHub = createFont(this,this.boxNum,195,0,0,20,4)

    load(this)
  }


  /**
   * 加载以及清除模型*/
  loadM() {

    /**
     * 加载字体*/
    // createFont(this, 'Quanta 13th', -200, 30, 140, 40, 10)
    createFont(this,'happy birthday',-200,30,140,40,10)
    // createFont(this,'2018-2019',-220,16,50,20,4)

    /**
    * 加载小岛*/
    createIsland(this)
  }
  addString(){
    // this.strings = []
    let geometry = new THREE.CylinderGeometry(2,2,22) //地面半径，顶部半径，高
    let material = new THREE.MeshLambertMaterial({color:0x844200})
    this.pivot = this.world.add({type:'sphere', size:[2], pos:[0,250,0], move:false, world:this.world, name:'pivot'})
    for (let i = 0;i<9;i++) {
      let pstring = this.world.add({type:'cylinder', size:[20,20], pos:[0,280-i*20,0], move:true, world:this.world, name:'string'+i})
      pstring.allowSleep = false
      this.bodys.push(pstring)
      let string = new THREE.Mesh(geometry,material)
      // string.position.set(300,280-i*20,0)
      this.box.add(string)
      this.meshs.push(string)
      if(i === 0){
        this.world.add({
          type:'jointHinge', //铰链
          body1:'pivot',
          body2:'string0',
          // collision: true, //是否冲撞
          pos1: [0,0,0],
          pos2: [0,20,0],
          axe1: [0,1,0], //按哪个方向对接
          axe2: [0,1,0], //对接轴的方向
          // spring:[100000,0.001]
        })
      }else {
        this.world.add({
          type:'jointHinge', //铰链
          body1:'string'+(i-1),
          body2:'string'+i,
          // collision: true, //是否冲撞
          pos1: [0,0,0],
          pos2: [0,20,0],
          axe1: [0,1,0], //按哪个方向对接
          axe2: [0,1,0], //对接轴的方向
          // spring:[100000,0.001]
        })
      }

    }


  }
  addBox(){
    let x, y, z, w, h, d;
    x = 0;
    z = 0;
    y = 160 + 50*this.boxNum;
    w = 60;
    h = 50;
    d = 60;
    this.pivot.position.y = 3+this.boxNum*0.5
    for (let i = 0;i < 9; i++){
      this.bodys[i].position.y = (3-0.2*i) +this.boxNum*0.5
    }
      // console.log(this.pivot.position)
    this.downBox = true
    let mesh
    let body
    body = this.world.add({
      type:'box',
      size:[w+20,h,d+20],
      pos:[0,110 + 50*this.boxNum,120],
      // rot:[0,45,45],
      move:true,
      world:this.world,
      name: 'box'+this.boxNum,
      friction: 1.2,
      restitution: 0.1,
      density:2

  });

    this.bodys.push(body)
    mesh = makeFloor(w,h,d)

    this.box.add( mesh );
    this.meshs.push(mesh)
    this.boxJoint = this.world.add({
      type:'jointHinge',
      body1:'box'+this.boxNum++,
      body2:'string8',
      pos1: [0,35,0],
      pos2: [0,0,0],
      axe1: [0,1,0], //按哪个方向对接
      axe2: [0,1,0], //对接轴的方向
    })
  }
  clearMesh() {
    let i=this.meshs.length;
    while (i--) this.box.remove(this.meshs[ i ]);
    i = this.grounds.length;
    while (i--) this.scene.remove(this.grounds[ i ]);
    this.grounds = [];
    this.meshs = [];
  }



  /**
   * oimo物理引擎配置
   * */
  initOimoPhysics(){

    // world setting:( TimeStep, BroadPhaseType, Iterations )
    // BroadPhaseType can be
    // 1 : BruteForce
    // 2 : Sweep and prune , the default
    // 3 : dynamic bounding volume tree

    this.world = new OIMO.World({
      info:true,
      worldscale:100,
      // sleeping: false,
      timestep: 1/60
    } );
    // this.populate(2);
    //setInterval(updateOimoPhysics, 1000/60);

  }
  populate(n) {
    this.boxNum = 0
    this.box.position.y = 0
    let type
    if(n===1) type = 1
    else if(n===2) type = 2;
    else if(n===3) type = 3;
    else if(n===4) type = 4;

    // reset old
    this.clearMesh();
    this.world.clear();
    this.bodys = [];

    //add ground
    let ground0 = this.world.add({size:[220, 1, 220], pos:[0,-1,0], world:this.world, friction: 1.2});


    //add object
    this.addString()
    this.addBox()
  }
  updateOimoPhysics() {
    if(this.world==null) return;

    this.world.step();

    let x, y, z, mesh, body, i = this.bodys.length;
    // console.log(this.bodys)
    while (i--){
      body = this.bodys[i];
      mesh = this.meshs[i];

      // if(!body.sleeping){
      //   mesh.position.copy(body.getPosition());
      //   mesh.quaternion.copy(body.getQuaternion());
      // }
      mesh.position.copy(body.getPosition());
      mesh.quaternion.copy(body.getQuaternion());
    }

    // infos.innerHTML = world.getInfo();
  }
  gravity(g){
    this.world.gravity = new OIMO.Vec3(0, -g, 0);
  }



  /**
   * 游戏交互*/
  onTouchStart(e){
    // console.log(e)
    if (e.touches.length > 1) return
    this.startX = e.touches[0].clientX
    this.startY = e.touches[0].clientY
    this.isMove = false
    this.timeStamp = e.timeStamp
  }
  onTouchMove(e){
    if (this.getInIsland ) return
    if (e.touches.length > 1) return
    let x = e.touches[0].clientX - this.startX
    let y = e.touches[0].clientY - this.startY
    this.startX = e.touches[0].clientX
    this.startY = e.touches[0].clientY

    /**
     * 判断是否滑动*/
    let timeStamp = e.timeStamp - this.timeStamp

    if (Math.sqrt(x*x+y*y) > 5){
      this.isMove = true

      if(this.gaming) return
      if(!this.inIsland) return
      if (Math.abs(x)>Math.abs(y)) {
        this.box.rotation.y += x/100
      }
      else {

      }
    }
    // if (timeStamp > 500){
    //   this.isMove = true
    // }

  }
  onTouchEnd(e){
    if (!this.isMove){
      this.onClick()
    }
  }
  onClick(){

    if (this.getInIsland ) return
    this.setRaycast()

    if (this.gaming){

    }else {
    }
  }

  //剪断绳子
  cut(){
    this.boxJoint.remove()
    this.boxDown = true
  }

  //镜头下移函数
  pullDownBox(){
      this.box.position.y--
  }

  //射线模拟物体点击
  setRaycast() {

    //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义https://segmentfault.com/a/1190000010490845
    let touch = {}
    touch.x = (this.startX / this.width) * 2 - 1;
    touch.y = -(this.startY / this.height) * 2 + 1;

    //新建一个三维单位向量 假设z方向就是0.5
    //根据照相机，把这个向量转换到视点坐标系
    let vector = new THREE.Vector3(touch.x, touch.y,0.5).unproject(this.camera);

    //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    let raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

    //射线和模型求交，选中一系列直线
    let intersects = false
    if (!this.inIsland) {
      intersects = raycaster.intersectObjects(this.startHub.children)
    }else if(this.gaming){
      intersects = raycaster.intersectObjects(this.stopBTHub.children)
      if (!this.boxDown && intersects.length <= 0){
        this.cut()
      }
    }else {
      if(this.stopHub){
        intersects = raycaster.intersectObjects(this.stopHub.children)
      }else if (this.overHub){
        intersects = raycaster.intersectObjects(this.overHub.children)
      } else {
        let obs = [this.island.children[15]]
        intersects = raycaster.intersectObjects(obs)
      }
    }


    if (!intersects || intersects.length <= 0) return
    console.log(intersects)
    switch (intersects[0].object.name) {
      case 'start':
        this.getInIsland = true
        this.hidingHub = true
        break;
      case '平台':
        // this.towerA()
        this.buildA = true
        break;
      case 'resume':
        this.hidingStopHub = true
        this.continue()
        break;
      case 'restart':
        if (this.stopHub) {
          this.hidingStopHub = true
        }else {
          this.hidingOverHub = true
        }
        this.start()
        break;
      case 'menu':
        this.scene.remove(this.stopHub)
        this.scene.remove(this.overHub)
        this.scene.remove(this.stopBTHub)
        this.box.remove(this.quanta)
        this.gaming = false
        this.inIsland = false
        this.buildA = false
        this.stopHub = false
        this.overHub = false
        this.clearMesh()
        this.box.remove(this.island)
        this.box.position.set(-1550,-300,-500)
        this.box.rotation.set(Math.PI/50,-Math.PI/8,0)
        this.loadM()
        this.startHub = startHub()
        this.scene.add(this.startHub)
        console.log(this.scene)
        console.log(this.stopBTHub)
        break;
      case 'stop':
        this.stop()
        break;
      default: break;
    }


  }

  //隐藏交互界面的动画
  hideHub(){
    if (this.startHub.position.z >= 120) {
      this.scene.remove(this.startHub)
      this.startHub = false
      this.hidingHub = false
    }else {
      this.startHub.position.z += 10
    }
  }
  hideStopHub(){
    if (this.stopHub.position.z >= 200) {
      this.scene.remove(this.stopHub)
      this.stopHub = false
      this.hidingStopHub = false
    }else {
      this.stopHub.position.z += 10
    }
  }
  hideOverHub(){
    if (this.overHub.position.z >= 200) {
      this.scene.remove(this.overHub)
      this.hidingOverHub = false
      this.overHub = false
    }else {
      this.overHub.position.z += 10
    }
  }

  //建造塔1
  towerA(){
    if (this.box.position.x > -10) {
      this.buildA = false
      setTimeout(res => {
        this.start()
      },100)
    }else {
      this.box.position.z -= this.box.position.z/20
      this.box.position.x -= this.box.position.x/20
      this.box.position.y -= this.box.position.y/20
      this.box.rotation.z -= this.box.rotation.z/20
      this.box.rotation.x -= this.box.rotation.x/20
      this.box.rotation.y -= this.box.rotation.y/20
    }
  }

  //进岛动画
  goIsland() {
    if (this.box.position.x > -600){
      // this.box.position.z = 0
      // this.box.position.x = -500
      // this.box.position.y = 0

      // this.box.rotation.z = 0
      // this.box.rotation.x = 0
      // this.box.rotation.y = 0
      this.getInIsland = false
      this.inIsland = true
    }else {
      this.box.position.z -= this.box.position.z/20
      this.box.position.x -= this.box.position.x/20
      this.box.position.y -= this.box.position.y/20
      this.box.rotation.z -= this.box.rotation.z/20
      this.box.rotation.x -= this.box.rotation.x/20
      this.box.rotation.y -= this.box.rotation.y/20
    }

  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {

    this.renderer.render(this.scene, this.camera)

  }

  // 游戏逻辑更新主函数
  update() {

    if(this.gaming){
      if (this.boxDown){
        let boxNum = this.boxNum + 8
        // console.log(boxNum)
        if(boxNum !== 9 && this.bodys[boxNum].pos.y < 50){
          this.boxDown = false
          this.gaming = false
          this.over()
          return
          // return
        } else if (this.bodys[boxNum].pos.y < 0){
          this.boxDown = false
          this.gaming = false
          this.over()
          return
        }
        if (this.bodys[boxNum].sleeping) {
          this.bodys[boxNum].move = false
          this.addBox()
          this.boxDown = false
        }
      }
      this.updateOimoPhysics()
    }
    if (this.downBox){
      if (this.box.position.y === -50*this.boxNum){
        this.downBox = false
        return
      }
      this.pullDownBox()
    }

    if (this.getInIsland) {
      this.goIsland()
    }

    if (this.hidingHub){
      this.hideHub()
    }
    if (this.hidingOverHub){
      this.hideOverHub()
    }
    if (this.hidingStopHub){
      this.hideStopHub()
    }
    if (this.buildA){
      this.towerA()
    }

    if (this.loaded){
      this.loaded = false
      setTimeout(res => {
        this.loadM()
        this.startHub = startHub()
        this.scene.add(this.startHub)
        this.scene.remove(this.loadHub)
        let bgm = wx.createInnerAudioContext()
        bgm.autoplay = true
        bgm.loop = true
        bgm.src = 'https://aoaotheone.cn/models/audio/bg.mp3'
// bgm.src = 'https://aoaotheone.cn/models/audio/bg.m4a'
        wx.onShow(function () {
          bgm.play()
        })
        wx.onAudioInterruptionEnd(function () {
          bgm.play()
        })
      },500)
    }
  }

  // 实现游戏帧循环
  loop() {
    // let delta = this.clock.getDelta()
    // let timeClip = Math.round(Math.round(delta*1000000)/16)
    this.animateId = requestAnimationFrame(this.loop.bind(this))
    // for (let i = 0;i<timeClip;i++){
    //   this.update()
    //   this.render()
    // }
    this.update()
    this.render()
  }

}
