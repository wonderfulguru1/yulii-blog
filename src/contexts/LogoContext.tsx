import React, { createContext, useContext, useState, useEffect } from 'react';

interface LogoContextType {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  text: string;
  setText: (text: string) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};

interface LogoProviderProps {
  children: React.ReactNode;
}

export const LogoProvider = ({ children }: LogoProviderProps) => {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [text, setText] = useState<string>('YULII');

  // Load logo from localStorage on mount
  useEffect(() => {
    const savedLogoUrl = localStorage.getItem('yulii-logo-url');
    const savedText = localStorage.getItem('yulii-logo-text');
    
    if (savedLogoUrl) {
      setLogoUrl(savedLogoUrl);
    } else {
      // Try to use default logo from public folder
      const defaultLogos = [
        '/image/yulilogo-53f9df41.svg',
        '/yulii-logo.png',
        '/logo.png',
        '/yulii-logo.svg',
        '/logo.svg'
      ];
      
      let index = 0;
      const tryNextLogo = () => {
        if (index < defaultLogos.length) {
          const img = new Image();
          img.onload = () => {
            setLogoUrl(defaultLogos[index]);
          };
          img.onerror = () => {
            index++;
            tryNextLogo();
          };
          img.src = defaultLogos[index];
        }
      };
      tryNextLogo();
    }
    
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // Save logo to localStorage when it changes
  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem('yulii-logo-url', logoUrl);
    } else {
      localStorage.removeItem('yulii-logo-url');
    }
  }, [logoUrl]);

  // Save text to localStorage when it changes
  useEffect(() => {
    if (text) {
      localStorage.setItem('yulii-logo-text', text);
    } else {
      localStorage.removeItem('yulii-logo-text');
    }
  }, [text]);

  const value = {
    logoUrl,
    setLogoUrl,
    text,
    setText,
  };

  return (
    <LogoContext.Provider value={value}>
      {children}
    </LogoContext.Provider>
  );
};
