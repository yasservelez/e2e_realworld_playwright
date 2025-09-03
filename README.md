# Pruebas E2E para Conduit (RealWorld App)

Este proyecto contiene pruebas automatizadas de extremo a extremo (E2E) para la aplicación de ejemplo [Conduit](https://react-redux.realworld.io/), una implementación del proyecto RealWorld.

## Aplicación Bajo Prueba

Los tests están configurados para ejecutarse contra la **demo pública** de la aplicación:

- **URL:** `https://react-redux.realworld.io/`

## Stack Tecnológico

- **Lenguaje:** TypeScript
- **Framework:** Playwright

## Cómo Empezar

### 1. Prerrequisitos

- Necesitas tener [Node.js](https://nodejs.org/) instalado.

### 2. Instalación

1. Clona este repositorio.
2. Muévete al directorio del proyecto.
   ```bash
   cd e2e-tests
   ```
3. Instala las dependencias de npm.
   ```bash
   npm install
   ```

## Cómo Ejecutar los Tests

Para lanzar la suite de pruebas completa en modo headless (sin que se abra un navegador visible), usa el siguiente comando:

```bash
npx playwright test
```

Si quieres ver los tests ejecutándose en un navegador, puedes usar el modo "headed":

```bash
npx playwright test --headed
```

## Reportes de Pruebas

Después de cada ejecución, Playwright genera un reporte HTML interactivo donde puedes explorar cada test, sus pasos y eventuales errores.

Para abrir el último reporte generado, ejecuta:

```bash
npx playwright show-report
```
