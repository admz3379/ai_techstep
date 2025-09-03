// Countdown Timer for 28-Day AI Challenge
function startCountdown() {
  const countdownElement = document.getElementById('countdown-timer');
  if (!countdownElement) return;
  
  // Set countdown to 24 hours from now
  const now = new Date().getTime();
  const countDownDate = now + (24 * 60 * 60 * 1000);
  
  const timer = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    countdownElement.innerHTML = 
      String(hours).padStart(2, '0') + ":" + 
      String(minutes).padStart(2, '0') + ":" + 
      String(seconds).padStart(2, '0');
    
    if (distance < 0) {
      clearInterval(timer);
      countdownElement.innerHTML = "00:00:00";
    }
  }, 1000);
}

// Auto-start countdown when page loads
document.addEventListener('DOMContentLoaded', startCountdown);