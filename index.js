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

const num_point = 21;
var scene = document.querySelector('a-scene');
for(let i=0; i < num_point; i++){
    var asp = document.createElement('a-sphere')
    asp.setAttribute('id', 'landmark'+i);
    asp.setAttribute('landmark'+i, '');

    scene.appendChild(asp);
    AFRAME.registerComponent('landmark'+i, {
  
        init: function () {
            this.el.setAttribute('position', {x: i-5, y: i, z: -5});
            this.el.setAttribute('radius', 0.01);
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
    }
});

video.addEventListener('loadeddata', () => {
    // tf.setBackend('wasm').then(() => main());
    main();
});

async function main(){
    const model = await handpose.load({
        detectionConfidence: 0.25,
        scoreThreshold: 0.20,
        iouThreshold: 0.8
    });
    var hands = [];
    for(let i=0; i < num_point; i++){
        hands.push(document.getElementById('landmark'+i));
    }
    
    async function calc_mesh(){
        let predictions = await model.estimateHands(video);

        if (predictions.length > 0) {
            const keypoints = predictions[0].landmarks;
            console.log(keypoints)
            for(let i=0; i < num_point; i++){
                hands[i].setAttribute('visible', true);
                hands[i].setAttribute('position', {x: keypoints[i][0] / 400 - 0.5, y: -keypoints[i][1] / 300 + 2.0, z: keypoints[i][2] / 50 - 3});
            }
        } else {
            for(let i=0; i < num_point; i++){
                hands[i].setAttribute('visible', false);
            }
        }
        requestAnimationFrame(calc_mesh);
    }
    calc_mesh();
}
