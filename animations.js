if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}


AFRAME.registerComponent('scale-on-mouseenter', {
    //The schema defines the properties of its component
    //The component’s property type values are available through "this.data" (e.g. this.data.to)
    //The defined properties can be initialized/written in the static HTML in the a-entity tag (e.g. <a-entity scale-on-mouseenter="to: 1.5 2.5 3.0; message: Hello!"></a-entity>)
    schema: {
        to: {type: 'vec3', default: {x: 1.5, y: 1.5, z: 1.5}},
        message: {type: 'string', default: 'ScaleOnMouseEnter'}
    },

    multiple: true, //enable multiple instancing with the .multiple flag: multiple-instanced component has the form of <COMPONENTNAME>__<ID>
                    /*
                    <a-entity scale-on-mouseenter__helloworld="message: Hello, World!"
                              scale-on-mouseenter__metaverse="message: Hello, Metaverse!"></a-entity>
                    */

    /** it is called once when the component is first plugged into its entity. **/
    init: function () {
      var data = this.data;
      var el = this.el;
      this.el.addEventListener('mouseenter', function () {
        el.object3D.scale.copy(data.to);
        console.warn("enter");
        console.warn(data.to);
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
    },

    /**
     * .tick() handler will be called on every frame (e.g., 90 times per second),
     * @param {*} time the global scene uptime
     * @param {*} timeDelta  time since the last frame in milliseconds
     * @returns 
     */
    tick: function (time, timeDelta) {
        /*
        var directionVec3 = this.directionVec3;
    
        // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
        var targetPosition = this.data.target.object3D.position;
        var currentPosition = this.el.object3D.position;
    
        // Subtract the vectors to get the direction the entity should head in.
        directionVec3.copy(targetPosition).sub(currentPosition);
    
        // Calculate the distance.
        var distance = directionVec3.length();
    
        // Don't go any closer if a close proximity has been reached.
        if (distance < 1) { return; }
    
        // Scale the direction vector's magnitude down to match the speed.
        var factor = this.data.speed / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
          directionVec3[axis] *= factor * (timeDelta / 1000);
        });
    
        // Translate the entity in the direction towards the target.
        this.el.setAttribute('position', {
          x: currentPosition.x + directionVec3.x,
          y: currentPosition.y + directionVec3.y,
          z: currentPosition.z + directionVec3.z
        });
        */
    }

    });