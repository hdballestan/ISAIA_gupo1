# Correccion: Procesamiento client-side de documentos — sin S3 temporal

## Decision
Los documentos subidos por el ciudadano (PDF, TXT, MD, imagenes) se procesan
exclusivamente en el navegador. Ningun archivo es transmitido ni almacenado
en el servidor. Solo el texto extraido o el base64 de la imagen viajan al API.

## Razon
Ley 1581/2012 (Habeas Data): principios de minimizacion y finalidad.
Almacenar documentos en S3, aunque sea temporalmente, implica tratar datos
personales del ciudadano fuera de su dispositivo sin necesidad tecnica real.

## Implementacion
- PDF / TXT / MD: extraccion de texto en el navegador con pdf.js u equivalente.
- Imagenes: conversion a base64 en el navegador.
- El API recibe `{ text | base64, mimeType }` — nunca un archivo.
- Limitacion conocida: payload maximo 6MB por API Gateway; documentos grandes
  deben ser trocados en el cliente antes de enviar.

## Impacto en arquitectura
- Eliminar contenedor S3 temporal de diagramas C4 y de infra.
- Actualizar secuencia de extraccion: remover pasos de guardado y eliminacion.
- Actualizar RNF-10, tabla de seguridad y trade-offs.
- El componente DocumentExtractor en Lambda recibe payload en memoria; no
  interactua con S3.

## Aplicar este criterio a futuras revisiones
Si en cualquier entrega aparece almacenamiento server-side de contenido
generado por el usuario que no sea estrictamente necesario para la funcionalidad
principal, cuestionar si cumple minimizacion de datos antes de aceptarlo.
