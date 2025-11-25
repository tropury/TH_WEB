'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

// --- MOCK DATA ---
const PORTFOLIO_IMAGES = [
  { id: 1, image: '/portfolio/project1.jpg', title: 'Warehouse' },
  { id: 2, image: '/portfolio/project2.jpg', title: 'Bedroom' },
  { id: 3, image: '/portfolio/project3.jpg', title: 'Tucunaré' },
  { id: 4, image: '/portfolio/project4.jpg', title: 'Black Building' },
  { id: 5, image: '/portfolio/project5.jpg', title: 'Living room' },
  { id: 6, image: '/portfolio/project6.jpg', title: 'TH Speaker' },
  { id: 7, image: '/portfolio/project7.jpg', title: 'Bathroom View' },
  { id: 8, image: '/portfolio/project8.jpg', title: 'Kitchen' },
];

const SOCIAL_LINKS = [
  { name: 'instagram', label: 'daily', url: 'https://www.instagram.com/th_studio3d/' },
  { name: 'linkedin', label: 'professional', url: 'https://www.linkedin.com/in/diegostreyveiga/' },
  { name: 'behance', label: 'creative', url: 'https://www.behance.net/diegostrey' },
  { name: 'tiktok', label: 'trend', url: 'https://www.tiktok.com/@diego_thstudio' },
  { name: 'cgarchitect', label: 'design', url: 'https://www.cgarchitect.com/members/diego-strey' },
];

export default function TreeHouseSite() {
  // Estados: 'landing', 'menu', 'portfolio', 'contact'
  const [view, setView] = useState('landing');
  const [hoverCircle, setHoverCircle] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- LOGIC FOR ANIMATIONS ---
  
  // Função para retornar ao menu ao clicar no círculo em sub-páginas
  const handleCircleClick = () => {
    if (view === 'landing') {
      setView('menu');
    } else if (view === 'menu') {
      // No menu, o clique no círculo não faz nada específico, 
      // a navegação é feita pelos textos ao redor
    } else {
      setView('menu');
    }
  };

  // Resetar scroll ao mudar de view
  useEffect(() => {
    window.scrollTo(0,0);
  }, [view]);

  // Classes dinâmicas baseadas no estado
  const getBluePanelClass = () => {
    // Mobile: Height control | Desktop: Width control
    switch (view) {
      case 'landing': return 'h-0 w-full md:h-full md:w-0'; // Invisível na landing
      case 'menu': return 'h-[50vh] w-full md:h-full md:w-1/2'; // Metade
      case 'portfolio': return 'h-full w-full md:h-full md:w-full'; // Tela cheia
      case 'contact': return 'h-0 w-full md:h-full md:w-0'; // Sugado (some)
      default: return 'w-0';
    }
  };

  const getDarkPanelClass = () => {
    // Visível apenas na Landing
    return view === 'landing' ? 'opacity-100 z-10' : 'opacity-0 z-0 delay-0 pointer-events-none';
  };

  // Posição e estilo do Círculo Mágico
  const getCircleStyle = () => {
    const base = "absolute transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] flex items-center justify-center cursor-pointer z-50 rounded-full shadow-xl";
    
    // Tamanhos - Reduced size to prevent extending beyond page
    let size = "w-14 h-14 md:w-16 md:h-16";
    if (view === 'landing' && hoverCircle) size = "w-16 h-16 md:w-18 md:h-18";
    
    // Cores
    let color = "bg-blue-600"; // Default blue
    if (view === 'menu') color = "bg-zinc-900"; // Dark grey no menu
    if (view === 'portfolio') color = "bg-[#E8E0D5]"; // Beige no portfolio
    if (view === 'contact') color = "bg-blue-600"; // Blue no contact

    // Posições (usando classes do Tailwind + style inline para coordenadas precisas se necessário, mas aqui usaremos classes de posicionamento relativo ao viewport)
    // Mobile first, then md: (desktop)
    
    let position = "";
    
    if (view === 'landing') {
        // Landing: Centro da divisão. 
        // Mobile: top-1/2 (meio da tela vert). Desktop: bottom-0 (pé da pagina) ou meio.
        // Pelo design: Desktop é bottom center da area preta ou meio. Vamos por no meio da divisão.
        position = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[90%] md:left-1/2"; 
    } else if (view === 'menu') {
        // Menu: Slide to top center
        position = "top-10 left-1/2 -translate-x-1/2";
    } else if (view === 'portfolio') {
        // Portfolio: Topo direito alinhado com logo - moved to left
        position = "top-10 right-20";
    } else if (view === 'contact') {
        // Contact: Alinhado com logo - moved to left
        position = "top-10 right-20";
    }

    return `${base} ${size} ${color} ${position}`;
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white font-sans text-zinc-800 selection:bg-blue-200">
      
      {/* --- LAYER 1: DARK PANEL (Landing Left) --- */}
      <div 
        className={`absolute top-0 left-0 w-full h-[50vh] md:h-full md:w-1/2 bg-[#2a2a2a] transition-opacity duration-700 ${getDarkPanelClass()} flex items-center justify-center`}
      >
        <img 
          src="/treehouse-logo.png" 
          alt="Tree House" 
          className="w-32 h-32 md:w-48 md:h-48 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'flex';
          }}
        />
        <div className="text-[#E8E0D5] font-serif text-5xl md:text-7xl leading-tight" style={{display: 'none'}}>
          Tree<br/>House
        </div>
      </div>

      {/* --- LAYER 2: BLUE PANEL (Dynamic Background) --- */}
      <div 
        className={`absolute top-0 left-0 bg-blue-600 transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] z-20 overflow-hidden ${getBluePanelClass()}`}
      >
        {/* Conteúdo dentro do painel azul (Visível no Menu e Portfolio) */}
        
        {/* LOGO (Versão Branca para fundo Azul) */}
        <div 
            onClick={() => setView('landing')}
            className={`absolute top-6 left-6 md:top-10 md:left-10 cursor-pointer z-50 transition-opacity duration-500 ${view === 'contact' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <img 
              src="/treehouse-logo-white.png" 
              alt="Tree House" 
              className="w-16 h-8 md:w-20 md:h-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="flex items-center gap-2" style={{display: 'none'}}>
                <div className="font-serif text-2xl text-white font-bold">th</div>
                <div className="flex flex-col text-white leading-none">
                    <span className="font-bold text-sm">Tree</span>
                    <span className="font-bold text-sm">House</span>
                </div>
            </div>
        </div>

        {/* --- PORTFOLIO CONTENT (FULL SCREEN) --- */}
        <div className={`w-full h-full p-20 md:p-32 transition-opacity duration-500 ${view === 'portfolio' ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
             {/* Big Background Text */}
             <div className="absolute top-0 left-0 w-full h-48 flex justify-center items-center pointer-events-none select-none overflow-hidden">
                <span className="text-[20vw] font-serif italic text-blue-700 opacity-30 whitespace-nowrap">portfolio</span>
             </div>
             <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white italic font-serif text-xl z-30">portfolio</div>

             {/* Grid */}
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mt-10 md:mt-0 h-full overflow-y-auto pb-20 no-scrollbar">
                {PORTFOLIO_IMAGES.map((img) => (
                    <div 
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        className="aspect-square bg-white rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-center group"
                    >
                        <div className={`w-[90%] h-[90%] ${img.color} rounded-xl opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center text-blue-900 font-medium`}>
                            {/* Placeholder image logic */}
                            Preview
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* --- MENU LEFT CONTENT (PREVIEW) --- */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${view === 'menu' ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
            <div className="grid grid-cols-2 gap-4 w-3/4 max-w-md opacity-50 pointer-events-none grayscale">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-[4/3] bg-white rounded-lg flex items-center justify-center text-xs text-blue-600">
                        image preview
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- LAYER 3: WHITE CONTENT (Right/Bottom Side) --- */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="w-full h-full flex flex-col md:flex-row">
            {/* Espaço vazio onde fica o painel esquerdo/topo */}
            <div className="w-full h-[50vh] md:w-1/2 md:h-full"></div>
            
            {/* Conteúdo da Direita/Baixo */}
            <div className="w-full h-[50vh] md:w-1/2 md:h-full relative pointer-events-auto bg-white flex flex-col items-center justify-center p-8 md:p-16">
                
                {/* Logo Blue (Visible only on Landing/Contact/Menu Right) */}
                 <div 
                    onClick={() => setView('landing')}
                    className={`absolute top-6 left-6 md:top-10 md:-left-[45vw] cursor-pointer transition-opacity duration-300 ${view === 'contact' ? 'opacity-100 text-blue-600' : 'opacity-0 pointer-events-none'}`}
                >
                    <img 
                      src="/treehouse-logo-blue.png" 
                      alt="Tree House" 
                      className="w-16 h-8 md:w-20 md:h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="flex items-center gap-2" style={{display: 'none'}}>
                        <div className="font-serif text-2xl font-bold">th</div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-sm">Tree</span>
                            <span className="font-bold text-sm">House</span>
                        </div>
                    </div>
                </div>


                {/* LANDING RIGHT CONTENT */}
                <div className={`absolute transition-opacity duration-500 flex flex-col items-center text-center max-w-lg ${view === 'landing' ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
                    <h1 className="text-4xl md:text-6xl font-bold text-zinc-800 mb-8 uppercase tracking-tight">
                        We Make <br/> Visual <br/> Persuasion <br/> & Some Art
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base max-w-xs">
                        We blend design, storytelling, and technology to create visuals that resonate and inspire.
                    </p>
                </div>

                {/* MENU RIGHT CONTENT (Contacts Preview) */}
                <div className={`absolute transition-opacity duration-500 flex flex-col items-end gap-6 ${view === 'menu' ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
                    {/* Visual decorativo apenas simulando a lista de contatos do design */}
                    <div className="text-right space-y-8 opacity-40 blur-[1px] select-none pointer-events-none scale-75 origin-right">
                         <div className="text-4xl font-bold text-zinc-800">instagram</div>
                         <div className="text-4xl font-bold text-zinc-800">linkedin</div>
                         <div className="text-4xl font-bold text-zinc-800">behance</div>
                    </div>
                </div>

                 {/* CONTACT CONTENT (Full View) */}
                 <div className={`absolute w-full h-full flex flex-col items-center justify-center transition-opacity duration-500 ${view === 'contact' ? 'opacity-100 delay-500' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute top-1/2 left-510 md:left-200 -translate-y-1/2 text-2xl italic font-serif text-zinc-600">
                        <span className="relative">
                            contact
                            <div className="absolute top-full left-0 w-32 h-0.5 bg-zinc-800 transform -translate-y-1"></div>
                        </span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-10 md:gap-12 mt-10">
                        {SOCIAL_LINKS.map((link, idx) => (
                            <a 
                                key={link.name} 
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center text-zinc-800 hover:text-blue-600 transition-colors cursor-pointer"
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <span className="text-3xl md:text-5xl font-bold tracking-tight group-hover:scale-110 transition-transform duration-300">{link.name}</span>
                                <span className="text-xs md:text-sm text-zinc-500 font-light">{link.label}</span>
                            </a>
                        ))}
                    </div>
                 </div>

            </div>
        </div>
      </div>

      {/* --- THE MAGIC CIRCLE --- */}
      <div 
        onClick={handleCircleClick}
        onMouseEnter={() => setHoverCircle(true)}
        onMouseLeave={() => setHoverCircle(false)}
        className={getCircleStyle()}
      >
        {/* Circle Content based on View */}
        
        {/* Landing State */}
        {view === 'landing' && (
             <>
                {/* Menu text outside circle - left side */}
                {hoverCircle && (
                    <span className="absolute left-[40%] top-[-50%] text-gray text-xs font-medium whitespace-nowrap rotate-270">
                        menu
                    </span>
                )}
                {/* Menu text outside circle - right side */}
                {hoverCircle && (
                    <span className="absolute right-[40%] top-[130%] text-white text-xs font-medium whitespace-nowrap rotate-270">
                        menu
                    </span>
                )}
             </>
        )}

        {/* Menu State - Navigation Buttons attached to circle */}
        {view === 'menu' && (
            <>
                <div 
                    onClick={(e) => { e.stopPropagation(); setView('portfolio'); }}
                    className="absolute right-[120%] text-white text-sm cursor-pointer hover:text-blue-200 transition-colors font-medium whitespace-nowrap"
                >
                    portfolio
                </div>
                <div 
                    onClick={(e) => { e.stopPropagation(); setView('contact'); }}
                    className="absolute left-[120%] text-zinc-800 text-sm cursor-pointer hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
                >
                    contact
                </div>
            </>
        )}

        {/* Sub-page States (Labels near circle) */}
        {(view === 'portfolio' || view === 'contact') && (
            <>
                 <div className={`absolute right-[130%] text-sm font-medium ${view === 'portfolio' ? 'text-white' : 'text-zinc-800'} whitespace-nowrap opacity-60`}>
                    portfolio
                 </div>
                 <div className={`absolute left-[130%] text-sm font-medium ${view === 'portfolio' ? 'text-white' : 'text-zinc-800'} whitespace-nowrap`}>
                    contact
                 </div>
            </>
        )}
      </div>

      {/* --- VERTICAL TEXT INDICATORS REMOVED --- */}
      
      {/* --- VERTICAL TEXT SIDEBAR (Menu Only) --- */}
      {view === 'menu' && (
         <div className="fixed bottom-10 left-[48%] md:left-[52%] -translate-x-1/2 hidden md:block z-40">
             <div className="writing-vertical -rotate-180 text-blue-300 text-xs tracking-[0.2em] font-bold uppercase">
                 Seeking Visual
             </div>
         </div>
      )}


      {/* --- LIGHTBOX (Portfolio Detail) --- */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-blue-600/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSelectedImage(null)}
        >
            <div className="relative w-full max-w-5xl aspect-video bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-zinc-800"
                >
                    <X size={24} />
                </button>
                <div className={`w-full h-full ${selectedImage.color} flex items-center justify-center`}>
                    <h2 className="text-4xl md:text-6xl text-white font-serif italic">{selectedImage.title}</h2>
                </div>
            </div>
        </div>
      )}

      {/* --- CSS UTILS FOR WRITING MODE --- */}
      <style>{`
        .writing-vertical { writing-mode: vertical-rl; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
