import * as THREE from "../libs/three.min";

/**
*光线控制函数
*/
export function directional (x,y,z){

  let directionalLight = new THREE.DirectionalLight( 0xfffff4 , 0.8); // 新建一个平行光, 平行光照射到的每个点的强度都一样
  directionalLight.position.set( x, y, z );
  directionalLight.target.position.set( 0, 0, 0 );
  directionalLight.castShadow = true; // 开启平行光的投影

  // 下面是设置投影的效果
  let d = 500;
  directionalLight.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d,  50, 2000 ); // 投影的可视范围
  directionalLight.shadow.bias = 0.0001;
  directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 612; // 投影的精度

  return directionalLight
}
export function ambient (){

  // 添加一个环境光, 目的是为了调和平行光的投影区域, 防止投影过度黑
  let light = new THREE.AmbientLight( 0xffffff, 0.3 )

  return light
}