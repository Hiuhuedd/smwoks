const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const initializeFirebase = async () => {
  try {
    if (process.env.DEMO_MODE === 'true' || process.env.BYPASS_AUTH === 'true') {
      console.log('🎭 Running in BYPASS MODE - Firebase Auth disabled');
      return 'samwega-server-user';
    }

    console.log('✅ Firebase Client SDK initialized (Auth bypassed)');
    return 'samwega-server-user';
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }
};

const getFirestoreApp = () => {
  if (process.env.DEMO_MODE === 'true') {
    // Mock Firestore object for demo mode that works with client SDK syntax
    return {
      // Mock collection function that returns a mock collection reference
      collection: () => ({
        add: async () => ({ id: 'demo-' + Date.now() }),
        doc: () => ({
          get: async () => ({ exists: false }),
          update: async () => ({}),
          ref: { update: async () => ({}) }
        }),
        where: () => ({
          limit: () => ({
            get: async () => ({ empty: true, docs: [] })
          }),
          get: async () => ({ empty: true, size: 0, forEach: () => { } })
        }),
        orderBy: () => ({
          limit: () => ({
            offset: () => ({
              get: async () => ({ docs: [], forEach: () => { } })
            })
          })
        }),
        get: async () => ({ size: 0, forEach: () => { } })
      })
    };
  }
  return db;
};

module.exports = {
  initializeFirebase,
  getFirestoreApp,
};