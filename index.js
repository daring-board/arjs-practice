const ws = new WebSocket('ws://localhost:8080');

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

var video = document.getElementById('myVideo');
var localStream = null;
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const front = "user";
    const rear = { exact: "environment" };
    const mode = (navigator.userAgent.match(/iPhone|Android.+Mobile/))? rear: front;
    navigator.mediaDevices.getUserMedia({ video: {facingMode: mode} }).then(stream => {
        video.srcObject = stream;
    })
}

const n_hp = 21;
var scene = document.querySelector('a-scene');
for(let i=0; i < n_hp; i++){
    var asp = document.createElement('a-sphere')
    asp.setAttribute('id', 'landmark'+i);
    asp.setAttribute('landmark'+i, '');

    scene.appendChild(asp);
    AFRAME.registerComponent('landmark'+i, {
        init: function () {
            this.el.setAttribute('position', {x: i-5, y: i, z: -5});
            this.el.setAttribute('radius', 0.05);
            this.el.setAttribute('color', 'black');
        }
    });
}

const n_fm = 468;
var scene = document.querySelector('a-scene');
for(let i=0; i < n_fm; i++){
    var asp = document.createElement('a-sphere')
    asp.setAttribute('id', 'mesh'+i);
    asp.setAttribute('mesh'+i, '');

    scene.appendChild(asp);
    AFRAME.registerComponent('mesh'+i, {
        init: function () {
            this.el.setAttribute('position', {x: i-5, y: i, z: -5});
            this.el.setAttribute('radius', 0.01);
            this.el.setAttribute('color', 'blue');
        }
    });
}

AFRAME.registerComponent('change-color-on-hover', {
    schema: {
      color: {default: 'red'}
    },

    init: function () {
      var data = this.data;
      var el = this.el;  // <a-box>
      var defaultColor = el.getAttribute('material').color;

      el.addEventListener('mouseenter', function () {
        el.setAttribute('color', data.color);
      });

      el.addEventListener('mouseleave', function () {
        el.setAttribute('color', defaultColor);
      });

      el.addEventListener('click', function () {
        ws.send("Here's some text that the server is urgently awaiting!"); 
      });
    }
});

video.addEventListener('loadeddata', () => {
    // exec_handpose();
    tf.setBackend('wasm').then(() => exec_facemesh());
    // exec_facemesh();
});

async function exec_handpose(){
    const model = await handpose.load({
        detectionConfidence: 0.5,
        scoreThreshold: 0.5,
        iouThreshold: 0.8
    });
    var hands = [];
    for(let i=0; i < n_hp; i++){
        hands.push(document.getElementById('landmark'+i));
    }
    
    async function calc_landmark(){
        let predictions = await model.estimateHands(video);

        if (predictions.length > 0) {
            const keypoints = predictions[0].landmarks;
            // console.log(keypoints)
            for(let i=0; i < n_hp; i++){
                hands[i].setAttribute('visible', true);
                hands[i].setAttribute('position', {x: keypoints[i][0] / 400 - 0.5, y: -keypoints[i][1] / 300 + 2.0, z: keypoints[i][2] / 50 - 3});
            }
        } else {
            for(let i=0; i < n_hp; i++){
                hands[i].setAttribute('visible', false);
            }
        }
        requestAnimationFrame(calc_landmark);
    }
    calc_landmark();
}

async function exec_facemesh(){
    const model = await facemesh.load();
    var meshs = [];
    for(let i=0; i < n_fm; i++){
        meshs.push(document.getElementById('mesh'+i));
    }
    
    async function calc_mesh(){
        let predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
            const keypoints = predictions[0].scaledMesh;
            // console.log(keypoints)
            ws.send(keypoints.length); 
            for(let i=0; i < n_fm; i++){
                meshs[i].setAttribute('visible', true);
                meshs[i].setAttribute('position', {x: keypoints[i][0] / 400 - 0.5, y: -keypoints[i][1] / 300 + 2.0, z: keypoints[i][2] / 50 - 3});
            }
        }
        requestAnimationFrame(calc_mesh);
    }
    calc_mesh();
}

ws.onmessage = function (event) {
    console.log(event.data);
}
