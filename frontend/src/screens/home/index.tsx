import { useEffect, useRef, useState } from "react";
import { SWATCHES } from "../../lib/constants";
import { Tooltip } from "@mantine/core";
import { Button } from "../../components/ui/button";
import Draggable from 'react-draggable';
import axios from 'axios';
import { Eraser, Send, RotateCcw, Palette, Download, Minus, Plus, History, Check, Info, HelpCircle, Settings, Menu, Share, Trash2, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

declare global {
  interface Window {
    MathJax: any;
  }
}

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

interface GeneratedResult {
  expression: string;
  answer: string;
}

interface HistoryItem {
  expression: string;
  answer: string;
  timestamp: number;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://smartsum-ai-backend.onrender.com' 
    : 'http://localhost:8000');

// Modal component for consistent modal behavior
const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  id,
  className = ""
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  id?: string;
  className?: string;
}) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div 
        id={id}
        className={`glass-panel p-6 rounded-xl w-11/12 max-w-md ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [reset, setReset] = useState(false);
  const [result, setResult] = useState<GeneratedResult>();
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
  const [latexPosition, setLatexPosition] = useState({x:10, y:200});
  const [dictOfVars, setDictOfVars] = useState({});
  const [latexColor, setLatexColor] = useState('#40c057');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<HistoryItem[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [canvasBackground, setCanvasBackground] = useState('#121212');
  const [firstVisit, setFirstVisit] = useState(true);
  
  // Check if it's user's first visit
  useEffect(() => {
    const visited = localStorage.getItem('smartSumVisited');
    if (!visited) {
      setTimeout(() => {
        setShowTutorial(true);
      }, 500);
      localStorage.setItem('smartSumVisited', 'true');
    } else {
      setFirstVisit(false);
    }
  }, []);
  
  // MathJax typesetting when LaTeX expressions change
  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        window.MathJax.Hub.Queue(() => {
          document.querySelectorAll('.MathJax').forEach((elem) => {
            const el = elem as HTMLElement;
            el.style.color = latexColor;
          });
          document.querySelectorAll('.MathJax_SVG').forEach((elem) => {
            const el = elem as HTMLElement;
            el.style.color = latexColor;
          });
          document.querySelectorAll('.MathJax_Display').forEach((elem) => {
            const el = elem as HTMLElement;
            el.style.color = latexColor;
          });
        });
      }, 100);
    }
  }, [latexExpression, latexColor]);

  // Update when result changes
  useEffect(() => {
    if(result) {
      renderLatexToCanvas(result.expression, result.answer);
      setCalculationHistory(prev => {
        const newHistory = [
          { 
            expression: result.expression, 
            answer: result.answer,
            timestamp: Date.now()
          },
          ...prev
        ].slice(0, 20);
        
        try {
          localStorage.setItem('smartSumHistory', JSON.stringify(newHistory));
        } catch (e) {
          console.error('Failed to save history to localStorage', e);
        }
        
        return newHistory;
      });
    }
  }, [result]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('smartSumHistory');
      if (savedHistory) {
        setCalculationHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Reset canvas effect
  useEffect(() => {
    if (reset){
      resetCanvas();
      setLatexExpression([]);
      setResult(undefined);
      setDictOfVars({});
      setReset(false);
      toast.success("Canvas cleared successfully!");
    }
  }, [reset]);

  // Initialize canvas and MathJax
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d", {willReadFrequently: true});
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.lineCap = "round";
        ctx.lineWidth = lineWidth;
      }
      canvas.style.background = canvasBackground;
    }

    const style = document.createElement('style');
    style.textContent = `
      .MathJax, .MathJax_SVG, .MathJax_Display {
        color: ${latexColor} !important;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement("script");
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
        showProcessingMessages: true,
        messageStyle: "none",
        SVG: {
          styles: {
            ".MathJax_SVG": { color: latexColor },
            ".MathJax_SVG_Display": { color: latexColor }
          }
        },
        HTML: {
          styles: {
            ".MathJax": { color: latexColor },
            ".MathJax_Display": { color: latexColor }
          }
        }
      });
    };

    const handleResize = () => {
      if (canvas) {
        const ctx = canvas.getContext("2d", {willReadFrequently: true});
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          ctx.putImageData(imageData, 0, 0);
          ctx.lineCap = "round";
          ctx.lineWidth = lineWidth;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => { 
      if (script.parentNode) {
        document.head.removeChild(script); 
      }
      if (style.parentNode) {
        document.head.removeChild(style);
      }
      window.removeEventListener('resize', handleResize);
    }
  }, [latexColor, lineWidth, canvasBackground]);

  // Touch event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsDrawing(false);
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDrawing, color, lineWidth]);

  // Handle closing modals when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showColorPicker) {
        const colorPicker = document.getElementById('color-picker-panel');
        const paletteButton = document.getElementById('palette-button');
        
        if (colorPicker && 
            !colorPicker.contains(e.target as Node) && 
            paletteButton && 
            !paletteButton.contains(e.target as Node)) {
          setShowColorPicker(false);
        }
      }
      
      if (showMenu) {
        const menuPanel = document.getElementById('menu-panel');
        const menuButton = document.getElementById('menu-button');
        
        if (menuPanel && 
            !menuPanel.contains(e.target as Node) && 
            menuButton && 
            !menuButton.contains(e.target as Node)) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showColorPicker, showMenu]);

  // Function to render latex to canvas
  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
    setLatexExpression(prev => [...prev, latex]);
  };

  // Save canvas as image
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'smartsum-calculation.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success("Image saved successfully!");
    }
  };

  // Share result
  const shareResult = () => {
    if (latexExpression.length === 0) {
      toast.error("No calculations to share");
      return;
    }

    if (navigator.share) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'smartsum-calculation.png', { type: 'image/png' });
            navigator.share({
              title: 'SmartSum Calculation',
              text: 'Check out my calculation with SmartSum!',
              files: [file]
            }).then(() => {
              toast.success("Shared successfully!");
            }).catch((error) => {
              console.error('Error sharing:', error);
              toast.error("Failed to share");
            });
          }
        });
      }
    } else {
      saveCanvas();
    }
  };

  // Debug function to check environment variables
  const debugEnvironment = () => {
    console.log('=== ENVIRONMENT DEBUG ===');
    console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);
    console.log('Final API URL:', API_BASE_URL);
    console.log('All env vars:', import.meta.env);
    console.log('Mode:', import.meta.env.MODE);
    console.log('Dev:', import.meta.env.DEV);
    console.log('Prod:', import.meta.env.PROD);
    console.log('NODE_ENV equivalent (PROD):', import.meta.env.PROD);
    
    // Show detailed breakdown
    const envUrl = import.meta.env.VITE_API_URL;
    const conditionalUrl = import.meta.env.PROD 
      ? 'https://smartsum-ai-backend.onrender.com' 
      : 'http://localhost:8900';
    
    console.log('Environment URL:', envUrl || 'Not set');
    console.log('Conditional URL:', conditionalUrl);
    console.log('Using:', envUrl ? 'Environment variable' : 'Conditional logic');
    
    toast.success(`API URL: ${API_BASE_URL}`, { duration: 5000 });
    
    // Test direct API call
    testBackendConnection();
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('Testing connection to:', API_BASE_URL);
      
      // First try the health endpoint
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/health`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (healthError) {
        // If health endpoint fails, try root endpoint
        console.log('Health endpoint failed, trying root endpoint');
        response = await axios.get(`${API_BASE_URL}/`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      toast.success("Backend connected successfully!");
      console.log('Backend response:', response.data);
      return true;
    } catch (error: any) {
      console.error('Backend connection failed:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error("Cannot connect to backend. Check CORS settings or network.");
      } else if (error.response) {
        toast.error(`Backend error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Connection timeout. Backend might be slow.");
      } else {
        toast.error("Network error. Check your internet connection.");
      }
      return false;
    }
  };

// Replace your existing sendData function with this improved version
const sendData = async () => {
  setIsLoading(true);
  const canvas = canvasRef.current;
  if (canvas) {
    try {
      const loadingToast = toast.loading("Analyzing your equation...");
      
      console.log('API URL:', API_BASE_URL); // Debug log
      console.log('Environment variables:', import.meta.env); // Debug log
      
      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}/calculate`,
        data: {
          image: canvas.toDataURL('image/png'),
          dict_of_vars: dictOfVars, 
        },
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const resp = response.data;
      toast.dismiss(loadingToast);
      
      // Handle the response based on your FastAPI backend structure
      if (resp && resp.data) {
        resp.data.forEach((data: Response) => {
          if(data.assign === true) {
            setDictOfVars(prevVars => ({
              ...prevVars,
              [data.expr]: data.result
            }));
          }
        });

        // Rest of your existing code for handling results...
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
        let hasDrawing = false;

        for (let y = 0; y < canvas.height; y++){
          for (let x = 0; x < canvas.width; x++){
            const i = (y * canvas.width + x) * 4;
            if(imageData.data[i + 3] > 0){
              hasDrawing = true;
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (!hasDrawing) {
          toast.error("Please draw something first!");
          setIsLoading(false);
          return;
        }

        const centerX = (maxX + minX) / 2;
        const centerY = (maxY + minY) / 2;
        const viewableX = Math.max(100, Math.min(centerX, window.innerWidth - 200));
        const viewableY = Math.max(100, Math.min(centerY, window.innerHeight - 100));
        
        setLatexPosition({ x: viewableX, y: viewableY });

        if (resp.data.length === 0) {
          toast.error("No calculation detected. Try drawing a clearer equation.");
        } else {
          toast.success(`Calculated ${resp.data.length} result${resp.data.length > 1 ? 's' : ''}`);
          
          resp.data.forEach((data: Response, index: number) => {
            setTimeout(() => {
              setResult({
                expression: data.expr,
                answer: data.result
              });

              if (index > 0) {
                setLatexPosition(prev => ({ 
                  x: prev.x + 20,
                  y: prev.y + 20
                }));
              }
            }, index * 500);
          });
        }
      } else {
        toast.error("Invalid response from server");
        console.error('Invalid response structure:', resp);
      }
    } catch (error: any) {
      console.error('Error sending data to API:', error);
      toast.dismiss(); // Dismiss loading toast
      
      if (error.code === 'ERR_NETWORK') {
        toast.error("Cannot connect to server. Check if backend is running and CORS is configured.");
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Server might be slow on free tier.");
      } else if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          toast.error("API endpoint not found. Check if /calculate endpoint exists.");
        } else if (status === 500) {
          toast.error("Server error. Check backend logs.");
        } else if (status === 422) {
          toast.error("Invalid request format. Check data structure.");
        } else {
          toast.error(`Server error: ${status} - ${error.response.statusText}`);
        }
        console.error('Response error:', error.response.data);
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }
};
 
  // Reset canvas function
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  // Delete a result
  const deleteResult = (index: number) => {
    setLatexExpression(prev => prev.filter((_, i) => i !== index));
  };

  // Load calculation from history
  const loadFromHistory = (item: HistoryItem) => {
    renderLatexToCanvas(item.expression, item.answer);
    setShowHistory(false);
    toast.success("Loaded calculation from history");
  };

  // Format functions
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setCanvasBackground(newTheme === 'dark' ? '#121212' : '#f0f0f0');
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('smartSumTheme', newTheme);
  };

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('smartSumTheme');
    if (savedTheme) {
      setTheme(savedTheme);
      setCanvasBackground(savedTheme === 'dark' ? '#121212' : '#f0f0f0');
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Color selection handler
  const selectColorSwatch = (swatch: string) => {
    setColor(swatch);
    setLatexColor(swatch);
    setShowColorPicker(false);
    toast.success("Color changed", { duration: 1000 });
  };

  // Menu item handler
  const handleMenuItemClick = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'history':
        setShowHistory(true);
        break;
      case 'settings':
        setShowSettings(true);
        break;
      case 'tutorial':
        setShowTutorial(true);
        break;
      case 'share':
        shareResult();
        break;
      case 'theme':
        toggleTheme();
        break;
    }
  };

  return (
    <div className={`${theme} min-h-screen font-sans`}>
      <Toaster position="bottom-center" toastOptions={{
        className: theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-800',
        style: {
          border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: theme === 'dark' 
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' 
            : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        },
      }} />

      {/* App Branding */}
      <div className="fixed top-5 left-5 z-50 flex items-center">
        <div className="glass-panel p-2 px-5 rounded-full flex items-center">
          <span className="text-white font-bold mr-1">Smart</span>
          <span className="text-green-400 font-bold">Sum</span>
          <span className="text-xs bg-green-400/20 text-green-400 px-1.5 ml-2 rounded-full">AI</span>
        </div>
      </div>

      {/* Main Menu Button */}
      <div className="fixed top-5 right-5 z-50">
        <button
          id="menu-button"
          onClick={() => setShowMenu(!showMenu)}
          className="glass-panel hover:bg-zinc-700/80 text-white rounded-full p-3 flex items-center justify-center w-10 h-10 active:scale-95 transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Menu Panel */}
      {showMenu && (
        <div 
          id="menu-panel" 
          className="fixed top-16 right-5 glass-panel p-4 rounded-xl z-50 w-64 animate-in fade-in slide-in-from-right duration-200 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2">
            <button 
              onClick={() => handleMenuItemClick('history')}
              className="flex items-center space-x-3 text-white hover:bg-white/10 w-full p-3 rounded-lg transition-colors"
            >
              <History size={18} className="text-green-400" />
              <span>Calculation History</span>
            </button>
            
            <button 
              onClick={() => handleMenuItemClick('settings')}
              className="flex items-center space-x-3 text-white hover:bg-white/10 w-full p-3 rounded-lg transition-colors"
            >
              <Settings size={18} className="text-green-400" />
              <span>Settings</span>
            </button>
            
            <button 
              onClick={() => handleMenuItemClick('tutorial')}
              className="flex items-center space-x-3 text-white hover:bg-white/10 w-full p-3 rounded-lg transition-colors"
            >
              <HelpCircle size={18} className="text-green-400" />
              <span>How to Use</span>
            </button>

            <button 
              onClick={() => handleMenuItemClick('share')}
              className="flex items-center space-x-3 text-white hover:bg-white/10 w-full p-3 rounded-lg transition-colors"
            >
              <Share size={18} className="text-green-400" />
              <span>Share Result</span>
            </button>

            <div className="h-px bg-white/10 my-2"></div>

            <button 
              onClick={() => handleMenuItemClick('theme')}
              className="flex items-center space-x-3 text-white hover:bg-white/10 w-full p-3 rounded-lg transition-colors"
            >
              <Info size={18} className="text-green-400" />
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modern Floating Toolbar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 glass-panel p-2 rounded-full z-40 overflow-x-auto max-w-[95vw]">
        <Tooltip label="Reset canvas">
          <button 
            onClick={() => setReset(true)} 
            className="toolbar-button w-10 h-10 flex items-center justify-center active:scale-95 transition-all"
          >
            <RotateCcw size={18} />
          </button>
        </Tooltip>
        
        <Tooltip label="Change color">
          <button 
            id="palette-button"
            onClick={() => setShowColorPicker(!showColorPicker)} 
            className="toolbar-button w-10 h-10 flex items-center justify-center active:scale-95 transition-all"
            style={{ color }}
          >
            <Palette size={18} />
          </button>
        </Tooltip>
        
        <div className="h-6 w-px bg-zinc-600 mx-1"></div>
        
        <Tooltip label="Decrease brush size">
          <button 
            onClick={() => setLineWidth(prev => Math.max(1, prev - 1))} 
            className="toolbar-button w-10 h-10 flex items-center justify-center active:scale-95 transition-all"
          >
            <Minus size={18} />
          </button>
        </Tooltip>
        
        <div className="text-white text-xs font-medium px-2 bg-zinc-700/50 rounded-full">{lineWidth}px</div>
        
        <Tooltip label="Increase brush size">
          <button 
            onClick={() => setLineWidth(prev => Math.min(20, prev + 1))} 
            className="toolbar-button w-10 h-10 flex items-center justify-center active:scale-95 transition-all"
          >
            <Plus size={18} />
          </button>
        </Tooltip>
        
        <div className="h-6 w-px bg-zinc-600 mx-1"></div>
        
        <Tooltip label="Erase drawing">
          <button 
            onClick={resetCanvas} 
            className="toolbar-button w-10 h-10 flex items-center justify-center active:scale-95 transition-all"
          >
            <Eraser size={18} />
          </button>
        </Tooltip>
        
        <Tooltip label="Save as image">
          <button 
            onClick={saveCanvas} 
            className="toolbar-button w-10 h-10 flex items-center justify-center active:scale-95 transition-all"
          >
            <Download size={18} />
          </button>
        </Tooltip>
        
        <Tooltip label="Debug Environment">
          <button 
            onClick={debugEnvironment} 
            className="toolbar-button w-10 h-10 flex items-center justify-center active:scale-95 transition-all bg-blue-600 hover:bg-blue-700"
          >
            <Settings size={18} />
          </button>
        </Tooltip>
        
        <Button 
          onClick={sendData} 
          className="gradient-button rounded-full ml-2 active:scale-95 transition-all"
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? "Processing..." : "Calculate"}
          {!isLoading && <Send size={16} className="ml-1" />}
        </Button>
      </div>
      
      {/* Color Picker Panel */}
      {showColorPicker && (
        <div 
          id="color-picker-panel" 
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 glass-panel p-4 rounded-xl z-50 animate-in fade-in slide-in-from-bottom duration-200 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-white text-sm font-medium mb-3 text-center">Choose Color</h3>
          <div className="grid grid-cols-6 gap-3">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch}
                onClick={() => selectColorSwatch(swatch)}
                className="cursor-pointer w-10 h-10 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-lg relative active:scale-90"
                style={{ 
                  backgroundColor: swatch,
                  border: swatch === color ? '2px solid white' : '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {swatch === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check size={16} color="white" className="drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
        style={{
          transition: "background-color 0.5s ease"
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />

      {/* Results */}
      {latexExpression && latexExpression.map((latex, index) => (
        <Draggable 
          key={index} 
          defaultPosition={latexPosition} 
          onStop={(_, data) => setLatexPosition({ x: data.x, y: data.y })}
          bounds="parent"
        >
          <div 
            className="absolute result-card glass-panel z-30 cursor-move" 
            style={{ 
              minWidth: '180px', 
              textAlign: 'center',
              color: latexColor
            }}
          >
            <div 
              className="latex-content relative pb-2" 
              style={{ color: latexColor }}
              dangerouslySetInnerHTML={{ __html: latex }}
            />
            <div className="absolute -top-2 -right-2 z-20">
              <button
                onClick={() => deleteResult(index)}
                className="bg-red-500/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center active:scale-95 transition-transform"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </Draggable>
      ))}

      {/* History Panel */}
      <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} className="max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Calculation History</h2>
          <button 
            onClick={() => setShowHistory(false)} 
            className="text-white hover:bg-zinc-700 rounded-full p-2 active:scale-95 transition-transform"
          >
            <X size={24} />
          </button>
        </div>
        
        {calculationHistory.length > 0 ? (
          <div>
            {(() => {
              const groupedHistory: Record<string, HistoryItem[]> = {};
              
              calculationHistory.forEach(item => {
                const date = formatDate(item.timestamp);
                if (!groupedHistory[date]) {
                  groupedHistory[date] = [];
                }
                groupedHistory[date].push(item);
              });
              
              return Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date} className="mb-4">
                  <h3 className="text-white font-medium text-sm mb-2">{date}</h3>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div 
                        key={i}
                        onClick={() => loadFromHistory(item)}
                        className="p-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 cursor-pointer transition-colors active:scale-[0.99]"
                      >
                        <div className="text-green-400 text-sm font-medium">{item.expression} = {item.answer}</div>
                        <div className="text-zinc-400 text-xs mt-1">{formatTime(item.timestamp)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 mb-3">
              <History size={24} className="text-zinc-400" />
            </div>
            <p className="text-zinc-400">No calculations yet</p>
            <p className="text-zinc-500 text-sm mt-1">Draw something and tap calculate</p>
          </div>
        )}
      </Modal>

      {/* Settings Panel */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button 
            onClick={() => setShowSettings(false)}
            className="text-white hover:bg-zinc-700 rounded-full p-2 active:scale-95 transition-transform"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Theme</span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-sm">Dark</span>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  theme === 'dark' ? 'bg-zinc-700' : 'bg-green-500'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  theme === 'dark' ? 'left-0.5' : 'left-6.5 transform translate-x-0.5'
                }`} />
              </button>
              <span className="text-zinc-400 text-sm">Light</span>
            </div>
          </div>
          
          <div>
            <label className="text-white font-medium block mb-2">Default Pen Color</label>
            <div className="grid grid-cols-6 gap-2">
              {SWATCHES.slice(0, 6).map(swatch => (
                <button 
                  key={swatch}
                  onClick={() => {
                    setColor(swatch);
                    setLatexColor(swatch);
                    toast.success("Color changed", { duration: 1000 });
                  }}
                  className={`w-8 h-8 rounded-full transition-transform active:scale-90 ${color === swatch ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'}`}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-white font-medium block mb-2">Brush Size</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white ml-3 w-8 text-center">{lineWidth}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={() => {
                setCalculationHistory([]);
                localStorage.removeItem('smartSumHistory');
                toast.success("History cleared");
                setShowSettings(false);
              }}
              className="bg-red-500/80 hover:bg-red-600 text-white w-full"
            >
              <Trash2 size={16} className="mr-1" /> Clear History
            </Button>
          </div>
        </div>
      </Modal>

      {/* Tutorial Panel */}
      <Modal isOpen={showTutorial} onClose={() => setShowTutorial(false)} className="max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">How to Use SmartSum</h2>
          <button 
            onClick={() => setShowTutorial(false)}
            className="text-white hover:bg-zinc-700 rounded-full p-2 active:scale-95 transition-transform"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-5 text-white">
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <h3 className="text-lg font-medium text-green-400 mb-2 flex items-center">
              <span className="bg-green-500/20 p-1 rounded-full mr-2">
                <Palette className="w-4 h-4" />
              </span>
              Drawing Equations
            </h3>
            <p className="text-zinc-300">Draw any mathematical expression or equation on the canvas using your mouse or touch screen.</p>
          </div>
          
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <h3 className="text-lg font-medium text-green-400 mb-2 flex items-center">
              <span className="bg-green-500/20 p-1 rounded-full mr-2">
                <Send className="w-4 h-4" />
              </span>
              Calculating Results
            </h3>
            <p className="text-zinc-300">Click the "Calculate" button to analyze your drawing and get the result.</p>
          </div>
          
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <h3 className="text-lg font-medium text-green-400 mb-2 flex items-center">
              <span className="bg-green-500/20 p-1 rounded-full mr-2">
                <History className="w-4 h-4" />
              </span>
              Managing Results
            </h3>
            <p className="text-zinc-300">Drag result boxes anywhere on the screen. Access your calculation history from the menu.</p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
            <h3 className="text-lg font-medium text-white mb-2">Tips</h3>
            <ul className="list-disc pl-5 text-zinc-300 space-y-2">
              <li>Write clearly for better recognition</li>
              <li>Use different colors for complex equations</li>
              <li>Save your work using the download button</li>
              <li>Adjust pen size for better precision</li>
            </ul>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={() => setShowTutorial(false)}
              className="gradient-button w-full py-2"
            >
              Got it!
            </Button>
          </div>
        </div>
      </Modal>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1000]">
          <div className="glass-panel p-8 rounded-xl max-w-xs w-full">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-green-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white text-center font-medium text-lg">Processing your equation...</p>
            <p className="text-zinc-400 text-center text-sm mt-2">AI is analyzing your drawing</p>
          </div>
        </div>
      )}

      {/* Onboarding modal */}
      {firstVisit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000]">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-xl shadow-2xl border border-green-500/20 max-w-md w-full">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
              <Check className="text-white w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome to SmartSum!</h2>
            <p className="text-zinc-300 text-center mb-8">
              Draw any mathematical equation and let AI solve it for you.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Palette className="text-green-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Draw Your Equation</h3>
                  <p className="text-zinc-400 text-sm">Use the canvas to draw any math expression</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Send className="text-green-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Click Calculate</h3>
                  <p className="text-zinc-400 text-sm">Our AI will process and solve your equation</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Download className="text-green-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Save Your Work</h3>
                  <p className="text-zinc-400 text-sm">Download your calculations or access history later</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setFirstVisit(false);
                setTimeout(() => {
                  setShowTutorial(true);
                }, 500);
              }}
              className="gradient-button w-full mt-8 py-2.5"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}