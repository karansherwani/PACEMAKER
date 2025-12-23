// lib/cheatDetection.ts

export class CheatDetectionManager {
    private studentId: string;
    private courseId: string;
    private tabSwitchCount = 0;
    private onCheatDetected: () => void;
  
    constructor(
      studentId: string,
      courseId: string,
      onCheatDetected: () => void
    ) {
      this.studentId = studentId;
      this.courseId = courseId;
      this.onCheatDetected = onCheatDetected;
    }
  
    // Initialize all detection mechanisms
    initialize() {
      this.detectTabSwitch();
      this.enforceFullscreen();
      this.detectScreenShare();
    }
  
    // Detect tab switch and auto-submit
    private detectTabSwitch() {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.tabSwitchCount++;
          console.warn('Tab switch detected:', this.tabSwitchCount);
          
          if (this.tabSwitchCount >= 1) {
            // Auto-submit quiz
            this.onCheatDetected();
          }
        }
      });
  
      // Also detect focus loss
      window.addEventListener('blur', () => {
        this.tabSwitchCount++;
        if (this.tabSwitchCount >= 1) {
          this.onCheatDetected();
        }
      });
    }
  
    // Enforce fullscreen mode
    private enforceFullscreen() {
      const enterFullscreen = () => {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err);
        });
      };
  
      enterFullscreen();
  
      // Exit fullscreen = auto-submit
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          console.warn('Student exited fullscreen');
          this.onCheatDetected();
        }
      });
    }
  
    // Detect screen capture attempts
    private detectScreenShare() {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // Prevent screen sharing
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        
        navigator.mediaDevices.getDisplayMedia = async function (...args) {
          console.warn('Screen share attempt detected');
          return originalGetDisplayMedia.apply(this, args);
        };
      }
    }
  
    // Log suspicious activity
    async logAttempt(tabSwitches: number, timeTaken: number) {
      await fetch('/api/quiz/log-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: this.studentId,
          courseId: this.courseId,
          tabSwitchCount: tabSwitches,
          timeTaken,
          timestamp: new Date(),
        }),
      });
    }
  }
  