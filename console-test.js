// Copiar y pegar este código en la consola del navegador (F12)

// Prueba directa con fetch
async function testResetPassword() {
    const email = 'gpaz@dnsffaa.gub.uy';
    const apiUrl = 'http://localhost:3001/api';
    
    console.log('🧪 Probando resetPasswordDefault para:', email);
    
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
            alert('✅ Contraseña restablecida para: ' + email);
        } else {
            console.error('❌ Error:', data);
            alert('❌ Error: ' + (data.message || 'Error desconocido'));
        }
        
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('❌ Error de conexión: ' + error.message);
    }
}

// Ejecutar la prueba
testResetPassword();

