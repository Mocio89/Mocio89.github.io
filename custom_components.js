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

        this.fwd = false; //animation forward
        this.bck = false; //animation backward
        this.t_param = 0;

        this.start_pos = this.el.object3D.position;
        this.InterpolatedVec = new THREE.Vector3();
        this.CurrentPosVec = new THREE.Vector3();
        this.TargetPosVec = new THREE.Vector3();

        this.el.addEventListener('mouseenter', function () {
            //el.object3D.scale.copy(data.to);
            this.fwd = true; //animation forward
            this.bck = false; //animation backward
            this.t_param = 0;
            this.TargetPosVec.copy(this.cam.object3D.position);
        
        });
        this.el.addEventListener('mouseleave', function () {
            //el.object3D.scale.copy(data.from);
            this.fwd = false; //animation forward
            this.bck = true; //animation backward
            this.t_param = 0;
            this.CurrentPosVec.copy(this.el.object3D.position);
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

        if (this.fwd && !this.bck)
        {
            //forward animation
            //toward camera
            this.t_param += timeDelta/1000.0;
            this.InterpolatedVec.lerpVectors(this.start_pos,this.TargetPosVec,this.t_param)
            if(this.t_param>this.data.t_param_stop)
            {
                //fine animazione
                this.fwd = false; //animation forward
                this.bck = false; //animation backward
                return;
            }

        }
        else if(!this.fwd && this.bck)
        {
            //backward animation
            //back to original position
            this.t_param += timeDelta/1000.0;
            this.InterpolatedVec.lerpVectors(this.CurrentPosVec,this.start_pos, this.t_param)
            if(this.t_param>this.data.t_param_stop)
            {
                //fine animazione
                this.fwd = false; //animation forward
                this.bck = false; //animation backward
                return;
            }
        }
        else
        {
            return;
        }

        // Translate the entity in the direction towards the target.
        this.el.setAttribute('position', {
            x: this.InterpolatedVec.x,
            y: this.InterpolatedVec.y,
            z: this.InterpolatedVec.z
          });
    }

    });