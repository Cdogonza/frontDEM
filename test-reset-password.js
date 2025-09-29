// Script de prueba para resetPasswordDefault
// Ejecutar en la consola del navegador después de iniciar la aplicación

// Función para probar resetPasswordDefault
async function testResetPasswordDefault() {
    const email = 'gpaz@dnsffaa.gub.uy';
    
    console.log('🧪 Iniciando prueba de resetPasswordDefault...');
    console.log('📧 Email a probar:', email);
    
    try {
        // Obtener el servicio de autenticación desde la aplicación Angular
        const app = window.ng.getComponent(document.querySelector('app-root'));
        const authService = app.injector.get(import('./src/app/services/auth.service').AuthService);
        
        console.log('🔄 Llamando a resetPasswordDefault...');
        
        // Llamar al método
        authService.resetPasswordDefault(email).subscribe({
            next: (response) => {
                console.log('✅ Éxito:', response);
                alert('Contraseña restablecida exitosamente para: ' + email);
            },
            error: (error) => {
                console.error('❌ Error:', error);
                alert('Error al restablecer contraseña: ' + error.message);
            }
        });
        
    } catch (error) {
        console.error('❌ Error al acceder al servicio:', error);
        alert('Error al acceder al servicio de autenticación');
    }
}

// Función alternativa usando fetch directamente
async function testResetPasswordDefaultWithFetch() {
    const email = 'gpaz@dnsffaa.gub.uy';
    const apiUrl = 'http://localhost:3001/api'; // Ajustar según tu configuración
    
    console.log('🧪 Iniciando prueba con fetch...');
    console.log('📧 Email a probar:', email);
    console.log('🌐 URL:', `${apiUrl}/auth/resetDefault`);
    
    try {
        const response = await fetch(`${apiUrl}/auth/resetDefault`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Éxito:', data);
            alert('Contraseña restablecida exitosamente para: ' + email);
        } else {
            console.error('❌ Error del servidor:', data);
            alert('Error del servidor: ' + (data.message || 'Error desconocido'));
        }
        
    } catch (error) {
        console.error('❌ Error de red:', error);
        alert('Error de conexión: ' + error.message);
    }
}

// Función para probar desde el componente de gestión de usuarios
function testFromUserManagement() {
    console.log('🧪 Probando desde el componente de gestión de usuarios...');
    
    // Navegar a la página de gestión de usuarios si no estás ahí
    if (!window.location.pathname.includes('/usermanagement')) {
        console.log('📍 Navegando a /usermanagement...');
        window.location.href = '/usermanagement';
        return;
    }
    
    // Simular el click en el botón de reset password
    const resetButtons = document.querySelectorAll('button');
    const resetButton = Array.from(resetButtons).find(button => 
        button.textContent.includes('Reset Password') || 
        button.textContent.includes('Restablecer')
    );
    
    if (resetButton) {
        console.log('🔘 Botón encontrado, simulando click...');
        resetButton.click();
    } else {
        console.log('❌ No se encontró el botón de reset password');
    }
}

// Mostrar las opciones disponibles
console.log('🚀 Script de prueba cargado. Opciones disponibles:');
console.log('1. testResetPasswordDefault() - Usando servicio Angular');
console.log('2. testResetPasswordDefaultWithFetch() - Usando fetch directo');
console.log('3. testFromUserManagement() - Desde componente de usuarios');
console.log('');
console.log('💡 Recomendación: Usar testResetPasswordDefaultWithFetch() para prueba directa');
