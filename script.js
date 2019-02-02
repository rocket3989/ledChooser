
var width = 500;
var height = 500;
var scene, camera, renderer, controls;
var currentFrame = 0;
var playing = false;



var animation = new Array();
animation.push(new Frame());




var positionLast = {
    x:0,
    y:0
};

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();


const onColor = 0xA8AD17;
const offColor = 0x151E05;
const onOpacity = .9;
const offOpacity = .5;



function init(){
    scene = new THREE.Scene();
    
    var canvas = document.getElementById('canvas'); 
    renderer = new THREE.WebGLRenderer({canvas: canvas,antialias: true});
    renderer.setSize(width,height);
    
    camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
    camera.position.set(5, 5, 15);
    scene.add(camera);
    

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enablePan = false;

    lightAmbient = new THREE.AmbientLight(0xffffff,2);
   
    scene.add(lightAmbient);
   
    createBoxes();
    
}


function createBoxes() {

    boxes = new THREE.Object3D();

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {
                var geometry = new THREE.BoxGeometry( 1, 1, 1 );
                var material = new THREE.MeshPhongMaterial({
                    color: offColor,
                    transparent: true, 
                    opacity:1
                });

                var box = new THREE.Mesh(geometry, material);
                box.position.x = (j-1) * 4;
                box.position.y = (i-1) * 4;
                box.position.z = (k-1) * 4;
                
                //box.rotation.y = Math.random() * 2 * Math.PI;

                var edge = new THREE.EdgesHelper( box, 0xa0a0a0);
                edge.material.linewidth = 3;

                box.index = i*9+j*3+k;
                box.material.opacity = offOpacity;
                box.add(edge);
                boxes.add(box);
            }
        }
    }
    
    boxes.position.y = 0;
    boxes.position.x = 0;
    boxes.position.z = 0;

    //add boxes to the scene
    scene.add(boxes);
}

init();

function setOpacityColor(obj, opacity, color){
    obj.material.color.set(color);
    obj.material.opacity = opacity;
}

function loadFrame(){
    for(var cube = 0; cube < 27; cube++){
        if(animation[currentFrame].getElement(cube))
            setOpacityColor(boxes.children[cube],onOpacity,onColor)
        else
            setOpacityColor(boxes.children[cube],offOpacity,offColor)
    }
    readData();
}
function readData(){
    let data = 0;
    for (i = 0; i < 27; i++){
        data += Math.pow(2,31-i)*animation[currentFrame].getElement(i);
    }
    //console.log(data);
    var output = data.toString(16);
    for(i = data.toString(16).length; i < 8; i++)
        output = "0" + output;
    $("#data").text("0x"+output);
    
}



$("#clearFrame").click(function(){
    for(var cube = 0; cube < 27; cube++)
        animation[currentFrame].setElement(cube,false);
    loadFrame(animation[currentFrame]);
})

$(".play").click(function() {
    if($(this).text() == "play"){
        $(this).text("pause");
        playing = true;
    }
    else{
        $(this).text("play");
        playing = false;
    }
}); 
  

$(canvas).mousedown(function(event){
    let rect = document.getElementById('canvas').getBoundingClientRect();
    positionLast.x = event.clientX - rect.left;
    positionLast.y = event.clientY - rect.top;
});

$(canvas).mouseup(function (event) {
    let rect = document.getElementById('canvas').getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    if(Math.abs(positionLast.x - x)+Math.abs(positionLast.y - y)<5){
        
        mouse.x = ( x / width ) * 2 - 1;
        mouse.y = - ( y / height ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( boxes.children );

        if(intersects.length){
            let intersect = intersects[0].object.index;

            animation[currentFrame].invertElement(intersect);
            if(animation[currentFrame].getElement(intersect))
                setOpacityColor(intersects[0].object,onOpacity,onColor);
            else
                setOpacityColor(intersects[0].object,offOpacity,offColor)

        }
    }
    readData();
});



for(var cube = 0; cube < 27; cube++)
    animation[currentFrame].setElement(cube,true);
loadFrame();



function animate() {
    requestAnimationFrame( animate );
    
    renderer.render( scene, camera );
}


animate();