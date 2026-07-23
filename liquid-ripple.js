(function() {
    'use strict';

    const vertexShaderSrc = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            v_uv.y = 1.0 - v_uv.y; // Flip Y for WebGL
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSrc = `
        precision mediump float;
        uniform sampler2D u_image;
        uniform vec2 u_mouse;
        uniform float u_time;
        uniform float u_hover; // 0.0 to 1.0
        uniform vec2 u_res;
        varying vec2 v_uv;

        void main() {
            vec2 uv = v_uv;
            
            // Adjust mouse to aspect ratio
            vec2 mouse = u_mouse;
            vec2 pos = uv;
            
            float aspect = u_res.x / u_res.y;
            pos.x *= aspect;
            mouse.x *= aspect;
            
            // Calculate distance to mouse
            float dist = distance(pos, mouse);
            
            // Liquid ripple math: sine wave radiating outward
            float ripple = sin(dist * 40.0 - u_time * 8.0) * exp(-dist * 8.0);
            
            // Add displacement
            vec2 offset = normalize(pos - mouse) * ripple * 0.03 * u_hover;
            
            // Mask the effect so it only happens near the mouse
            float mask = smoothstep(0.4, 0.0, dist);
            
            // Fetch pixel with offset
            vec4 color = texture2D(u_image, uv + (offset * mask));
            
            // Mix original image color with ripple shadow/highlight for depth
            float light = (ripple * mask) * 0.5 * u_hover;
            color.rgb += light;
            
            gl_FragColor = color;
        }
    `;

    function compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createRippleEffect(container, img) {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'liquid-canvas';
        container.appendChild(canvas);

        const gl = canvas.getContext('webgl', { antialias: false, alpha: true });
        if (!gl) return;

        // Compile shaders
        const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Geometry (full screen quad)
        const vertices = new Float32Array([
            -1, -1,  1, -1,  -1, 1,
            -1,  1,  1, -1,   1, 1
        ]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
        const uTimeLoc  = gl.getUniformLocation(program, 'u_time');
        const uHoverLoc = gl.getUniformLocation(program, 'u_hover');
        const uResLoc   = gl.getUniformLocation(program, 'u_res');
        
        gl.uniform2f(uMouseLoc, 0.5, 0.5);
        gl.uniform1f(uHoverLoc, 0.0);

        // Texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        // Wait for image to load before binding texture
        if (img.complete && img.naturalWidth !== 0) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        } else {
            img.addEventListener('load', () => {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            });
        }

        // State
        let mouseX = 0.5, mouseY = 0.5;
        let targetHover = 0;
        let currentHover = 0;
        let startTime = performance.now();
        let animationFrameId = null;

        function resize() {
            const rect = img.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            // Match canvas size to image exact visual size
            canvas.style.top = (rect.top - containerRect.top) + 'px';
            canvas.style.left = (rect.left - containerRect.left) + 'px';
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uResLoc, canvas.width, canvas.height);
        }
        
        window.addEventListener('resize', resize);
        resize(); // initial size

        function render() {
            const time = (performance.now() - startTime) / 1000;
            
            // Smoothly interpolate hover state for seamless transition
            currentHover += (targetHover - currentHover) * 0.1;
            
            gl.uniform1f(uTimeLoc, time);
            gl.uniform1f(uHoverLoc, currentHover);
            
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            
            // Only continue rendering if the effect is active or fading out
            if (currentHover > 0.01 || targetHover > 0) {
                animationFrameId = requestAnimationFrame(render);
            } else {
                animationFrameId = null;
                canvas.style.opacity = 0; // hide fully when stopped
            }
        }

        // Events
        container.addEventListener('mouseenter', () => {
            targetHover = 1;
            canvas.style.opacity = 1;
            if (!animationFrameId) render();
        });

        container.addEventListener('mousemove', (e) => {
            const rect = img.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = 1.0 - ((e.clientY - rect.top) / rect.height); // WebGL Y is inverted
            gl.uniform2f(uMouseLoc, mouseX, mouseY);
        });

        container.addEventListener('mouseleave', () => {
            targetHover = 0;
        });
    }

    // Initialize on all hanging gallery images
    document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.hanging-item .image-card');
        cards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                // Ensure card is positioned so canvas can overlay perfectly
                card.style.position = 'relative';
                card.style.overflow = 'hidden'; // clip canvas to border radius
                createRippleEffect(card, img);
            }
        });
    });
})();
