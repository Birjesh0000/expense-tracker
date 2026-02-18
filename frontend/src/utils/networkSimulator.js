/**
 * Network Simulation Utility for Testing
 * Allows developers to simulate network failures and test retry behavior
 */

// Store network simulation config in sessionStorage
const STORAGE_KEY = '__expense_tracker_network_simulation__';

class NetworkSimulator {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            enabled: false,
            failureType: 'timeout', // 'timeout', 'error', 'slow'
            failureRate: 0.5, // 50% of requests fail
            failureCount: 0, // How many consecutive failures
            failureCountdown: 0, // Countdown to stop failing
            responseDelay: 0,
            simulationMode: false,
          };
    } catch {
      return {
        enabled: false,
        failureType: 'timeout',
        failureRate: 0.5,
        failureCount: 0,
        failureCountdown: 0,
        responseDelay: 0,
        simulationMode: false,
      };
    }
  }

  saveConfig() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Error saving network simulation config:', error);
    }
  }

  /**
   * Enable network failure simulation
   */
  enableFailures({
    failureType = 'timeout',
    failureRate = 0.5,
    failureCount = 0,
    responseDelay = 0,
  } = {}) {
    this.config.enabled = true;
    this.config.failureType = failureType;
    this.config.failureRate = failureRate;
    this.config.failureCount = failureCount;
    this.config.failureCountdown = failureCount;
    this.config.responseDelay = responseDelay;
    this.config.simulationMode = true;
    this.saveConfig();
    console.log('Network failures enabled:', this.config);
  }

  /**
   * Disable network failure simulation
   */
  disableFailures() {
    this.config.enabled = false;
    this.config.simulationMode = false;
    this.saveConfig();
    console.log('Network failures disabled');
  }

  /**
   * Check if this request should fail
   */
  shouldFail() {
    if (!this.config.enabled) return false;

    // If failureCount is set, fail that many times then stop
    if (this.config.failureCountdown > 0) {
      this.config.failureCountdown--;
      this.saveConfig();
      return true;
    }

    // Random failure based on rate
    return Math.random() < this.config.failureRate;
  }

  /**
   * Simulate a network request with potential failure
   */
  async simulateFetch(fetchFn, signal) {
    // Add response delay if configured
    if (this.config.responseDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.config.responseDelay));
    }

    // Check if this request should fail
    if (this.shouldFail()) {
      const error = new Error(`Network simulation: ${this.config.failureType}`);
      
      if (this.config.failureType === 'timeout') {
        error.message = 'Failed to fetch (Network timeout simulated)';
        throw error;
      } else if (this.config.failureType === 'error') {
        error.status = 500;
        error.message = 'Network simulation: Server error';
        throw error;
      } else if (this.config.failureType === 'network') {
        error.message = 'Failed to fetch (Network error simulated)';
        throw error;
      }
    }

    // Execute the actual fetch if it passes simulation
    return fetchFn(signal);
  }

  /**
   * Get current simulation status
   */
  getStatus() {
    return {
      ...this.config,
      message: this.config.enabled
        ? `Simulating ${this.config.failureType}s (${(this.config.failureRate * 100).toFixed(0)}% failure rate)`
        : 'Network simulation disabled',
    };
  }

  /**
   * Reset to defaults
   */
  reset() {
    this.config = {
      enabled: false,
      failureType: 'timeout',
      failureRate: 0.5,
      failureCount: 0,
      failureCountdown: 0,
      responseDelay: 0,
      simulationMode: false,
    };
    this.saveConfig();
    console.log('Network simulation reset to defaults');
  }
}

// Global instance
export const networkSimulator = new NetworkSimulator();

/**
 * Usage Examples:
 *
 * // Enable 50% failure rate for timeouts
 * networkSimulator.enableFailures({ failureType: 'timeout', failureRate: 0.5 });
 *
 * // Fail exactly 3 times, then stop
 * networkSimulator.enableFailures({ failureCount: 3 });
 *
 * // Simulate slow network with 2 second delay
 * networkSimulator.enableFailures({ responseDelay: 2000, failureType: 'slow' });
 *
 * // Check current status
 * console.log(networkSimulator.getStatus());
 *
 * // Disable
 * networkSimulator.disableFailures();
 *
 * // Reset
 * networkSimulator.reset();
 */

export default networkSimulator;
