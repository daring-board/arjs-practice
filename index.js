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
    const w = 300;
    const h = 400;
    const model = await handTrack.load({
        flipHorizontal: false,   // flip e.g for video 
        imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
        maxNumBoxes: 1,        // maximum number of boxes to detect
        iouThreshold: 0.75,      // ioU threshold for non-max suppression
        scoreThreshold: 0.75,    // confidence threshold for predictions.
    });
    var sphere = document.getElementById('sphere');
    while(true) {
        let hands = await model.detect(video);

        const camera = document.getElementById('myCamera');
        const rotate = camera.getAttribute('rotation');
        const radius = 2;
        const radian = rotate.y / 180 * Math.PI;

        if (hands.length > 0) {
            const x = hands[0].bbox[0] + hands[0].bbox[2] / 2
            const y = hands[0].bbox[1] + hands[0].bbox[3] / 2
            var position = { x: 0, y: 1, z: 0};
            position.x = - Math.sin(radian) - ((x - w/2 - w/5)/w) * 2 * Math.cos(radian);
            position.y += 4 * ((-y + h/2)/h);
            position.z = - Math.cos(radian) + ((x - w/2 - w/5)/w) * 2 * Math.sin(radian);
            console.log(position);

            sphere.setAttribute('position', `${radius * position.x} ${position.y} ${radius * position.z}`);
            sphere.setAttribute('visible', true);
        } else {
            sphere.setAttribute('visible', false);
        }

    }
}
