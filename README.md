# 📘 Portal Universitario Estudiantil

Este proyecto es una aplicación web desarrollada como portal académico estudiantil que permite consultar información escolar del alumno mediante el consumo de la API institucional del Sistema Integral de Información (SII) del Tecnológico Nacional de México campus Celaya.

El sistema permite visualizar:

- Datos personales del estudiante
- Calificaciones por materia
- Kardex académico
- Horario del semestre
- Avisos universitarios
- Panel administrativo de avisos

El objetivo del sistema es centralizar información académica relevante en una interfaz web moderna e intuitiva similar a los portales universitarios reales.

---

# 🚀 Instrucciones de instalación y ejecución

Sigue los siguientes pasos para ejecutar el proyecto localmente.

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nombre-del-repo.git
```

Entrar al proyecto:

```bash
cd nombre-del-repo
```

---

## 2️⃣ Instalar dependencias

Ejecutar:

```bash
npm install
```

Esto instalará todas las librerías necesarias del proyecto.

---

## 3️⃣ Ejecutar la aplicación

Iniciar el servidor de desarrollo con:

```bash
npm run dev
```

Después abrir en el navegador:

```
http://localhost:5173
```

---

## 4️⃣ Credenciales de acceso

Para iniciar sesión se utilizan las credenciales institucionales del estudiante proporcionadas por el Tecnológico Nacional de México campus Celaya.

---

# 🧩 Framework y tecnologías utilizadas

El sistema fue desarrollado utilizando tecnologías modernas de desarrollo frontend:

### React

React es una biblioteca de JavaScript utilizada para construir interfaces de usuario dinámicas mediante componentes reutilizables. Permite desarrollar aplicaciones web rápidas, organizadas y eficientes utilizando el Virtual DOM.

### Vite

Vite es una herramienta moderna de desarrollo frontend que permite iniciar proyectos rápidamente, ofreciendo compilaciones rápidas y recarga automática en tiempo real durante el desarrollo.

### React Router

React Router permite gestionar la navegación entre diferentes vistas dentro de la aplicación sin necesidad de recargar la página, creando una experiencia similar a una aplicación profesional moderna.

### Axios

Axios es una librería utilizada para realizar peticiones HTTP hacia la API institucional del SII, permitiendo obtener información académica del estudiante como calificaciones, kardex y horario.

### LocalStorage

LocalStorage se utilizó para almacenar temporalmente información del usuario autenticado y para implementar el módulo adicional de avisos universitarios dentro del sistema.

---

# ✨ Funcionalidades principales del sistema

El sistema incluye los siguientes módulos:

- Inicio de sesión institucional
- Dashboard con información general del estudiante
- Consulta de calificaciones por materia
- Consulta de kardex académico
- Visualización del horario escolar
- Módulo de avisos universitarios
- Panel administrativo para gestión de avisos

---

# 📌 Descripción general del funcionamiento

El sistema consume la API institucional del Sistema Integral de Información (SII) mediante autenticación con token JWT para obtener la información académica del estudiante autenticado.

Adicionalmente, se implementó un módulo extra de avisos universitarios que permite registrar comunicados importantes dentro del portal. Este módulo utiliza LocalStorage para simular persistencia de datos y complementar las funcionalidades del sistema académico.

Este tipo de funcionalidad es común en portales universitarios reales, ya que permite mantener informada a la comunidad estudiantil sobre eventos, convocatorias, fechas importantes y avisos institucionales.
