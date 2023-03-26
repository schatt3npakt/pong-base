AFRAME.registerComponent('canvas-updater', {
  dependencies: ['geometry', 'material'],

  init: function () {
    var el = this.el;
    var material;

    material = el.getObject3D('mesh').material;
    if (!material.map) { return; }
    material.map.needsUpdate = true;

    window.setTimeout(() => {
      this.init();
    }, 10)
  }
});