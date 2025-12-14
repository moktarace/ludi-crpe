import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: any;
  public installable = false;

  constructor(private platform: Platform) {
    this.setupInstallPrompt();
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      this.installable = true;
      console.log('📱 PWA installable');
    });

    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      this.deferredPrompt = null;
      this.installable = false;
    });
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferredPrompt so it can only be used once
    this.deferredPrompt = null;
    this.installable = false;
    
    return outcome === 'accepted';
  }

  isIos(): boolean {
    return this.platform.IOS;
  }

  isAndroid(): boolean {
    return this.platform.ANDROID;
  }

  getInstallInstructions(): string {
    if (this.isIos()) {
      return '🍎 Installation sur iOS\n\n' +
             '1. Ouvre cette page dans Safari\n' +
             '2. Clique sur le bouton Partager en bas\n' +
             '3. Sélectionne "Sur l\'écran d\'accueil"\n' +
             '4. Clique sur "Ajouter"\n\n' +
             'L\'icône MathLingo apparaîtra sur ton écran d\'accueil !';
    } else if (this.isAndroid()) {
      return '📱 Installation sur Android\n\n' +
             '1. Ouvre le menu ⋮ de Chrome\n' +
             '2. Clique sur "Installer l\'application"\n' +
             '3. Confirme en cliquant sur "Installer"\n\n' +
             'L\'icône MathLingo apparaîtra sur ton écran d\'accueil !';
    } else {
      return '💻 Installation sur ordinateur\n\n' +
             'Clique sur l\'icône d\'installation dans la barre d\'adresse de ton navigateur.';
    }
  }
}
