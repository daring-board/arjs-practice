const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

var config = {
    apiKey: "AIzaSyBgC_40tfmwnLtw2r3_dBC6Hl18lp-6EdA",
    authDomain: "rigel-b11c1.firebaseapp.com",
    databaseURL: "https://rigel-b11c1.firebaseio.com",
    storageBucket: "rigel-b11c1.appspot.com"
};
firebase.initializeApp(config);
var database = firebase.database();

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

window.addEventListener('beforeunload', (evt) => {
    evt.returnValue = '';
    firebase.database().ref(`/space/avaters/${avater_id}`).remove();
    return '';
});

window.addEventListener('unload', () => {
    firebase.database().ref(`/space/avaters/${avater_id}`).remove();
});

let avater_id = null;
let avaters = null;
const avatersRef = firebase.database().ref(`/space/avaters/`);
avatersRef.once('value').then(snapshot => {
    console.log(snapshot.val());
    avaters = new Avaters(snapshot.val(), avater_id);
});

AFRAME.registerComponent('my-avater', {
    init: function () {
        var el = this.el;

        const num = avaters.avater_ids.length;
        avater_id = avatersRef.push({
            position: {x: getRandomInt(5), y: 1.5, z: getRandomInt(5)},
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            radius: 0.5
        }).key;

        let myAvater = null;
        firebase.database().ref(`/space/avaters/${avater_id}`).once('value', (snapshot) => {
            myAvater = snapshot.val();
        });
        el.setAttribute('position', myAvater.position)
    }
});

avatersRef.on('value', (snapshot) => {
    console.log(avaters);
    if(avaters == null) return;
    avaters.sync(snapshot.val());
});

// video.addEventListener('loadeddata', () => {
//     tf.setBackend('wasm').then(() => exec_facemesh());
// });

// const n_fm = 468;
// let model = null;
// var meshs = [];
// let myFMesh = ''
// async function exec_facemesh(){
//     model = await facemesh.load();
//     myFMesh = firebase.database().ref('/space/facemeshs').push({
//         facemesh: [0]
//     }).key;
//     calc_mesh()
// }

// async function calc_mesh(){
//     let predictions = await model.estimateFaces(video);
//     if (predictions.length > 0) {
//         const keypoints = predictions[0].scaledMesh;
//         firebase.database().ref(`/space/facemeshs/${myFMesh}`).update({
//             facemesh: keypoints
//         });
//     }
// }

// function addMeshs(num) {
//     var scene = document.querySelector('a-scene');
//     for(let i=0; i < num; i++){
//         for(let j=0; j < n_fm; j++){
//             var fm_id = j + i*n_fm;
//             var asp = document.createElement('a-sphere')
//             asp.setAttribute('id', 'mesh'+fm_id);
//             asp.setAttribute('mesh'+fm_id, '');
        
//             scene.appendChild(asp);
//             AFRAME.registerComponent('mesh'+fm_id, {
//                 init: function () {
//                     this.el.setAttribute('position', {x: 0, y: 0, z: 0});
//                     this.el.setAttribute('radius', 0.01);
//                     this.el.setAttribute('color', 'blue');
//                     this.el.setAttribute('visible', false);
//                 }
//             });
//             meshs.push(document.getElementById('mesh'+fm_id));
//         }
//     }
// }

// firebase.database().ref('/space/facemeshs').on('value', function(snapshot) {
//     const fmeshs = snapshot.val();
//     if (fmeshs === null) return;

//     const keys = Object.keys(fmeshs);
//     if (keys.length == 0) return;

//     if (keys.length > meshs.length){
//         addMeshs(keys.length - meshs.length);
//     }

//     for(let i=0; i < keys.length; i++){
//         if (fmeshs[keys[i]]['facemesh'].length != n_fm) continue;
//         const keypoints = fmeshs[keys[i]]['facemesh'];
//         for(let j=0; j < n_fm; j++){
//             if (meshs[j + i * n_fm] === undefined) break;
//             meshs[j + i * n_fm].setAttribute('visible', true);
//             meshs[j + i * n_fm].setAttribute('position', {x: keypoints[j][0] / 400 - 1.0, y: -keypoints[j][1] / 300 + 2.0, z: keypoints[j][2] / 50});
//         }
//     }
//     if(model == null) return;
//     requestAnimationFrame(calc_mesh);
// });
