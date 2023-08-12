precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vUv;

void main() {
  vec4 texture = texture2D(uTexture, vUv);

  gl_FragColor = texture;
  gl_FragColor.a = uAlpha;
}
