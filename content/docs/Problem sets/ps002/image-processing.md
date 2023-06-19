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

Inicialmente, planeamos hacer un app que cargue una imagen y realice cuatro acciones con shaders. Tres máscaras y un efecto lupa encima de esas máscaras. No obstante encontramos dificultades, por lo tanto, el resultado final resultó siendo dos apps diferentes. Una con las tres máscaras y otra con la lupa, en este reporte mostraremos el proceso creativo que nos llevó a este resultado.

## Antecedentes

La hoja de ruta que planteamos inicialmente era 

1. Hacer una app de máscaras por separado usando shaders
2. Hacer una app de lupa por separado usando shaders
3. Integrar las dos apps en una sola

### Antecedentes de máscaras

<!-- https://visualcomputing.github.io/docs/shaders/image_processing/#image-processing -->

Lo primero que hicimos fue revisar el ejemplo más simple que tuviéramos a la mano, en este caso el app del profesor de procesamiento de imágenes[^1]. El ejemplo del profe es una máscara de convolución de matrices sencilla, perfecto para nuestro objetivo de investigar antecedentes.

{{< details "Fragment shader del profesor" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/profe-mask.frag" class="language-js line-numbers"></pre>
{{< /details >}}

El profesor publica abiertamente el fragment shader de su app, pero el código no aparece directamente, después de hacer ingeniería inversa y entender el fragment shader, solo faltaba tener una idea del código en P5js.


#### Recuperando el código fuente
Conocemos dos métodos para recuperar el código del profesor directamente desde su página.

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
{{< details "Código (sketch) del profesor" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/profe-sketch.js" class="language-js line-numbers"></pre>
{{< /details >}}

Nótese como la lógica del cambio entre la máscara y la imagen original se encuentra ubicada en el sketch.

#### Definiciones matemáticas de los efectos

<!-- https://sci-hub.se/10.1109/IHMSC.2016.201 -->

Con el marco de trabajo para el código y el fragment shader en su lugar, solo falta incorporar las máscaras en sí.

Para lograr el efecto de blanco y negro, se puede utilizar un método tradicional ampliamente conocido llamado "Line projection", el cual ha sido utilizado en programas reconocidos a nivel mundial como Matlab o GIMP.

Este método, según un artículo de la Universidad de Lanzhou (兰州大学)[^2], permite convertir una imagen a escala de grises al proyectar los valores de los píxeles a lo largo de una línea predeterminada. El resultado es una imagen en blanco y negro que conserva detalles importantes.

{{< katex display >}}
I = \alpha_r R + \alpha_g G + \alpha_b B
{{< /katex >}}

También ofrecen otros métodos alternativos de su autoría, pero nosotros usaremos el tradicional con {{< katex >}}(\alpha_r, \alpha_g, \alpha_b) = (1/3, 1/3, 1/3) {{</ katex >}}, es decir

{{< katex display >}}
grayscale = \frac{R + G + B}{3}
{{< /katex >}}

Para el efecto borroso hacemos una convolución de matriz 3x3, donde el nivel de borrosidad depende de los pesos que asignemos al kernel.

Para el efecto negativo sencillamente le restamos a 1 cada componente de color, es decir

{{< katex display >}}
    R_{negative} = 1 - R \\
    G_{negative} = 1 - G \\
    B_{negative} = 1 - B 
{{< /katex >}}

### Antecedentes de lupa

<!-- https://happycoding.io/tutorials/p5js/images#getting-pixels -->

Intentamos encontrar efectos de lupa usando shaders, pero ninguno de los códigos que encontramos en nuestra investigación parecía compatible con nuestros navegadores, por lo tanto, decidimos intentar buscar una versión que no utilizara shaders. 

Encontramos un código muy interesante [^3], el cual consistía en un amplificador de píxeles.

{{< details "Amplificador de pixeles" >}}
<iframe src="https://toolness.github.io/p5.js-widget/p5-widget.html?id=6&amp;previewWidth=300&amp;baseSketchURL=https%3A%2F%2Fhappycoding.io%2Ftutorials%2Fp5js%2Fnull&amp;p5version=1.0.0&amp;sketch=%0Alet%20img%3B%0A%0Afunction%20setup()%20%7B%0A%20%20createCanvas(300%2C%20300)%3B%0A%20%20img%20%3D%20loadImage('https%3A%2F%2Fhappycoding.io%2Fimages%2Fstanley-1.jpg')%3B%0A%7D%0A%0Afunction%20draw()%20%7B%0A%20%20image(img%2C%200%2C%200)%3B%0A%0A%20%20%2F%2F%20Get%20the%20color%20at%20the%20mouse%20position%0A%20%20let%20c%20%3D%20img.get(mouseX%2C%20mouseY)%3B%0A%0A%20%20%2F%2F%20Change%20the%20fill%20to%20that%20color%0A%20%20fill(c)%3B%0A%0A%20%20%2F%2F%20Draw%20a%20square%20with%20that%20color%0A%20%20square(mouseX%2C%20mouseY%2C%2050)%3B%0A%7D%0A" style="width: 100%; background-color: white; border: 1px solid #ec245e; box-sizing: border-box; min-height: 380px"></iframe>
{{< /details >}}

Entendimos que con algunas modificaciones, podría servir como la lupa que necesitábamos. Por ejemplo, cambiar el rectángulo para que muestre el conjunto de píxeles alrededor del mouse, en lugar de un solo pixel.

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

La lupa se activa al hacer hover en la imagen.

{{< p5-iframe sketch="/visualcomputing/sketches/ps002/image-processing/glass.js" ver="1.6.0" width="720" height="724" >}}

### Combinación

Al hacer hover toda la imagen queda donde debería estar la lupa, los controles de teclado para el cambio de máscara siguen funcionando.

{{< p5-iframe sketch="/visualcomputing/sketches/ps002/image-processing/merge.js" ver="1.6.0" width="720" height="724" >}}

## Código

### Máscaras

Inicialmente, la textura no se ajustaba correctamente al canvas, posiblemente al usar un canvas tipo WebGL el comportamiento de las funciones cambiaban, por lo tanto, utilizamos el vertex shader para ajustar la geometría de la textura.

{{< details "Vertex shader de las máscaras" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/shader.vert" class="language-js line-numbers"></pre>
{{< /details >}}

Durante la implementación del efecto borroso, se cometió un error al modificar los pesos del kernel. Se observó que si la suma total de los pesos del kernel es mayor a 1.0, la máscara resultante muestra un mayor brillo. De manera similar, si la suma de los pesos es menor a 1.0, la máscara tiende a ser más oscura.

Para evidenciar esta diferencia, se incluyeron tres máscaras de efecto borroso con características distintas:

1. Suma de pesos del kernel igual a 1.0: Esta máscara aplica un blur estándar a la imagen, conservando un nivel de brillo equilibrado.

2. Suma de pesos del kernel mayor a 1.0: Esta máscara produce un efecto de blur más brillante, ya que los píxeles adquieren valores superiores al aplicarse la máscara.

3. Suma de pesos del kernel menor a 1.0: Esta máscara genera un blur más oscuro, dado que los píxeles se ven afectados por valores inferiores al aplicarse la máscara.

Al experimentar con estas diferentes máscaras de blur, se puede apreciar cómo varían los efectos visuales en función de la suma total de los pesos del kernel utilizado.

{{< details "Fragment shader de las máscaras" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/shader.frag" class="language-js line-numbers"></pre>
{{< /details >}}

Al contrario de lo que aprendimos con el código del profesor, nosotros optamos por implementar la lógica del cambio de máscara directamente en el fragment shader por medio de un condicional sencillo.

La razón de ser de esta decisión es simplificar en gran medida el código del sketch, puesto que solo tiene que leer un shader y darle valores a sus variables uniformes, que son

1. `uResolutionX` y `uResolutionY`: Tamaño del canvas
2. `maskType`: Tipo de máscara (para el condicional)
3. `uTexture`: Imágen

La ventaja de esta aproximación es que es bastante modular, lo que nos permite agregar más máscaras indiscriminadamente, y los únicos cambios que toca realizar son agregar una ramificación en el condicional del shader y otra en el condicional que se encuentra en la función `switchMask` del sketch.

<!-- https://chat.openai.com/share/75e3125f-baf7-4381-b49f-263fc86c00e3 -->

De hecho, el efecto de sepia que se incorporó previo a este informe fue generado con la ayuda de ChatGPT. Se le proporcionó intencionalmente un contexto limitado para demostrar la facilidad con la que se pueden agregar nuevos efectos[^4].

Al limitar el contexto proporcionado al modelo de ChatGPT, se buscó mostrar cómo incluso con información limitada, es posible obtener resultados satisfactorios al agregar efectos visuales como el sepia. Esta demostración destaca la capacidad del modelo para comprender y aplicar instrucciones específicas, brindando flexibilidad en la implementación de nuevos efectos sin requerir un conocimiento detallado del proceso subyacente.

{{< details "Código (sketch) de las máscaras" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/masks.js" class="language-js line-numbers"></pre>
{{< /details >}}

### Lupa

{{< details "Código (sketch) de la lupa" >}}
<pre data-src="/visualcomputing/sketches/ps002/image-processing/glass.js" class="language-js line-numbers"></pre>
{{< /details >}}

## Conclusiones

Combinar una lupa que no utiliza shaders no es fácil, puesto que el shader de la app de máscaras se aplica a la geometría, por eso toda la imagen se aplica en la parte de la lupa, en la parte de la combinación.

## Trabajo futuro

Hay varias oportunidades de modificación que no abarcamos en este trabajo

1. Tal vez P5js tenga alguna como textMode(NORMAL) que permita modificar la geometría, simplificando un poco el código del vertex shader.
2. Implementar exitosamente la app de lupa con shaders podría simplificar la combinación de las dos apps, tal vez sea posible implementar directamente lo que tenemos con un poco más de esfuerzo
3. Podemos aprovechar la modularidad de nuestro shader para agregar más efectos como Vignette, X-ray entre otros
4. El método de Line projection nos permite tomar distintos pesos en los {{< katex >}}\alpha{{</ katex >}}, por ejemplo, inspirados en un workshop de la Universidad de Stanford[^5], creemos que se puede lograr un tinte azul si aumentamos el peso de {{< katex >}}\alpha_b{{</ katex >}} 1.2 veces
5. Actualmente las máscaras de blur tienen sus parámetros fijos en la definición del shader, pero en un futuro se podría hacer de tal forma que se pueda cambiar los pesos del kernel dinámicamente, ojalá sin disminuir demasiado la naturaleza modular de nuestro trabajo. 

## Referencias

[^1]: Image Processing | Visual Computing. https://visualcomputing.github.io/docs/shaders/image_processing/. Accessed 10 June 2023.
[^2]: Wan, Yi, and Qisong Xie. “A Novel Framework for Optimal RGB to Grayscale Image Conversion.” 2016 8th International Conference on Intelligent Human-Machine Systems and Cybernetics (IHMSC), IEEE, 2016, pp. 345–48. DOI.org (Crossref), https://doi.org/10.1109/IHMSC.2016.201.
[^3]: “Images in P5.Js.” Happy Coding, 16 Nov. 2020, https://happycoding.io/tutorials/p5js/images#getting-pixels.
[^4]: “Add Sepia Mask.” ChatGPT, https://chat.openai.com/share/75e3125f-baf7-4381-b49f-263fc86c00e3. Accessed 19 June 2023.
[^5]: CS101 Introduction to Computing Principles. https://web.stanford.edu/class/cs101/image-6-grayscale-adva.html. Accessed 19 June 2023.