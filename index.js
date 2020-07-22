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

const num_point = 469;
var scene = document.querySelector('a-scene');
for(let i=0; i < num_point; i++){
    var asp = document.createElement('a-sphere')
    asp.setAttribute('id', 'facemesh'+i);

    scene.appendChild(asp);
    AFRAME.registerComponent('facemesh'+i, {
  
        init: function () {
            this.el.setAttribute('position', {x: i-5, y: i, z: -5});
            this.el.setAttribute('radius', 0.05);
        }

    });
}

video.addEventListener('loadeddata', (event) => {
    main(event.srcElement)
});

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

async function main(video){
    const model = await facemesh.load();
    var faces = [];
    for(let i=0; i < num_point; i++){
        faces.push(document.getElementById('facemesh'+i));
        console.log(`${i}: ${faces[i]}`)
    }
    while(true) {
        let predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
            const keypoints = predictions[0].scaledMesh;
            console.log(keypoints)
            for(let i=0; i < num_point; i++){
                faces[i].setAttribute('visible', true);
                faces[i].setAttribute('position', {x: i-5, y: i, z: -5});
            }
        } else {
            for(let i=0; i < num_point; i++){
                faces[i].setAttribute('visible', false);
            }
        }

    }
}
