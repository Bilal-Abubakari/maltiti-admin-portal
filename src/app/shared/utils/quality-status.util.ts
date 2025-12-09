/**
 * Utility function for determining quality status severity
 * Used for displaying status tags in the UI
 */

/**
 * Determines the severity level for a quality status
 * @param status - The quality status string (e.g., 'passed', 'pending', 'failed')
 * @returns The severity level for PrimeNG Tag component
 */
export function getQualityStatusSeverity(status?: string): 'success' | 'warn' | 'danger' | 'info' {
  if (!status) {
    return 'info';
  }
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('pass')) {
    return 'success';
  }
  if (lowerStatus.includes('pending')) {
    return 'warn';
  }
  if (lowerStatus.includes('fail')) {
    return 'danger';
  }
  return 'info';
}

