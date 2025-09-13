# 🚀 CÓMO TENER TU URL PROPIA EN 10 MINUTOS

## ✅ Opción GitHub Pages (100% GRATIS para siempre)

### PASO 1: Crear cuenta en GitHub (2 minutos)
1. Ve a **github.com**
2. Haz clic en **"Sign up"**
3. Usa tu email y crea una contraseña
4. Confirma tu cuenta por email

### PASO 2: Subir tu aplicación (3 minutos)
1. Haz clic en **"New repository"** (botón verde)
2. **Nombre:** `restaurante-escolar`
3. ✅ Marca **"Public"**
4. ✅ Marca **"Add a README file"**
5. Haz clic en **"Create repository"**

### PASO 3: Subir archivos (3 minutos)
1. En tu nuevo repositorio, haz clic en **"uploading an existing file"**
2. **Arrastra TODOS los archivos** de tu aplicación de Figma Make
3. **Importante:** Asegúrate de incluir la carpeta `.github` que te preparé
4. Escribe en el mensaje: "Primera versión de la aplicación"
5. Haz clic en **"Commit changes"**

### PASO 4: Configurar variables de Supabase (2 minutos)
1. En tu repositorio, ve a **"Settings"** (pestaña arriba)
2. En el menú izquierdo, haz clic en **"Secrets and variables"** → **"Actions"**
3. Haz clic en **"New repository secret"**
4. Agrega estos secretos:
   - **Name:** `VITE_SUPABASE_URL` **Value:** [tu URL de Supabase]
   - **Name:** `VITE_SUPABASE_ANON_KEY` **Value:** [tu clave de Supabase]

### PASO 5: Activar GitHub Pages (1 minuto)
1. Ve a **"Settings"** → **"Pages"**
2. En **"Source"** selecciona **"GitHub Actions"**
3. ¡Listo! GitHub automáticamente construye tu app

### RESULTADO:
Tu aplicación estará en: **https://tuusuario.github.io/restaurante-escolar/**

---

## 🌟 Ventajas de GitHub Pages:
- ✅ **100% GRATIS** para siempre
- ✅ **URL propia** sin menciones de Figma Make
- ✅ **Actualizaciones automáticas** cuando cambies algo
- ✅ **Funciona en todos los móviles**
- ✅ **Se puede instalar como app** (PWA)

---

## 🆘 Si tienes problemas:
1. **Error en el build:** Revisa que hayas subido TODOS los archivos
2. **No aparece la página:** Espera 5-10 minutos después del primer deploy
3. **Supabase no funciona:** Verifica que las variables estén bien configuradas

---

## 💡 Opcional: Dominio personalizado
Si quieres `restaurante.colegio.edu.co`:
1. En GitHub Pages settings, agrega tu dominio personalizado
2. Configura DNS en tu proveedor de hosting
3. GitHub te da las instrucciones específicas

---

**¡Con esto tendrás tu aplicación funcionando con URL propia en menos de 10 minutos!**