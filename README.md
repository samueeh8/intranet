

## 📌 Descripción
Este repositorio sigue un flujo de trabajo basado en ramas para garantizar estabilidad en la producción y permitir un desarrollo estructurado y controlado.

## 🌿 Flujo de trabajo de ramas
El repositorio utiliza las siguientes ramas principales:

- **`main`**: Es la rama de producción. Solo se actualiza cuando las funcionalidades han sido completamente desarrolladas y probadas.
- **`develop`**: Es la rama de desarrollo y pruebas. Aquí se integran los cambios antes de ser promovidos a producción.
- **Ramas de características (`feature/`)**: Se crean desde `develop` y son utilizadas para desarrollar nuevas funcionalidades o correcciones.

## 🔄 Flujo de trabajo

1. **Crear una nueva rama de funcionalidad o corrección**
   - Desde `develop`, se crea una nueva rama con el prefijo `feature/`, por ejemplo:
     ```bash
     git checkout develop
     git pull origin develop
     git checkout -b feature/nueva-funcionalidad
     ```

2. **Realizar cambios y confirmarlos**
   - Hacer cambios en la rama y confirmarlos con mensajes descriptivos:
     ```bash
     git add .
     git commit -m "Descripción clara del cambio realizado"
     ```

3. **Subir los cambios al repositorio**
   - Si la rama es nueva y aún no existe en el repositorio remoto, es necesario subirla con:
     ```bash
     git push -u origin feature/nueva-funcionalidad
     ```
   - Si la rama ya existe en remoto y está vinculada (`tracking branch`), basta con:
     ```bash
     git push
     ```

4. **Realizar un Pull Request (PR) a `develop`**
   - Abrir un PR en GitHub desde la rama `feature/nueva-funcionalidad` hacia `develop`.
   - Revisar el código, solicitar revisiones si es necesario y realizar los cambios requeridos.
   - Una vez aprobado, fusionar la rama en `develop`.

5. 🔀 **Fusionar la rama `feature/` en `develop`**

   Una vez aprobado el Pull Request, puedes fusionar la rama `feature/` con `develop` de dos maneras:

   #### ✅ Opción A: Usar GitHub (recomendado)
   - Ve al Pull Request abierto.
   - Revisa los cambios y asegúrate de que el destino es `develop`.
   - Haz clic en **"Merge pull request"**.
   - Luego elimina la rama si lo deseas, usando el botón "Delete branch".

   #### 🧪 Opción B: Fusión manual con Git
   Si prefieres hacerlo desde la terminal:

   ```bash
   git checkout develop
   git pull origin develop
   git merge feature/nueva-funcionalidad
   git push origin develop
   ```

6. **Pruebas y validación en `develop`**
   - Se ejecutan pruebas y validaciones en la rama `develop`.
   - Si todo funciona correctamente, se procede al despliegue en producción.

7. **Fusionar `develop` en `main` y desplegar**
   - Una vez validados los cambios en `develop`, se fusionan en `main` con:
     ```bash
     git checkout main
     git pull origin main
     git merge develop
     git push origin main
     ```

8. **Eliminar ramas de características**
   - Una vez fusionadas en `develop` y en `main`, se pueden eliminar las ramas innecesarias:
     ```bash
     git branch -d feature/nueva-funcionalidad
     git push origin --delete feature/nueva-funcionalidad
     ```

## 📌 Reglas de buenas prácticas
- Todo desarrollo debe realizarse en una rama `feature/`.
- No se debe trabajar directamente en `develop` ni en `main`.
- Todo código debe pasar una revisión antes de ser fusionado.
- Se deben realizar pruebas antes de fusionar `develop` en `main`.

## 🛠 Herramientas recomendadas
- [Git](https://git-scm.com/)
- [GitHub Desktop](https://desktop.github.com/)
- [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Visual Studio Code](https://code.visualstudio.com/)

---
¡Happy coding! 🚀
