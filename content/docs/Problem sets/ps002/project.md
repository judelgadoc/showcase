---
title: Proyecto visual
---
# Interior Designer 3D: Diseño de interiores con p5.js

## Introducción

“Interior Designer 3D” es un programa en p5.js que podría permitir diseñar y visualizar interiores en 3D. Con controles intuitivos, se puede ajustar la posición de muebles, tales como una mesa, una cama y una planta de decoración, para crear nuestros propios diseños de interiores virtuales. Podría ser útil para profesionales del diseño y decoración, así como para *experimentar* con la decoración de espacios.

## Árbol de transformaciones

Un árbol de transformaciones se refiere a una estructura jerárquica donde las transformaciones se aplican a objetos o elementos de manera anidada. Cada transformación afecta al sistema de coordenadas de su padre y, a su vez, afecta a las transformaciones de sus hijos. Esta disposición jerárquica permite realizar transformaciones más complejas y organizadas en una escena o entorno gráfico.

El árbol de transformaciones de *Interior Designer 3D* es el siguiente

![Árbol de transformaciones](/visualcomputing/sketches/ps002/project/tree.jpg)

En este caso, la planta depende de la mesa en lugar del mundo

## Iluminación

En p5js hay tres modelos de luz

1. ambientLight
2. directionalLight
3. pointLight

Nosotros escogimos pointLight. El modelo pointLight emite luz desde un solo punto en todas las direcciones, creando sombras en función de la posición relativa de los objetos y la fuente de luz. La intensidad de la luz del pointLight se atenúa a medida que se aleja del punto de origen

Posición Específica: A diferencia de una luz ambiental o direccional que se aplica a toda la escena, el pointLight tiene una posición específica en el espacio 3D. Esto permite crear efectos de iluminación localizados y resaltar áreas específicas de la escena. Nosotros lo consideramos más realista y adecuado para nuestro proyecto, por ejemplo cuando se trata de habitaciones muy grandes, puesto que el comportamiento esperado en este caso es de atenuación.

## Ejecución

{{< p5-iframe sketch="/visualcomputing/sketches/ps002/project/sketch.js" ver="1.6.0" width="754" height="444" >}}

## Código

{{< details "Código (sketch)" >}}
<pre data-src="/visualcomputing/sketches/ps002/project/sketch.js" class="language-js line-numbers"></pre>
{{< /details >}}

## Conclusiones

Las aplicaciones gráficas pueden tener utilidad para diversos aspectos de la vida no necesariamente relacionados con la computación, nuestro proyecto es un ejemplo de una aplicación sencilla que aprovechando algunas oportunidades de mejora puede ser útil para el diseño de interiores.

## Trabajo futuro

Tenemos algunas ideas para trabajo a futuro que no implementamos en este trabajo

1. Lograr que los muebles choquen entre sí: actualmente se pueden superponer entre sí
2. Evitar que el canvas se mueva cuando utilizamos los sliders
3. Agregar más muebles
5. Implementar diferentes geometrías para la habitación: actualmente solo es un paralelepípedo, pero en la vida real no necesariamente es un poliedro regular.

## Referencias

- “reference | p5.js.” Available: https://p5js.org/reference/. [Accessed: Jun. 19, 2023]

- “Transformaciones geométricas, materiales y módelos de iluminación utilizando p5.js,” HackMD. Available: https://hackmd.io/@dasilvaca/transformations. [Accessed: Jun. 19, 2023]

- How to Rotate Shapes in p5.js (translate, rotate, push, pop). Available: https://www.youtube.com/watch?v=o9sgjuh-CBM. [Accessed: Jun. 19, 2023]
