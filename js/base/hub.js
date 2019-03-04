import * as THREE from '../libs/three.min'


export function startHub() {
  let startHub = new THREE.Object3D()
  startHub.position.set(195,0,10)
  startHub.rotation.set(0,0,Math.PI/16)
  startHub.add(createName(0.001,33,100,0,110,50,'name')) //游戏名
  startHub.add(createName(0.001,20,48,0,75,60,'start')) //开始
  startHub.add(createName(0.001,20,48,0,55,60,'rule')) //规则
  startHub.add(createName(0.001,15,42,0,35,25,'setting')) //设置
  startHub.add(createName(0.001,16,55,0,34.5,75,'board')) //排行榜
  return startHub
}
export function stopHub() {
  let startHub = new THREE.Object3D()
  startHub.position.set(195,0,10)
  startHub.rotation.set(0,0,Math.PI/16)

  startHub.add(createName(0.001,25,58,0,115,-10,'resume')) //继续
  startHub.add(createName(0.001,25,58,0,85,-10,'restart')) //重新开始
  startHub.add(createName(0.001,25,58,0,55,-10,'menu')) //返回
  return startHub
}
export function overHub() {
  let startHub = new THREE.Object3D()
  startHub.position.set(195,0,10)
  startHub.rotation.set(0,0,Math.PI/16)

  startHub.add(createName(0.001,25,58,0,95,-10,'restart')) //重新开始
  startHub.add(createName(0.001,25,58,0,65,-10,'menu')) //返回
  return startHub
}
export function stopBTHub() {
  let startHub = new THREE.Object3D()
  startHub.position.set(195,0,10)
  startHub.rotation.set(0,0,Math.PI/16)

  startHub.add(createName(0.001,8,8,0,35,-110,'stop')) //返回
  return startHub
}


function createName(x,y,z,a,b,c,name) {
  let texture = new THREE.TextureLoader().load('images/' + name + '.png')
  let geometry = new THREE.BoxGeometry(x,y,z)
  let material = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.1
  })
  let mesh = new THREE.Mesh(geometry,material)
  mesh.position.set(a,b,c)
  mesh.name = name
  return mesh

}


export function loadHub() {
  let startHub = new THREE.Object3D()
  startHub.position.set(195,0,10)
  startHub.rotation.set(0,0,Math.PI/16)
  let geometry = new THREE.BoxGeometry(0.001,4,1)
  let all_geometry = new THREE.BoxGeometry(0.001,4.1,200)
  let material = new THREE.MeshPhongMaterial({
    color: 0xffffff
  })
  let all_material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa
  })
  let mesh = new THREE.Mesh(geometry,material)
  let all_mesh = new THREE.Mesh(all_geometry,all_material)
  mesh.position.set(0.1,0,100)
  all_mesh.position.set(0,40,-10)
  all_mesh.add(mesh)
  startHub.add(all_mesh)
  return startHub
}