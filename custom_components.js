if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('move_near_far_to_camera', {
    //The schema defines the properties of its component
    //The component’s property type values are available through "this.data" (e.g. this.data.to)
    //The defined properties can be initialized/written in the static HTML in the a-entity tag (e.g. <a-entity scale-on-mouseenter="to: 1.5 2.5 3.0; message: Hello!"></a-entity>)
    schema: {
        t_param_stop: {type: 'number', default: 0.5}, //from 0 to 1 0=at rest position, 1=in the camera position
        message: {type: 'string', default: 'Animation to move entity Toward & Back from camera'}
    },

    multiple: true, //enable multiple instancing with the .multiple flag: multiple-instanced component has the form of <COMPONENTNAME>__<ID>
                    /*
                    <a-entity scale-on-mouseenter__helloworld="message: Hello, World!"
                              scale-on-mouseenter__metaverse="message: Hello, Metaverse!"></a-entity>
                    */

    /** it is called once when the component is first plugged into its entity. **/
    init: function () {
        this.cam = document.querySelector("#main_camera");
        console.warn("camera");
        console.warn(this.cam);
        console.warn(this.cam.object3D.position);
        this.fwd = false; //animation forward
        this.bck = false; //animation backward
        this.t_param = 0;

        //this.start_pos = this.el.object3D.position;
        this.start_pos = new THREE.Vector3();
        this.el.object3D.getWorldPosition(this.start_pos);
        console.warn("start position");
        console.warn(this.start_pos);
        this.InterpolatedVec = new THREE.Vector3();
        this.CurrentPosVec = new THREE.Vector3();
        this.TargetPosVec = new THREE.Vector3();

       /*  var fwd = this.fwd;
        var bck = this.bck;
        var t_param = this.t_param;
        var TargetPosVec = this.TargetPosVec;
        var CurrentPosVec = this.CurrentPosVec;
        var cam = this.cam;
        var el = this.el; */
        var self = this;
        this.el.addEventListener('mouseenter', function () {
            //el.object3D.scale.copy(data.to);
            self.fwd = true; //animation forward
            self.bck = false; //animation backward
            //el.object3D.getWorldPosition(this.start_pos);
            self.t_param = 0;
            //TargetPosVec.copy(cam.object3D.position);
            self.cam.object3D.getWorldPosition(self.TargetPosVec);
            console.warn("enter");
            console.warn(self.TargetPosVec);
            //console.warn(cam.object3D.position);
            //console.warn("start obj pos world: ",this.start_pos);
        
        });
        this.el.addEventListener('mouseleave', function () {
            //el.object3D.scale.copy(data.from);
            self.fwd = false; //animation forward
            self.bck = true; //animation backward
            self.t_param = 0;
            //CurrentPosVec.copy(el.object3D.position);
            self.el.object3D.getWorldPosition(self.CurrentPosVec);
            console.warn("leave");
            console.warn(self.CurrentPosVec);
            //console.warn(el.object3D.position);
        });
    },

    /**
     * Update the mesh in response to property updates.
     * oldData = contains the object properties before the change
    */
    update: function (oldData) {
        var data = this.data;
        var el = this.el;

        // If `oldData` is empty, then this means we're in the initialization process.
        // No need to update.
        if (Object.keys(oldData).length === 0) { return; }
        /*
        // Geometry-related properties changed. Update the geometry.
        if (data.width !== oldData.width ||
            data.height !== oldData.height ||
            data.depth !== oldData.depth) {
        el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(data.width, data.height,
                                                                        data.depth);
        }

        // Material-related properties changed. Update the material.
        if (data.color !== oldData.color) {
        el.getObject3D('mesh').material.color = new THREE.Color(data.color);
        }
        */
    },

    /** when the component or entity is removed **/
    remove: function () {
        //this.el.removeObject3D('mesh');
        this.fwd = false; //animation forward
        this.bck = false; //animation backward
    },

    /**
     * .tick() handler will be called on every frame (e.g., 90 times per second),
     * @param {*} time the global scene uptime
     * @param {*} timeDelta  time since the last frame in milliseconds
     * @returns 
     */
    tick: function (time, timeDelta) {

        //var currentPosition = this.el.object3D.position;
        //targetPosition = this.cam.object3D.position;
        //directionVec3.copy(targetPosition).sub(currentPosition);
        //var NormalizedDirection = directionVec3.normalize();
        //directionVec3.normalize();
        //console.log(this.fwd,this.bck);
        if (this.fwd && !this.bck)
        {
            //forward animation
            //toward camera
            this.t_param += 0.1*timeDelta/1000.0;
            this.InterpolatedVec.lerpVectors(this.start_pos,this.TargetPosVec,this.t_param)
            if(this.t_param>this.data.t_param_stop)
            {
                //fine animazione
                this.fwd = false; //animation forward
                this.bck = false; //animation backward
                console.warn("fine anim avanti");
                console.warn(this.t_param);
                return;
            }

        }
        else if(!this.fwd && this.bck)
        {
            //backward animation
            //back to original position
            this.t_param += 0.1*timeDelta/1000.0;
            this.InterpolatedVec.lerpVectors(this.CurrentPosVec,this.start_pos, this.t_param)
            if(this.t_param>this.data.t_param_stop)
            {
                //fine animazione
                this.fwd = false; //animation forward
                this.bck = false; //animation backward
                console.warn("fine indietro");
                console.warn(this.t_param);
                return;
            }
        }
        else
        {
            return;
        }
        var localInterpolate = this.el.object3D.worldToLocal(this.InterpolatedVec);
        // Translate the entity in the direction towards the target.
        this.el.setAttribute('position', {
            x: localInterpolate.x,
            y: localInterpolate.y,
            z: localInterpolate.z
          });
    }

    });


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
        targets: [{x: self.data.from.x, y: self.data.from.y, z: self.data.from.z}],
        x: self.data.to.x, y: self.data.to.y, z: self.data.to.z,
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
            self.animation.began=false;
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