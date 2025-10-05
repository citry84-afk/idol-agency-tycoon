// 🔥 FIREBASE CONFIGURATION PARA IDOL AGENCY TYCOON
// Sistema de gestión de usuarios y sincronización de datos

// Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuración de Firebase (usar las credenciales de EntrenoApp)
const firebaseConfig = {
    apiKey: "AIzaSyDXy4N8vSLMYvHmet-kVPSwjkv5_QrURpo",
    authDomain: "entrenoapp-c0f30.firebaseapp.com",
    projectId: "entrenoapp-c0f30",
    storageBucket: "entrenoapp-c0f30.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-5XL1W8RNTP"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configurar Google Auth
const googleProvider = new GoogleAuthProvider();

// 🎤 USER MANAGER CLASS
class IdolUserManager {
    constructor() {
        this.currentUser = null;
        this.gameData = null;
        this.isOnline = navigator.onLine;
        this.syncInterval = null;
        
        // Escuchar cambios de autenticación
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            if (user) {
                console.log('🎤 Usuario logueado:', user.displayName || user.email);
                this.loadUserGameData();
                this.startAutoSync();
            } else {
                console.log('🎤 Usuario deslogueado');
                this.stopAutoSync();
                this.loadLocalGameData();
            }
        });
        
        // Escuchar cambios de conexión
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Conexión restaurada');
            this.syncGameData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📴 Sin conexión - modo offline');
        });
    }
    
    // 🔐 MÉTODOS DE AUTENTICACIÓN
    
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('✅ Login con Google exitoso');
            return result.user;
        } catch (error) {
            console.error('❌ Error en login Google:', error);
            throw error;
        }
    }
    
    async signInWithEmail(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log('✅ Login con email exitoso');
            return result.user;
        } catch (error) {
            console.error('❌ Error en login email:', error);
            throw error;
        }
    }
    
    async signUpWithEmail(email, password, displayName) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateDoc(doc(db, 'users', result.user.uid), {
                displayName: displayName,
                createdAt: new Date(),
                lastLogin: new Date()
            });
            console.log('✅ Registro exitoso');
            return result.user;
        } catch (error) {
            console.error('❌ Error en registro:', error);
            throw error;
        }
    }
    
    async signOut() {
        try {
            await signOut(auth);
            console.log('✅ Logout exitoso');
        } catch (error) {
            console.error('❌ Error en logout:', error);
            throw error;
        }
    }
    
    // 💾 MÉTODOS DE SINCRONIZACIÓN
    
    async saveGameData(gameState) {
        try {
            // Guardar localmente primero
            localStorage.setItem('idolAgencyTycoon', JSON.stringify(gameState));
            console.log('💾 Guardado local completado');
            
            // Si hay usuario logueado, guardar en la nube
            if (this.currentUser && this.isOnline) {
                const userRef = doc(db, 'idolUsers', this.currentUser.uid);
                await setDoc(userRef, {
                    userId: this.currentUser.uid,
                    email: this.currentUser.email,
                    displayName: this.currentUser.displayName,
                    lastSave: new Date(),
                    gameData: gameState,
                    version: '2.0'
                }, { merge: true });
                console.log('☁️ Guardado en la nube completado');
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
            
            const userRef = doc(db, 'idolUsers', this.currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                this.gameData = userData.gameData;
                console.log('☁️ Datos cargados desde la nube');
                return userData.gameData;
            } else {
                console.log('📝 Usuario nuevo - creando perfil');
                return null;
            }
        } catch (error) {
            console.error('❌ Error cargando datos de usuario:', error);
            return null;
        }
    }
    
    loadLocalGameData() {
        try {
            const saved = localStorage.getItem('idolAgencyTycoon');
            if (saved) {
                this.gameData = JSON.parse(saved);
                console.log('💾 Datos cargados desde localStorage');
                return this.gameData;
            }
            return null;
        } catch (error) {
            console.error('❌ Error cargando datos locales:', error);
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
    
    // 📊 MÉTODOS DE ANÁLISIS
    
    async getLeaderboard() {
        try {
            const leaderboardRef = collection(db, 'idolUsers');
            const q = query(leaderboardRef, orderBy('gameData.fame', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            
            const leaderboard = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                leaderboard.push({
                    displayName: data.displayName || 'Usuario Anónimo',
                    fame: data.gameData?.fame || 0,
                    agencyLevel: data.gameData?.agencyLevel || 1,
                    idolsCount: data.gameData?.idols?.length || 0
                });
            });
            
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
            const localData = this.loadLocalGameData();
            if (localData && this.currentUser) {
                await this.saveGameData(localData);
                console.log('🔄 Datos migrados de localStorage a la nube');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error migrando datos:', error);
            return false;
        }
    }
}

// 🎯 EXPORTAR INSTANCIA GLOBAL
window.idolUserManager = new IdolUserManager();

// 🔧 FUNCIONES GLOBALES PARA INTEGRACIÓN
window.signInWithGoogle = () => window.idolUserManager.signInWithGoogle();
window.signInWithEmail = (email, password) => window.idolUserManager.signInWithEmail(email, password);
window.signUpWithEmail = (email, password, displayName) => window.idolUserManager.signUpWithEmail(email, password, displayName);
window.signOut = () => window.idolUserManager.signOut();
window.saveToCloud = () => window.idolUserManager.saveGameData(window.gameState);
window.loadFromCloud = () => window.idolUserManager.loadUserGameData();
window.migrateLocalData = () => window.idolUserManager.migrateLocalData();

console.log('🔥 Firebase User Manager inicializado');
