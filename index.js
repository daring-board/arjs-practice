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

const scene = document.getElementsByTagName('a-scene');
for(let i=0; i < 10; i++){
    var asp = document.createElement('a-sphere')
    asp.setAttribute('facemesh'+i);

    scene.appendChild(asp);
    AFRAME.registerComponent('facemesh'+i, {
  
        init: function () {
            console.log(this.el)
            this.el.setAttribute('position', {x: i, y: i, z: i});
            this.el.setAttribute('radius', 0.5);
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
    var face = document.getElementById('face');
    while(true) {
        let predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
            const keypoints = predictions[0].scaledMesh;
            face.update(keypoints);
            console.log(keypoints)
            face.setAttribute('visible', true);
        } else {
            face.setAttribute('visible', false);
        }

    }
}
