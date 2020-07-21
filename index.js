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

AFRAME.registerGeometry('facemesh', {
  
    init: function () {
        this.geometry = new THREE.Geometry();
    },
    update: function(vertices) {
        for(let i=0; i< vertices.length; i++){
            const [x, y, z] = vertices[i];
            geometry.vertices.push(new THREE.Vector3( x,  y, z));
        }
    }
});

async function main(video){
    const model = await facemesh.load();
    var face = document.getElementById('face');
    while(true) {
        let predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
            const keypoints = faces[0].scaledMesh;
            face.update(keypoints);
            console.log(keypoints)
            sphere.setAttribute('visible', true);
        } else {
            sphere.setAttribute('visible', false);
        }

    }
}
