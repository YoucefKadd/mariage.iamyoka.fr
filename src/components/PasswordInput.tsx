"use client";

import { useState } from 'react';

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input 
        type={showPassword ? "text" : "password"} 
        name="password" 
        className="w-full border-b border-brand-taupe/40 py-3 pr-16 focus:outline-none focus:border-brand-taupe bg-transparent" 
        placeholder="••••••••"
        required 
      />
      <button 
        type="button" 
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-brand-taupe hover:text-brand-ink transition-colors py-2 focus:outline-none"
      >
        {showPassword ? "Masquer" : "Afficher"}
      </button>
    </div>
  );
}
