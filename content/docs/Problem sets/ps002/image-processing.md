---
title: Procesamiento de imágenes
---
# Ejercicio
{{< hint info >}}
Implement an image / video processing app supporting different masks, including other kernel sizes different than 3x3, and:

- A region-of-interest base tool to selectively apply a given mask.Hint: circular regions around the mouse pointer are handy and quite simple to implement by means of glsl distance.
- A magnifier tool. Requires a bit of research. For instance, look for it in shadertoy.
- Integrate luma and other coloring brightness tools.
- What other shader tools would you implement?
{{< /hint >}}

## Introducción

Inicialmente planeamos hacer un app que cargue una imagen y realice cuatro acciones con shaders. Tres máscaras y un efecto lupa encima de esas máscaras. No obstante encontramos dificultades, por lo tanto el resultado final resultó siendo dos app diferentes. Una con las trés máscaras y otra con la lupa, en este reporte mostraremos el proceso creativo que nos llevó a este resultado.

## Antecedentes

La hoja de ruta que planteamos inicialmente era 

1. Hacer una app de máscaras por separado usando shaders
2. Hacer una app de lupa por separado usando shaders
3. Integrar las dos apps en una sola

### Antecedentes de máscaras

<!-- https://visualcomputing.github.io/docs/shaders/image_processing/#image-processing -->

Lo primero que hicimos fue revisar el ejemplo más simple que tuvieramos a la mano, en este caso el app del profesor de procesamiento de imágenes. El ejemplo del profe es una máscara de convolución de matrices sencilla, perfecto para nuestro objetivo de investigar antecedentes.

{{< details "Fragment shader del profesor" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/profe-mask.frag" class="language-js line-numbers"></pre>
{{< /details >}}

El profesor publica abiertamente el fragment shader de su app, pero el código no aparece directamente, después de hacer ingeniería inversa y entender el dragment shader, solo faltaba tener una idea del código en P5js.


#### Recuperando el código fuente
Conocemos dos métodos para recuperar el código del profesor directamente desde su página

- Investigar las fuentes de la página
    1. Abrir las herramientas de desarrollo
    2. Recargar la página
    3. Ir a la pestaña de fuentes (Sources)
    4. Buscar el archivo .js que corresponda al sketch de la app

<video controls autoplay loop muted width="720" height="480">
    <source src="/visualcomputing/sketches/ps002/image-processing/method01.webm" type='video/mp4'>
</video>

- Investigar el tráfico de red de la página
    1. Abrir las herramientas de desarrollo
    2. Recargar la página
    3. Ir a la pestaña de red (Network)
    4. La petición que contenga el archivo .js que corresponda al sketch de la app

<video controls autoplay loop muted width="720" height="480">
    <source src="/visualcomputing/sketches/ps002/image-processing/method02.webm" type='video/mp4'>
</video>

Gracias a esos pasos podemos conseguir el código fuente para analizar mejor la app
{{< details "Código del profesor" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/profe-sketch.js" class="language-js line-numbers"></pre>
{{< /details >}}

Nótese como la lógica del cambio entre la máscara y la imagen original se encuentra ubicada en el sketch.

### Antecedentes de lupa

<!-- https://happycoding.io/tutorials/p5js/images#getting-pixels -->

Intentamos encontrar efectos de lupa usando shaders, pero ninguno de los códigos que encontramos en nuestra investigación parecía compatible con nuestros navegadores, por lo tanto decidimos intentar buscar una versión que no utilizara shaders. 

Encontramos un código muy interesante, el cual consistía en un amplificador de pixeles

{{< details "Amplificador de pixeles" >}}
<iframe src="https://toolness.github.io/p5.js-widget/p5-widget.html?id=6&amp;previewWidth=300&amp;baseSketchURL=https%3A%2F%2Fhappycoding.io%2Ftutorials%2Fp5js%2Fnull&amp;p5version=1.0.0&amp;sketch=%0Alet%20img%3B%0A%0Afunction%20setup()%20%7B%0A%20%20createCanvas(300%2C%20300)%3B%0A%20%20img%20%3D%20loadImage('https%3A%2F%2Fhappycoding.io%2Fimages%2Fstanley-1.jpg')%3B%0A%7D%0A%0Afunction%20draw()%20%7B%0A%20%20image(img%2C%200%2C%200)%3B%0A%0A%20%20%2F%2F%20Get%20the%20color%20at%20the%20mouse%20position%0A%20%20let%20c%20%3D%20img.get(mouseX%2C%20mouseY)%3B%0A%0A%20%20%2F%2F%20Change%20the%20fill%20to%20that%20color%0A%20%20fill(c)%3B%0A%0A%20%20%2F%2F%20Draw%20a%20square%20with%20that%20color%0A%20%20square(mouseX%2C%20mouseY%2C%2050)%3B%0A%7D%0A" style="width: 100%; background-color: white; border: 1px solid #ec245e; box-sizing: border-box; min-height: 380px"></iframe>
{{< /details >}}

Entendimos que con algunas modificaciones, podría servir como la lupa que necesitabamos. Por ejemplo cambiar el rectángulo para que muestre el conjunto de pixeles alrededor del mouse, en lugar de un solo pixel.

## Consideraciones

### Máscaras

Al momento de implementar decidimos agregar más máscaras, actualmente los efectos visuales que aplicamos usando máscaras son

1. Blanco y negro
2. Borroso (blur)
3. Negativo
4. Sepia

La siguiente tabla muestra un manual de usuario de la app de máscaras, lo que toca hacer es presionar una tecla como lo indica la tabla dependiendo de la máscara que se desee aplicar.

| Efecto                                                        | Tecla |
|---------------------------------------------------------------|-------|
| Blanco y negro                                                |   1   |
| Borroso                                                       |   2   |
| Borroso brillante                                             |   3   |
| Borroso oscuro                                                |   4   |
| Negativo                                                      |   5   |
| Sepia                                                         |   6   |
| Original                                                      |   0   |

{{< p5-iframe sketch="/visualcomputing/sketches/ps002/image-processing/masks.js" ver="1.6.0" width="720" height="724" >}}

### Lupa

La lupa se activa al hacer hover en la imagen

{{< p5-iframe sketch="/visualcomputing/sketches/ps002/image-processing/glass.js" ver="1.6.0" width="720" height="724" >}}

### Combinación

{{< p5-iframe sketch="/visualcomputing/sketches/ps002/image-processing/merge.js" ver="1.6.0" width="720" height="724" >}}

## Código

### Máscaras

{{< details "Vertex shader de las máscaras" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/shader.vert" class="language-js line-numbers"></pre>
{{< /details >}}

{{< details "Fragment shader de las máscaras" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/shader.frag" class="language-js line-numbers"></pre>
{{< /details >}}

{{< details "Código de las máscaras" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/masks.js" class="language-js line-numbers"></pre>
{{< /details >}}

### Lupa

{{< details "Código de la lupa" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/glass.js" class="language-js line-numbers"></pre>
{{< /details >}}

## Conclusiones

Hipotesis de por qué no funcionó algo

## Trabajo futuro

Hacerlo bien :D
Agregar máscaras
Cambiar parámetros de máscaras directamente

## Referencias

