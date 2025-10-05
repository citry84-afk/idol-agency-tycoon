// 🔥 FIREBASE SIMPLE CONFIGURATION PARA IDOL AGENCY TYCOON
// Sistema simplificado de gestión de usuarios

console.log('🔥 Inicializando Firebase Simple...');

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDXy4N8vSLMYvHmet-kVPSwjkv5_QrURpo",
    authDomain: "entrenoapp-c0f30.firebaseapp.com",
    projectId: "entrenoapp-c0f30",
    storageBucket: "entrenoapp-c0f30.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-5XL1W8RNTP"
};

// 🎤 USER MANAGER SIMPLIFICADO
class SimpleUserManager {
    constructor() {
        this.currentUser = null;
        this.isOnline = navigator.onLine;
        this.syncInterval = null;
        
        console.log('🎤 Simple User Manager inicializado');
        
        // Simular estado de usuario para testing
        this.simulateUserState();
    }
    
    // 🔐 MÉTODOS DE AUTENTICACIÓN SIMULADOS
    
    async signInWithGoogle() {
        console.log('🔍 Simulando login con Google...');
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Crear usuario simulado
        this.currentUser = {
            uid: 'demo-user-' + Date.now(),
            email: 'demo@example.com',
            displayName: 'Usuario Demo',
            photoURL: null
        };
        
        console.log('✅ Login simulado exitoso:', this.currentUser.displayName);
        return this.currentUser;
    }
    
    async signInWithEmail(email, password) {
        console.log('📧 Simulando login con email:', email);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Crear usuario simulado
        this.currentUser = {
            uid: 'demo-user-' + Date.now(),
            email: email,
            displayName: email.split('@')[0],
            photoURL: null
        };
        
        console.log('✅ Login con email exitoso:', this.currentUser.displayName);
        return this.currentUser;
    }
    
    async signUpWithEmail(email, password, displayName) {
        console.log('📝 Simulando registro con email:', email);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Crear usuario simulado
        this.currentUser = {
            uid: 'demo-user-' + Date.now(),
            email: email,
            displayName: displayName,
            photoURL: null
        };
        
        console.log('✅ Registro exitoso:', this.currentUser.displayName);
        return this.currentUser;
    }
    
    async signOut() {
        console.log('🚪 Simulando logout...');
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.currentUser = null;
        this.stopAutoSync();
        
        console.log('✅ Logout exitoso');
    }
    
    // 💾 MÉTODOS DE SINCRONIZACIÓN SIMULADOS
    
    async saveGameData(gameState) {
        try {
            // Guardar localmente primero
            localStorage.setItem('idolAgencyTycoon', JSON.stringify(gameState));
            console.log('💾 Guardado local completado');
            
            // Si hay usuario logueado, simular guardado en la nube
            if (this.currentUser) {
                // Simular delay de red
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Guardar en localStorage con clave de usuario
                localStorage.setItem(`idolAgencyTycoon_${this.currentUser.uid}`, JSON.stringify(gameState));
                console.log('☁️ Guardado simulado en la nube completado');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error guardando datos:', error);
            return false;
        }
    }
    
    async loadUserGameData() {
        try {
            if (!this.currentUser) return null;
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Cargar desde localStorage con clave de usuario
            const userData = localStorage.getItem(`idolAgencyTycoon_${this.currentUser.uid}`);
            
            if (userData) {
                const gameData = JSON.parse(userData);
                console.log('☁️ Datos cargados desde la nube simulada');
                return gameData;
            } else {
                console.log('📝 Usuario nuevo - no hay datos en la nube');
                return null;
            }
        } catch (error) {
            console.error('❌ Error cargando datos de usuario:', error);
            return null;
        }
    }
    
    // 🔄 SINCRONIZACIÓN AUTOMÁTICA
    
    startAutoSync() {
        if (this.syncInterval) return;
        
        this.syncInterval = setInterval(() => {
            if (this.currentUser && this.isOnline && window.gameState) {
                this.saveGameData(window.gameState);
            }
        }, 30000); // Sincronizar cada 30 segundos
        
        console.log('🔄 Auto-sync iniciado');
    }
    
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
            console.log('⏹️ Auto-sync detenido');
        }
    }
    
    // 📊 MÉTODOS DE ANÁLISIS SIMULADOS
    
    async getLeaderboard() {
        try {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Crear leaderboard simulado
            const leaderboard = [
                {
                    displayName: 'K-pop Master',
                    fame: 50000,
                    agencyLevel: 10,
                    idolsCount: 15
                },
                {
                    displayName: 'Idol Producer',
                    fame: 35000,
                    agencyLevel: 8,
                    idolsCount: 12
                },
                {
                    displayName: 'Star Manager',
                    fame: 25000,
                    agencyLevel: 6,
                    idolsCount: 10
                },
                {
                    displayName: 'Music Director',
                    fame: 18000,
                    agencyLevel: 5,
                    idolsCount: 8
                },
                {
                    displayName: 'Talent Scout',
                    fame: 12000,
                    agencyLevel: 4,
                    idolsCount: 6
                }
            ];
            
            console.log('🏆 Leaderboard simulado generado');
            return leaderboard;
        } catch (error) {
            console.error('❌ Error obteniendo leaderboard:', error);
            return [];
        }
    }
    
    // 🔧 MÉTODOS UTILITARIOS
    
    isUserLoggedIn() {
        return this.currentUser !== null;
    }
    
    getUserInfo() {
        if (!this.currentUser) return null;
        
        return {
            uid: this.currentUser.uid,
            email: this.currentUser.email,
            displayName: this.currentUser.displayName,
            photoURL: this.currentUser.photoURL
        };
    }
    
    // Migrar datos de localStorage a la nube
    async migrateLocalData() {
        try {
            const localData = localStorage.getItem('idolAgencyTycoon');
            if (localData && this.currentUser) {
                await this.saveGameData(JSON.parse(localData));
                console.log('🔄 Datos migrados de localStorage a la nube simulada');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error migrando datos:', error);
            return false;
        }
    }
    
    // Simular estado de usuario para testing
    simulateUserState() {
        // Simular que a veces hay un usuario logueado
        if (Math.random() > 0.7) {
            this.currentUser = {
                uid: 'demo-user-123',
                email: 'demo@example.com',
                displayName: 'Usuario Demo',
                photoURL: null
            };
            console.log('🎭 Usuario demo cargado para testing');
        }
    }
}

// 🎯 CREAR INSTANCIA GLOBAL
window.idolUserManager = new SimpleUserManager();

// 🔧 FUNCIONES GLOBALES PARA INTEGRACIÓN
window.signInWithGoogle = () => window.idolUserManager.signInWithGoogle();
window.signInWithEmail = (email, password) => window.idolUserManager.signInWithEmail(email, password);
window.signUpWithEmail = (email, password, displayName) => window.idolUserManager.signUpWithEmail(email, password, displayName);
window.signOut = () => window.idolUserManager.signOut();
window.saveToCloud = () => window.idolUserManager.saveGameData(window.gameState);
window.loadFromCloud = () => window.idolUserManager.loadUserGameData();
window.migrateLocalData = () => window.idolUserManager.migrateLocalData();

console.log('🔥 Firebase Simple configurado correctamente');
