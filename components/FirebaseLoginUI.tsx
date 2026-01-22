
import React, { useState } from "react";
import { User, AlertCircle, ArrowLeft, Chrome, ShieldCheck } from "lucide-react";
import { FirebaseUser } from "../types";
import { auth, signInWithPopup, GoogleAuthProvider } from "../firebase";

interface AuthFormProps {
  onAuthSuccess: (user: FirebaseUser) => void;
  onBack: () => void;
}

const FirebaseLoginUI: React.FC<AuthFormProps> = ({ onAuthSuccess, onBack }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all mb-10 group font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>

        <div className="bg-white rounded-[3.5rem] shadow-2xl p-14 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl rotate-6">
            <User size={40} />
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Identity</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-12">Access the management console</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-3xl flex gap-3 items-start mb-8 text-sm text-left">
              <AlertCircle size={20} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button 
            onClick={signInWithGoogle} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 text-slate-900 px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:border-emerald-600 hover:bg-slate-50 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
            ) : (
              <>
                <Chrome size={20} className="text-red-500" />
                Sign in with Google
              </>
            )}
          </button>

          <div className="mt-12 text-slate-300 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> Verified Secure Connection
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseLoginUI;
