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

// video.addEventListener('loadeddata', (event) => {
//     main(event.srcElement)
// });

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

      el.addEventListener('click', () => main())
    }
});

async function main(){
    const w = 300;
    const h = 400;
    const model = await handpose.load();;
    var sphere = document.getElementById('sphere');
    while(true) {
        let hands = await model.estimateHands(video);

        const camera = document.getElementById('myCamera');
        const rotate = camera.getAttribute('rotation');
        const radius = 2;
        const radian = rotate.y / 180 * Math.PI;
        console.log(hands)

        if (hands.length > 0) {
            const keypoints = hands[0].landmarks;
            console.log(keypoints)
            const x = keypoints[0][0]
            const y = keypoints[0][1]
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
