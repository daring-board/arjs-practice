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

        const camera = document.getElementById('myCamera');
        const rotate = camera.getAttribute('rotation');
        const radius = 2;
        const radian = rotate.y / 180 * Math.PI;

        if (right_wrist.score > 0.5) {
            var position = { x: 0, y: 0.5, z: 0};
            position.x = - Math.sin(radian) - ((right_wrist.position.x - w*3/4)/w) * 2 * Math.cos(radian);
            position.y += ((-right_wrist.position.y + h/2)/h);
            position.z = - Math.cos(radian) + ((right_wrist.position.x - w*3/4)/w) * 2 * Math.sin(radian);
            console.log(position);

            sphere.setAttribute('position', `${radius * position.x} ${position.y} ${radius * position.z}`);
            sphere.setAttribute('visible', true);
        } else {
            sphere.setAttribute('visible', false);
        }

        if (left_wrist.score > 0.5) {
            var position = { x: 0, y: 0.5, z: 0};
            position.x = - Math.sin(radian) - ((left_wrist.position.x - w*3/4)/w) * 2 * Math.cos(radian);
            position.y += ((-left_wrist.position.y + h/2)/h);
            position.z = - Math.cos(radian) + ((left_wrist.position.x - w*3/4)/w) * 2 * Math.sin(radian);
            console.log(position);

            cylinder.setAttribute('position', `${radius * position.x} ${position.y} ${radius * position.z}`);
            cylinder.setAttribute('visible', true);
        } else {
            cylinder.setAttribute('visible', false);
        }

        if (nose.score > 0.5) {
            var position = { x: 0, y: 1.6, z: 0};
            position.x = - Math.sin(radian) - ((nose.position.x - w*3/4)/w) * 2 * Math.cos(radian);
            position.y += ((-nose.position.y + h/2)/h);
            position.z = - Math.cos(radian) + ((nose.position.x - w*3/4)/w) * 2 * Math.sin(radian);
            console.log(position);

            noseObj.setAttribute('position', `${radius * position.x} ${position.y} ${radius * position.z}`);
            noseObj.setAttribute('visible', true);
        } else {
            noseObj.setAttribute('visible', false);
        }

    }
}
