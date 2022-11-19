if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('tag-anim-toward_camera', { 

    schema: {
        from: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        to: {type: 'vec3', default: {x: 0, y: 1, z: 0}}
    },

    init: function () {
        var self = this;
        this.time = 0;
        this.start=false;
        this.first_scan=true;
        this.progress = document.getElementById("progress");
        this.began = document.getElementById("began");
        this.completed = document.getElementById("completed");
        this.animation = AFRAME.ANIME({
        targets: [{x: self.data.from.x, y: self.data.from.y, z: self.data.from.z}], //initial values. targets hold modified values during the animation
        x: self.data.to.x, y: self.data.to.y, z: self.data.to.z, //final values
        autoplay: false,
        duration: 1000,
        easing: "linear",
        loop: false,
        round: false,
        update: function (animation) {
            var value = animation.animatables[0].target;
            self.el.object3D.position.set(value.x, value.y, value.z);
            self.progress.innerHTML = 'progress : ' + Math.round(animation.progress) + '%';
            self.began.innerHTML = 'began : ' + animation.began;
            self.completed.innerHTML = 'completed : ' + animation.completed;
        },
        begin: function(animation) {
            //console.warn("begin play");
            self.began.innerHTML = 'began : ' + animation.began;
            animation.completed=false;
        },
        complete: function(animation) {
            //console.warn("complete play");
            self.completed.innerHTML = 'completed : ' + animation.completed;
            animation.began=false;
        }
        });       
        this.el.addEventListener('click', function () {
            //console.warn("click play");
            self.start=!self.start;
            if(self.start)
            {
                if(!self.first_scan)
                {
                    self.animation.reverse();
                }
                self.first_scan=false;
                    
                self.animation.play();
            }
            else
            {
                //self.animation.pause();
                self.animation.reverse();
                self.animation.play();
            }

        });
        function logFinished() {
            //console.warn("Animation Finished");
            //self.animation.began=false;
        }
        this.animation.finished.then(logFinished);
        
    },
    tick: function (t, dt) {
        //this.time += dt;
        //this.animation.tick(this.time);
        /*
        if(this.start)
        {       
            this.animation.tick(this.time);       
        }
        */
    }
    });


AFRAME.registerComponent('print-global-pos', { 

    schema: {
        id_el: {type: 'string', default: 'div-marker-global-pos'},
        msg: {type: 'string', default: 'Marker'}
    },

    init: function () {
        var self = this;
        this.time = 0;
        //this.cam = document.querySelector("#main_camera");
        this.global_pos = new THREE.Vector3();
        this.elDiv = document.getElementById(this.data.id_el);
      
    },
    tick: function (t, dt) {
        this.time += dt;
        if(this.time>100)
        {
            //every 100ms update the object global position
            this.time=0;
            //print global pos of the marker (camera is always at 0,0,0)
            this.el.object3D.getWorldPosition(this.global_pos);
            this.elDiv.innerHTML = this.data.msg + " x: " + this.global_pos.x.toFixed(1) + " y: " +  this.global_pos.y.toFixed(1) + " z: " +  this.global_pos.z.toFixed(1);

        }
    }
});



AFRAME.registerComponent('get-skeleton', { 

    schema: {},

    init: function () {
        var self = this;
        this.model = null;

        var model = this.el.getObject3D('mesh');
        if (model) 
        {
            this.load(model);
        } else 
        {
            this.el.addEventListener('model-loaded', function (e) {
                this.load(e.detail.model);
            }.bind(this));
        }
      
    },
    load: function (model) {
        this.model = model;
    },
    tick: function (t, dt) {

    }
});
