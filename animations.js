if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}


AFRAME.registerComponent('scale-on-mouseenter', {
    schema: {
        to: {type: 'vec3', default: {x: 1.5, y: 1.5, z: 1.5}}
    },

    init: function () {
      var data = this.data;
      var el = this.el;
      this.el.addEventListener('mouseenter', function () {
        el.object3D.scale.copy(data.to);
      });
    }
  });