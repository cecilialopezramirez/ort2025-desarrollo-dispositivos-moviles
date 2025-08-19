# Obligatorio de Taller de Desarrollo para Dispositivos Móviles
Este proyecto fue realizado con fines académicos para un taller en la **Universidad ORT Uruguay**.  

![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow?logo=javascript)
![HTML5](https://img.shields.io/badge/HTML-5-orange?logo=html5)
![Ionic](https://img.shields.io/badge/Ionic-Framework-blueviolet?logo=ionic)

---

## 📄 Consigna
Desarrollar una aplicación web que permita a un usuario almacenar autoevaluaciones de sus objetivos diarios, consultando y persistiendo los datos mediante una **API REST** proporcionada por el equipo docente.  

La API REST **no realiza control de errores**, por lo que es responsabilidad de los desarrolladores enviar correctamente los datos.  

---

## 🚀 Aplicación
La aplicación permite al usuario:
- Registrar evaluaciones que vaya haciendo en el día o días anteriores.
- Visualizar estadísticas y métricas que se actualicen con cada cambio de interfaz.
- Interactuar con los servicios disponibles en la API REST.

---

## ✅ Requerimientos Funcionales

1. **Registro**: usuario, contraseña y país. Uso de `localStorage` para mantener sesión.  
2. **Login / Logout**: manejo de tokens e id de usuario.  
3. **Agregar Evaluación**: objetivo, calificación (-5 a 5) y fecha.  
4. **Listado de Evaluaciones**: con íconos (propiedad `emoji`).  
5. **Eliminar Evaluaciones**.  
6. **Filtro por Fecha**: última semana, último mes, histórico.  
7. **Informe de Cumplimiento**:  
   - Puntaje Global (promedio de todas las evaluaciones).  
   - Puntaje Diario (promedio del día actual).  
8. **Mapa de Usuarios por País**: 10 markers con cantidad de usuarios por país.  

---

## 🛠️ Tecnologías
- **HTML / JavaScript (Ionic)**
- **API REST** (proporcionada por el equipo docente)
- **localStorage** para manejo de sesión

---

# Mobile Development Workshop Assignment
This project was developed for academic purposes as part of a workshop at **Universidad ORT Uruguay**.  

![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow?logo=javascript)
![HTML5](https://img.shields.io/badge/HTML-5-orange?logo=html5)
![Ionic](https://img.shields.io/badge/Ionic-Framework-blueviolet?logo=ionic)

---

## 📄 Assignment Summary
A prototype web application to let users record **self-evaluations of their daily goals**, storing and retrieving data through a **REST API** provided by the teaching staff.  
Error handling must be implemented on the client side.  

---

## 🚀 Features
- **User Registration** (username, password, country) with session persistence using `localStorage`.  
- **Login / Logout** with token management.  
- **Add Evaluation** (goal, rating from -5 to 5, date).  
- **List Evaluations** with icons per goal.  
- **Delete Evaluations**.  
- **Filter by Date** (last week, last month, all history).  
- **Reports**:  
  - Global Score (average of all evaluations).  
  - Daily Score (average of today's evaluations).  
- **Users Map**: 10 markers showing number of registered users per country.  

---

## 🛠️ Tech Stack
- **HTML / JavaScript (Ionic)**
- **REST API** (provided by teaching staff)
- **localStorage** for session persistence

