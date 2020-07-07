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
        // console.log('estimate!!');
        const predict = await model.estimateSinglePose(video);

        const keypoints = predict.keypoints;
        // console.log(keypoints)
        const right_wrist = keypoints[10];
        const left_wrist = keypoints[9];
        const nose = keypoints[0];

        if (right_wrist.score > 0.5) {
            // console.log(right_wrist.score);
            sphere.setAttribute('visible', false);
        } else {
            sphere.setAttribute('visible', true);
        }

        if (left_wrist.score > 0.5) {
            // console.log(left_wrist.score);
            cylinder.setAttribute('visible', false);
        } else {
            cylinder.setAttribute('visible', true);
        }

        if (nose.score > 0.8) {
            var camera = document.getElementById('myCamera');
            var rotate = camera.getAttribute('rotation');
            console.log(rotate);
            const term = 180;
            const ctr_x = Math.sin(Math.PI * rotate.x) * Math.cos(Math.PI * rotate.y);
            const ctr_y = Math.sin(Math.PI * rotate.x);
            // var x = 2 * (- nose.position.x / w + ctr_x);
            // var y = 2 * (- nose.position.y / h + ctr_y);
            var x = ctr_x;
            var y = ctr_y + 1.6;

            noseObj.setAttribute('visible', true);
            noseObj.setAttribute('position', `${x} ${y} -2`);
            var pos = noseObj.getAttribute('position');
            console.log(pos);
        } else {
            noseObj.setAttribute('visible', false);
        }
    }
}
