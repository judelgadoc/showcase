// Fragment shader
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture;
uniform int maskType;
uniform vec2 mouse;
uniform float uResolutionX;
uniform float uResolutionY;

varying vec2 vTexCoord;

void main() {
  vec4 color = texture2D(uTexture, vTexCoord);
  
  // Apply the selected mask
  if (maskType == 1) {
    // Black and White mask
    float gray = (color.r + color.g + color.b) / 3.0;
    gl_FragColor = vec4(gray, gray, gray, 1.0);
  } else if (maskType == 2) {
    // Blur mask
    vec4 sum = vec4(0.0);
    int kernelSize = 9;
    float kernel[9];
    kernel[0] = 1.0 / 16.0;
    kernel[1] = 2.0 / 16.0;
    kernel[2] = 1.0 / 16.0;
    kernel[3] = 2.0 / 16.0;
    kernel[4] = 4.0 / 16.0;
    kernel[5] = 2.0 / 16.0;
    kernel[6] = 1.0 / 16.0;
    kernel[7] = 2.0 / 16.0;
    kernel[8] = 1.0 / 16.0;

    vec2 texCoord = vTexCoord;
    vec2 texOffset = 1.0 / vec2(uResolutionX, uResolutionY);

    sum += texture2D(uTexture, texCoord + vec2(-1.0, -1.0) * texOffset) * kernel[0];
    sum += texture2D(uTexture, texCoord + vec2(0.0, -1.0) * texOffset) * kernel[1];
    sum += texture2D(uTexture, texCoord + vec2(1.0, -1.0) * texOffset) * kernel[2];
    sum += texture2D(uTexture, texCoord + vec2(-1.0, 0.0) * texOffset) * kernel[3];
    sum += texture2D(uTexture, texCoord + vec2(0.0) * texOffset) * kernel[4];
    sum += texture2D(uTexture, texCoord + vec2(1.0, 0.0) * texOffset) * kernel[5];
    sum += texture2D(uTexture, texCoord + vec2(-1.0, 1.0) * texOffset) * kernel[6];
    sum += texture2D(uTexture, texCoord + vec2(0.0, 1.0) * texOffset) * kernel[7];
    sum += texture2D(uTexture, texCoord + vec2(1.0, 1.0) * texOffset) * kernel[8];
    
    gl_FragColor = sum;
  } else if (maskType == 3) {
    // Blur mask, sum(kernel) > 100%
    vec4 sum = vec4(0.0);
    int kernelSize = 9;
    float kernel[9];
    kernel[0] = 1.0 / 9.0;
    kernel[1] = 1.0 / 9.0;
    kernel[2] = 1.0 / 9.0;
    kernel[3] = 1.0 / 9.0;
    kernel[4] = 2.0 / 9.0;
    kernel[5] = 1.0 / 9.0;
    kernel[6] = 1.0 / 9.0;
    kernel[7] = 1.0 / 9.0;
    kernel[8] = 1.0 / 9.0;

    vec2 texCoord = vTexCoord;
    vec2 texOffset = 1.0 / vec2(uResolutionX, uResolutionY);

    sum += texture2D(uTexture, texCoord + vec2(-1.0, -1.0) * texOffset) * kernel[0];
    sum += texture2D(uTexture, texCoord + vec2(0.0, -1.0) * texOffset) * kernel[1];
    sum += texture2D(uTexture, texCoord + vec2(1.0, -1.0) * texOffset) * kernel[2];
    sum += texture2D(uTexture, texCoord + vec2(-1.0, 0.0) * texOffset) * kernel[3];
    sum += texture2D(uTexture, texCoord + vec2(0.0) * texOffset) * kernel[4];
    sum += texture2D(uTexture, texCoord + vec2(1.0, 0.0) * texOffset) * kernel[5];
    sum += texture2D(uTexture, texCoord + vec2(-1.0, 1.0) * texOffset) * kernel[6];
    sum += texture2D(uTexture, texCoord + vec2(0.0, 1.0) * texOffset) * kernel[7];
    sum += texture2D(uTexture, texCoord + vec2(1.0, 1.0) * texOffset) * kernel[8];
    
    gl_FragColor = sum;
  }
  else if (maskType == 4) {
    // Blur mask, sum(kernel) < 100%
    vec4 sum = vec4(0.0);
    int kernelSize = 9;
    float kernel[9];
    kernel[0] = 0.8 / 9.0;
    kernel[1] = 0.8 / 9.0;
    kernel[2] = 0.8 / 9.0;
    kernel[3] = 0.8 / 9.0;
    kernel[4] = 2.0 / 9.0;
    kernel[5] = 0.8 / 9.0;
    kernel[6] = 0.8 / 9.0;
    kernel[7] = 0.8 / 9.0;
    kernel[8] = 0.8 / 9.0;

    vec2 texCoord = vTexCoord;
    vec2 texOffset = 1.0 / vec2(uResolutionX, uResolutionY);

    sum += texture2D(uTexture, texCoord + vec2(-1.0, -1.0) * texOffset) * kernel[0];
    sum += texture2D(uTexture, texCoord + vec2(0.0, -1.0) * texOffset) * kernel[1];
    sum += texture2D(uTexture, texCoord + vec2(1.0, -1.0) * texOffset) * kernel[2];
    sum += texture2D(uTexture, texCoord + vec2(-1.0, 0.0) * texOffset) * kernel[3];
    sum += texture2D(uTexture, texCoord + vec2(0.0) * texOffset) * kernel[4];
    sum += texture2D(uTexture, texCoord + vec2(1.0, 0.0) * texOffset) * kernel[5];
    sum += texture2D(uTexture, texCoord + vec2(-1.0, 1.0) * texOffset) * kernel[6];
    sum += texture2D(uTexture, texCoord + vec2(0.0, 1.0) * texOffset) * kernel[7];
    sum += texture2D(uTexture, texCoord + vec2(1.0, 1.0) * texOffset) * kernel[8];
    
    gl_FragColor = sum;
  } else if (maskType == 5) {
    // Negative reverse color
    gl_FragColor = vec4(1.0 - color.rgb, color.a);
  } else if (maskType == 6) {
    // Sepia mask
   float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 sepiaColor = vec3(
      gray * 1.2,
      gray * 0.95,
      gray * 0.82
    );
    gl_FragColor = vec4(sepiaColor, color.a);
  } else if (maskType == 0)  {
    gl_FragColor = color;
  }
}

