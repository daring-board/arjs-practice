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
})

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
    const model = await posenet.load({
            architecture: 'ResNet50',
            outputStride: 32,
            inputResolution: { width: 257, height: 200 },
            quantBytes: 2
        });
    var sphere = document.getElementById('sphere');
    var cylinder = document.getElementById('cylinder');
    while(true) {
        console.log('estimate!!');
        const predict = await model.estimateSinglePose(video);

        const keypoints = predict.keypoints;
        console.log(keypoints)
        const right_wrist = keypoints[10];
        const left_wrist = keypoints[9];
        if (right_wrist.score > 0.5) {
            console.log(right_wrist.score);
            sphere.setAttribute('visible', false);
        } else {
            sphere.setAttribute('visible', true);
        }

        if (left_wrist.score > 0.5) {
            console.log(left_wrist.score);
            cylinder.setAttribute('visible', false);
        } else {
            cylinder.setAttribute('visible', true);
        }
    }
}