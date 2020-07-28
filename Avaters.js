function getRandomInt(max) {
    return Math.random() * Math.floor(max);
}

class Avaters {
    constructor(obj, myID){
        this.myID = myID;
        this.avaters = obj;
        this.avater_ids = [];
        if(obj != null){
            this.avater_ids = Object.keys(obj);
        }
        var scene = document.querySelector('a-scene');

        for(let i=0; i < this.avater_ids.length; i++){
            const avt = obj[this.avater_ids[i]];
            var asph = document.createElement('a-sphere');
            asph.setAttribute('id', `${this.avater_ids[i]}`);
            asph.setAttribute(`avater_${this.avater_ids[i].toLowerCase()}`, '');
            scene.appendChild(asph);

            var thisKey = this.avater_ids[i];
            AFRAME.registerComponent(`avater_${this.avater_ids[i].toLowerCase()}`, {
                init: function () {
                    var color = avt.color;
                    if (thisKey == myID) color = 'red'
                    this.el.setAttribute('position', avt.position);
                    this.el.setAttribute('radius', 1);
                    this.el.setAttribute('color', color);
                    this.el.setAttribute('visible', true);
                }
            });
        }
    }

    sync(obj){
        const keys = Object.keys(obj);
        var ret = this.checkKeys(keys)
        this.avater_ids = keys;
        console.log(ret);
        this.removeElm(ret.remove);
        this.updateElm(ret.update, obj);
        this.createElm(ret.new, obj);
        this.avaters = obj;
    }

    removeElm(keys){
        keys.forEach(key => {
            document.getElementById(key).remove();
        });
    }

    updateElm(keys, obj){
        keys.forEach(key => {
            var avt = obj[key];
            var el = document.getElementById(key);
            el.setAttribute('position', avt.position);
            el.setAttribute('radius', 1);
            el.setAttribute('color', avt.color);
            el.setAttribute('visible', true);
        });

        // var el = document.getElementById(this.myID);
        // el.setAttribute('color', 'red');
    }

    createElm(keys, obj){
        var scene = document.querySelector('a-scene');

        keys.forEach(key => {
            const avt = obj[key];
            var asph = document.createElement('a-sphere');
            asph.setAttribute('id', `${key}`);
            asph.setAttribute(`avater_${key.toLowerCase()}`, '');
            scene.appendChild(asph);

            AFRAME.registerComponent(`avater_${key.toLowerCase()}`, {
                init: function () {
                    this.el.setAttribute('position', avt.position);
                    this.el.setAttribute('radius', 1);
                    this.el.setAttribute('color', avt.color);
                    this.el.setAttribute('visible', true);
                }
            });
        })
    }

    checkKeys(keys){
        let removed = [];
        let updated = [];
        let news = [];
        this.avater_ids.forEach(aid => {
            let flag = false;
            for(let i = 0; i < keys.length; i++){
                if(aid == keys[i]){
                    flag = true;
                    break;
                }
            };
            if(!flag) removed.push(aid);
            else updated.push(aid);
        });
        keys.forEach(key => {
            let flag = false;
            for(let i=0; i < this.avater_ids.length; i++){
                if(this.avater_ids[i] == key){
                    flag = true;
                    break;
                }
            }
            if(!flag) news.push(key)
        });

        return {remove: removed, update: updated, new: news};
    }
}