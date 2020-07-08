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
    const w = 257;
    const h = 200;
    const model = await posenet.load({
            architecture: 'ResNet50',
            outputStride: 32,
            inputResolution: { width: w, height: h },
            quantBytes: 2
        });
    var sphere = document.getElementById('sphere');
    var cylinder = document.getElementById('cylinder');
    var noseObj = document.getElementById('nose');
    while(true) {
        const predict = await model.estimateSinglePose(video);

        const keypoints = predict.keypoints;
        const right_wrist = keypoints[10];
        const left_wrist = keypoints[9];
        const nose = keypoints[0];

        if (right_wrist.score > 0.5) {
            sphere.setAttribute('visible', false);
        } else {
            sphere.setAttribute('visible', true);
        }

        if (left_wrist.score > 0.5) {
            cylinder.setAttribute('visible', false);
        } else {
            cylinder.setAttribute('visible', true);
        }

        if (nose.score > 0.5) {
            const camera = document.getElementById('myCamera');
            const rotate = camera.getAttribute('rotation');
            const radius = 2;
            var position = { x: 0, y: 1.6, z: 0};
            const radian = rotate.y / 180 * Math.PI;
            position.x = - Math.sin(radian) - (nose.position.x/w) * Math.cos(radian);
            position.y -= (nose.position.y/h);
            position.z = - Math.cos(radian) + (nose.position.x/w) * Math.sin(radian);
            console.log(position);

            noseObj.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
            noseObj.setAttribute('visible', true);
        } else {
            noseObj.setAttribute('visible', false);
        }

        var arms = document.getElementById('myArms');
        if (right_wrist.score > 0.5 && left_wrist.score > 0.5) {
            const camera = document.getElementById('myCamera');
            const rotate = camera.getAttribute('rotation');
            arms.setAttribute('rotation', `${rotate.x} ${rotate.y-90} ${rotate.z}`)
            arms.setAttribute('visible', true);
        } else {
            arms.setAttribute('visible', false);
        }
    }
}
