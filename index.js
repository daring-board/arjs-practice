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
    const model = await handpose.load();
    var sphere = document.getElementById('sphere');
    var cylinder = document.getElementById('cylinder');
    var noseObj = document.getElementById('nose');
    while(true) {
        // console.log('estimate!!');
        const predicts = await model.estimateHands(video);

        for (let i = 0; i < predictions.length; i++) {
            const keypoints = predictions[i].landmarks;
       
            // Log hand keypoints.
            for (let i = 0; i < keypoints.length; i++) {
              const [x, y, z] = keypoints[i];
              console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
            }
        }
    }
}
