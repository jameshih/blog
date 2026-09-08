import * as THREE from '../vendor/three-r180/three.module.min.js';
import { STLLoader } from '../vendor/three-r180/STLLoader.js';
import { OrbitControls } from '../vendor/three-r180/OrbitControls.js';

export class STLViewer {
  constructor(element) {
    this.element = element;
    this.stage = element.querySelector('.stl-viewer__stage');
    this.status = element.querySelector('[role="status"]');
    this.toolbar = element.querySelector('.stl-viewer__controls');
    this.frame = null;
    this.visible = false;
    this.failed = false;
    this.toolbar.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (button) this.move(button.dataset.action);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.frame);
        this.frame = null;
      } else {
        this.requestRender();
      }
    });
  }

  message(state, text) {
    this.element.dataset.state = state;
    this.status.textContent = text;
    this.status.hidden = state === 'ready';
    this.stage.setAttribute('aria-busy', String(state === 'loading'));
  }

  async loadGeometry() {
    const url = new URL(this.element.dataset.stlSrc, location.href);
    if (url.origin !== location.origin) throw new Error('Expected a local STL');
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`STL request failed: ${response.status}`);
    const geometry = new STLLoader().parse(await response.arrayBuffer());
    try {
      const positions = geometry.getAttribute('position');
      if (!positions || positions.count === 0 || positions.count % 3 !== 0 ||
          !positions.array.every(Number.isFinite)) throw new Error('Invalid STL vertices');
      // STL models use Z up. Center and normalize units before fitting the camera.
      geometry.rotateX(-Math.PI / 2);
      geometry.center();
      geometry.computeBoundingSphere();
      const radius = geometry.boundingSphere.radius;
      if (!Number.isFinite(radius) || radius <= 0) throw new Error('Empty STL bounds');
      geometry.scale(1 / radius, 1 / radius, 1 / radius);
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      return geometry;
    } catch (error) {
      geometry.dispose();
      throw error;
    }
  }

  async setVisible(visible) {
    this.visible = visible;
    if (!visible) {
      this.suspend();
      return;
    }
    if (this.failed || this.renderer) return;
    this.message('loading', 'Loading 3D preview…');
    try {
      // Retain the small CPU geometry; recreate only visible GPU resources.
      this.loading ||= this.loadGeometry();
      this.geometry = await this.loading;
      if (!this.visible || this.renderer || this.failed) return;
      this.activate();
      this.message('ready', '3D preview ready.');
    } catch (error) {
      this.fail();
    }
  }

  activate() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0xf5f5f5);
    const canvas = this.renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${this.element.querySelector('figcaption').textContent}: interactive 3D model`);
    canvas.setAttribute('aria-describedby', this.element.querySelector('.stl-viewer__help').id);
    this.events = new AbortController();
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      this.fail();
    }, { signal: this.events.signal });
    canvas.addEventListener('keydown', event => {
      const action = {
        ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
        '+': 'in', '=': 'in', '-': 'out', Home: 'reset'
      }[event.key];
      if (!action) return;
      event.preventDefault();
      this.move(action);
    }, { signal: this.events.signal });
    this.stage.append(canvas);
    this.scene = new THREE.Scene();
    this.material = new THREE.MeshStandardMaterial({
      color: 0x929ca7, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide
    });
    this.scene.add(new THREE.Mesh(this.geometry, this.material));
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x727782, 2.4));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(3, 4, 5);
    this.scene.add(light);
    this.camera = new THREE.PerspectiveCamera(35, 1.5, 0.01, 100);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;
    // No damping or auto-rotation: a static preview consumes no animation loop.
    this.controls.addEventListener('change', () => this.requestRender());
    this.fitDistance = null;
    this.resize();
    if (this.savedPosition) {
      this.camera.position.copy(this.savedPosition);
      this.controls.update();
    }
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.stage);
    this.toolbar.hidden = false;
    this.requestRender();
  }

  resize() {
    if (!this.renderer) return;
    const width = this.stage.clientWidth;
    const height = this.stage.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    const halfFov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const limitingFov = Math.min(halfFov, Math.atan(Math.tan(halfFov) * this.camera.aspect));
    const distance = 1.15 / Math.sin(limitingFov);
    this.controls.minDistance = 1.05;
    this.controls.maxDistance = distance * 5;
    if (this.fitDistance) this.camera.position.multiplyScalar(distance / this.fitDistance);
    else this.camera.position.set(1, 0.8, 1.3).normalize().multiplyScalar(distance);
    this.fitDistance = distance;
    this.controls.update();
    this.requestRender();
  }

  move(action) {
    if (!this.controls) return;
    const orbit = new THREE.Spherical().setFromVector3(this.camera.position);
    if (action === 'left') orbit.theta -= Math.PI / 12;
    if (action === 'right') orbit.theta += Math.PI / 12;
    if (action === 'up') orbit.phi -= Math.PI / 12;
    if (action === 'down') orbit.phi += Math.PI / 12;
    if (action === 'in') orbit.radius /= 1.2;
    if (action === 'out') orbit.radius *= 1.2;
    orbit.radius = THREE.MathUtils.clamp(orbit.radius, this.controls.minDistance, this.controls.maxDistance);
    orbit.makeSafe();
    this.camera.position.setFromSpherical(orbit);
    if (action === 'reset') {
      this.camera.position.set(1, 0.8, 1.3).normalize().multiplyScalar(this.fitDistance);
    }
    this.controls.update();
    this.requestRender();
  }

  requestRender() {
    if (this.frame !== null || !this.renderer || !this.visible || document.hidden) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      if (this.renderer && this.visible) this.renderer.render(this.scene, this.camera);
    });
  }

  suspend() {
    cancelAnimationFrame(this.frame);
    this.frame = null;
    this.resizeObserver?.disconnect();
    this.events?.abort();
    if (this.camera) this.savedPosition = this.camera.position.clone();
    this.controls?.dispose();
    this.controls = null;
    this.geometry?.dispose();
    this.material?.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement.remove();
      this.renderer = null;
    }
    this.scene = null;
    this.toolbar.hidden = true;
    if (!this.failed) this.message('paused', '3D preview loads when in view.');
  }

  fail() {
    this.failed = true;
    this.suspend();
    this.message('error', 'The 3D preview could not load. Please download the STL below.');
  }
}
