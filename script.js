document.addEventListener('DOMContentLoaded', function() {
  // Get the root element
  const appRoot = document.getElementById('app');
  
  // Dark mode toggle function
  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }
  
  // Initialize theme from localStorage
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  
  // Check if year is a leap year
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
  
  // Get days in month
  function getDaysInMonth(year, month) {
    if (month === 1) { // February
      return isLeapYear(year) ? 29 : 28;
    }
    if ([3, 5, 8, 10].includes(month)) { // Apr, Jun, Sep, Nov
      return 30;
    }
    return 31;
  }
  
  // Get default target date (current date)
  function getDefaultTargetDate() {
    return new Date();
  }
  
  // Calculate age between two dates
  function calculateAge(birthDate, targetDate) {
    // Make sure we're working with date objects
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    // Calculate precise years, months, days
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();
    
    // Adjust for negative days
    if (days < 0) {
      // Get the last day of previous month in target date
      const lastDayOfPrevMonth = new Date(
        target.getFullYear(),
        target.getMonth(),
        0
      ).getDate();
      
      days += lastDayOfPrevMonth;
      months--;
    }
    
    // Adjust for negative months
    if (months < 0) {
      months += 12;
      years--;
    }
    
    // Calculate time units
    const ageInMilliseconds = target.getTime() - birth.getTime();
    
    // Basic time units in milliseconds
    const millisecondsInSecond = 1000;
    const millisecondsInMinute = millisecondsInSecond * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;
    const millisecondsInWeek = millisecondsInDay * 7;
    
    const totalSeconds = Math.floor(ageInMilliseconds / millisecondsInSecond);
    const totalMinutes = Math.floor(ageInMilliseconds / millisecondsInMinute);
    const totalHours = Math.floor(ageInMilliseconds / millisecondsInHour);
    const totalDays = Math.floor(ageInMilliseconds / millisecondsInDay);
    const totalWeeks = Math.floor(ageInMilliseconds / millisecondsInWeek);
    const totalMonths = years * 12 + months;
    
    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    };
  }
  
  // Array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Create app state
  const state = {
    birthDate: new Date(new Date().getFullYear() - 25, 4, 9), // Default to May 9, 25 years ago
    targetDate: getDefaultTargetDate(),
    ageResult: null,
    isError: false,
    showResults: false
  };
  
  // Render function
  function renderApp() {
    // Construct the HTML for the application
    appRoot.innerHTML = `
      <div class="min-h-screen flex flex-col">
        <header class="header">
          <div class="container">
            <div class="header-content">
              <div class="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"></path>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="M20 12h2"></path>
                  <path d="M2 12h2"></path>
                </svg>
                <h1 class="logo-text">Age Calculator</h1>
              </div>
              <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>
  
        <main class="flex-grow container py-10">
          <div class="max-w-4xl mx-auto">
            <div class="card mb-8">
              <div class="card-header">
                <div class="card-header-bg"></div>
                <div class="card-header-content">
                  <div class="icon-container">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                      <path d="M20 16L12 8L4 16"></path>
                      <path d="M4 8L12 16L20 8"></path>
                    </svg>
                  </div>
                  <h2 class="card-title">Calculate Age</h2>
                </div>
                <p class="mt-4 max-w-2xl">
                  Determine the precise age or time interval between two dates. Results will be displayed in years, months,
                  weeks, days, hours, minutes, and seconds.
                </p>
              </div>
  
              <div class="card-body">
                <form id="calculator-form" class="form-grid">
                  <!-- Date of Birth Input -->
                  <div class="form-section">
                    <div class="form-section-header">
                      <div class="icon-container">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <h3 class="form-section-title">Date of Birth</h3>
                    </div>
                    
                    <div class="form-input-container">
                      <div class="form-group">
                        <!-- Month Selector -->
                        <div class="form-control month">
                          <label for="birth-month" class="form-label">Month</label>
                          <select id="birth-month" class="select">
                            ${monthNames.map((month, index) => `
                              <option value="${index}" ${index === state.birthDate.getMonth() ? 'selected' : ''}>
                                ${month}
                              </option>
                            `).join('')}
                          </select>
                        </div>
  
                        <!-- Day Selector -->
                        <div class="form-control">
                          <label for="birth-day" class="form-label">Day</label>
                          <input 
                            id="birth-day" 
                            type="number" 
                            min="1" 
                            max="${getDaysInMonth(state.birthDate.getFullYear(), state.birthDate.getMonth())}" 
                            value="${state.birthDate.getDate()}" 
                            class="input"
                          >
                        </div>
  
                        <!-- Year Selector -->
                        <div class="form-control">
                          <label for="birth-year" class="form-label">Year</label>
                          <input 
                            id="birth-year" 
                            type="number" 
                            min="1900" 
                            max="2100" 
                            value="${state.birthDate.getFullYear()}" 
                            class="input"
                          >
                        </div>
                      </div>
  
                      <!-- Calendar Button -->
                      <button type="button" id="birth-calendar-btn" class="calendar-btn gradient-border">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Open Calendar
                      </button>
                    </div>
                  </div>
  
                  <!-- Age at the Date of Input -->
                  <div class="form-section">
                    <div class="form-section-header">
                      <div class="icon-container">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <h3 class="form-section-title">Age at the Date of</h3>
                    </div>
                    
                    <div class="form-input-container">
                      <div class="form-group">
                        <!-- Month Selector -->
                        <div class="form-control month">
                          <label for="target-month" class="form-label">Month</label>
                          <select id="target-month" class="select">
                            ${monthNames.map((month, index) => `
                              <option value="${index}" ${index === state.targetDate.getMonth() ? 'selected' : ''}>
                                ${month}
                              </option>
                            `).join('')}
                          </select>
                        </div>
  
                        <!-- Day Selector -->
                        <div class="form-control">
                          <label for="target-day" class="form-label">Day</label>
                          <input 
                            id="target-day" 
                            type="number" 
                            min="1" 
                            max="${getDaysInMonth(state.targetDate.getFullYear(), state.targetDate.getMonth())}" 
                            value="${state.targetDate.getDate()}" 
                            class="input"
                          >
                        </div>
  
                        <!-- Year Selector -->
                        <div class="form-control">
                          <label for="target-year" class="form-label">Year</label>
                          <input 
                            id="target-year" 
                            type="number" 
                            min="1900" 
                            max="2100" 
                            value="${state.targetDate.getFullYear()}" 
                            class="input"
                          >
                        </div>
                      </div>
  
                      <!-- Calendar Button -->
                      <button type="button" id="target-calendar-btn" class="calendar-btn gradient-border">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Open Calendar
                      </button>
                    </div>
                  </div>
                </form>
  
                <div class="form-actions">
                  <button id="calculate-btn" class="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    <span>Calculate Age</span>
                  </button>
                  <button id="reset-btn" class="btn btn-outline">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 2v6h6"></path>
                      <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                      <path d="M21 22v-6h-6"></path>
                      <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                    </svg>
                    <span>Reset</span>
                  </button>
                </div>
  
                ${state.showResults && state.ageResult ? `
                <div class="results gradient-border">
                  <div class="results-header">
                    <div class="icon-container">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent">
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path>
                        <path d="M12 7v5l2.5 2.5"></path>
                      </svg>
                    </div>
                    <h3 class="results-title">Age Calculation Results</h3>
                  </div>
                  
                  <div class="results-grid">
                    <div class="result-card">
                      <div class="result-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Primary Age:</span>
                      </div>
                      <p class="result-primary">${state.ageResult.years}</p>
                      <p class="result-unit">${state.ageResult.years === 1 ? 'year' : 'years'}</p>
                      
                      <div class="result-alternatives">
                        <p class="result-alternative-label">Alternative Measurements:</p>
                        <div class="result-alternative-item">
                          <span>Months</span>
                          <span class="result-alternative-value">${state.ageResult.totalMonths.toLocaleString()}</span>
                        </div>
                        <div class="result-alternative-item">
                          <span>Weeks</span>
                          <span class="result-alternative-value">${state.ageResult.totalWeeks.toLocaleString()}</span>
                        </div>
                        <div class="result-alternative-item">
                          <span>Days</span>
                          <span class="result-alternative-value">${state.ageResult.totalDays.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="result-card">
                      <div class="result-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Precise Age:</span>
                      </div>
                      <div class="precise-age">
                        ${state.ageResult.years} ${state.ageResult.years === 1 ? 'year' : 'years'}, 
                        ${state.ageResult.months} ${state.ageResult.months === 1 ? 'month' : 'months'}, 
                        ${state.ageResult.days} ${state.ageResult.days === 1 ? 'day' : 'days'}
                      </div>
                      
                      <div class="result-alternatives">
                        <div class="result-label">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>Time Units:</span>
                        </div>
                        <div class="result-alternative-item">
                          <span>Hours</span>
                          <span class="result-alternative-value">${state.ageResult.totalHours.toLocaleString()}</span>
                        </div>
                        <div class="result-alternative-item">
                          <span>Minutes</span>
                          <span class="result-alternative-value">${state.ageResult.totalMinutes.toLocaleString()}</span>
                        </div>
                        <div class="result-alternative-item">
                          <span>Seconds</span>
                          <span class="result-alternative-value">${state.ageResult.totalSeconds.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ` : ''}
  
                ${state.isError ? `
                <div class="error-message">
                  <p class="error-title">Invalid date selection</p>
                  <p>Please enter valid dates. The birth date must be earlier than the target date.</p>
                </div>
                ` : ''}
              </div>
            </div>
  
            <div class="card mb-8">
              <div class="card-header">
                <div class="card-header-bg"></div>
                <div class="card-header-content">
                  <div class="icon-container">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary">
                      <path d="M3 3v18h18"></path>
                      <path d="M18.4 7.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"></path>
                      <path d="m8 17-1.5-4 3-1 1.5 4"></path>
                      <path d="m14 13 .5-1.5 3 1L16 17"></path>
                    </svg>
                  </div>
                  <h2 class="card-title">Related Calculators</h2>
                </div>
              </div>
              <div class="card-body">
                <div class="flex items-center flex-wrap gap-4">
                  <a href="#" class="btn btn-outline gradient-border">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Date Calculator
                  </a>
                  <a href="#" class="btn btn-outline gradient-border">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Time Calculator
                  </a>
                </div>
              </div>
            </div>
  
            <div class="card">
              <div class="card-header">
                <div class="card-header-bg"></div>
                <div class="card-header-content">
                  <div class="icon-container">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <h2 class="card-title">Age Calculation Across Cultures</h2>
                </div>
              </div>
              <div class="card-body">
                <div class="info-section">
                  <div class="flex gap-2 items-center mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <p>
                      The age of a person can be counted differently in different cultures. This calculator is based on the most common age system. In this system, age increases on a person's birthday. For example, the age of a person who has lived for 3 years and 11 months is 3, and their age will increase to 4 on their next birthday one month later. Most western countries use this age system.
                    </p>
                  </div>
                  
                  <div class="info-section-card">
                    <h3 class="info-section-title">Different Cultural Age Systems</h3>
                    <p>
                      In some cultures, age is expressed by counting years with or without including the current year. For example, a person who is twenty years old is the same age as another person who is in their twenty-first year of life. In one of the traditional Chinese age systems, people are born at age 1 and their age increases up at the Traditional Chinese New Year rather than their birthday. For example, if one baby is born just one day before the Traditional Chinese New Year, 2 days later, the baby will be 2 even though he/she is only 2 days old.
                    </p>
                  </div>
                  
                  <div class="flex gap-2 items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-secondary">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <p>
                      In some situations, the months and day result of this age calculator may be confusing, especially when the starting date is the end of a month. For example, we count Feb. 20 to Mar. 20 to be one month. However, there are two ways to calculate the age from Feb. 28, 2022 to Mar. 31, 2022. If we consider Feb. 28 to Mar. 28 to be one month, then the result is one month and 3 days. If we consider both Feb. 28 and Mar. 31 as the end of the month, then the result is one month. Both calculation results are reasonable. Similar situations exist for dates like Apr. 30 to May 31, May 30 to June 30, etc. The confusion comes from the uneven number of days in different months. In our calculations, we use the former method.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
  
        <footer class="footer">
          <div class="container">
            <p class="footer-text">
              © ${new Date().getFullYear() === 2023 ? '2023' : `2023-${new Date().getFullYear()}`} <span class="footer-brand">Age Calculator</span>. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    `;
    
    // Add event listeners after rendering
    addEventListeners();
  }
  
  // Add event listeners to the DOM elements
  function addEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Birth date inputs
    const birthMonth = document.getElementById('birth-month');
    const birthDay = document.getElementById('birth-day');
    const birthYear = document.getElementById('birth-year');
    
    birthMonth.addEventListener('change', (e) => {
      const newMonth = parseInt(e.target.value);
      const newDate = new Date(state.birthDate);
      newDate.setMonth(newMonth);
      
      // Adjust day if it exceeds the max days in the new month
      const maxDays = getDaysInMonth(newDate.getFullYear(), newMonth);
      if (newDate.getDate() > maxDays) {
        newDate.setDate(maxDays);
      }
      
      state.birthDate = newDate;
      renderApp();
    });
    
    birthDay.addEventListener('change', (e) => {
      const day = parseInt(e.target.value);
      if (isNaN(day) || day < 1) return;
      
      const maxDays = getDaysInMonth(state.birthDate.getFullYear(), state.birthDate.getMonth());
      const validDay = Math.min(day, maxDays);
      
      const newDate = new Date(state.birthDate);
      newDate.setDate(validDay);
      state.birthDate = newDate;
    });
    
    birthYear.addEventListener('change', (e) => {
      const year = parseInt(e.target.value);
      if (isNaN(year) || year < 1) return;
      
      const newDate = new Date(state.birthDate);
      newDate.setFullYear(year);
      
      // Adjust day if it's February 29 on a non-leap year
      if (newDate.getMonth() === 1 && newDate.getDate() === 29) {
        const maxDays = getDaysInMonth(year, 1);
        if (maxDays < 29) {
          newDate.setDate(28);
        }
      }
      
      state.birthDate = newDate;
    });
    
    // Target date inputs
    const targetMonth = document.getElementById('target-month');
    const targetDay = document.getElementById('target-day');
    const targetYear = document.getElementById('target-year');
    
    targetMonth.addEventListener('change', (e) => {
      const newMonth = parseInt(e.target.value);
      const newDate = new Date(state.targetDate);
      newDate.setMonth(newMonth);
      
      // Adjust day if it exceeds the max days in the new month
      const maxDays = getDaysInMonth(newDate.getFullYear(), newMonth);
      if (newDate.getDate() > maxDays) {
        newDate.setDate(maxDays);
      }
      
      state.targetDate = newDate;
      renderApp();
    });
    
    targetDay.addEventListener('change', (e) => {
      const day = parseInt(e.target.value);
      if (isNaN(day) || day < 1) return;
      
      const maxDays = getDaysInMonth(state.targetDate.getFullYear(), state.targetDate.getMonth());
      const validDay = Math.min(day, maxDays);
      
      const newDate = new Date(state.targetDate);
      newDate.setDate(validDay);
      state.targetDate = newDate;
    });
    
    targetYear.addEventListener('change', (e) => {
      const year = parseInt(e.target.value);
      if (isNaN(year) || year < 1) return;
      
      const newDate = new Date(state.targetDate);
      newDate.setFullYear(year);
      
      // Adjust day if it's February 29 on a non-leap year
      if (newDate.getMonth() === 1 && newDate.getDate() === 29) {
        const maxDays = getDaysInMonth(year, 1);
        if (maxDays < 29) {
          newDate.setDate(28);
        }
      }
      
      state.targetDate = newDate;
    });
    
    // Calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    calculateBtn.addEventListener('click', () => {
      if (state.birthDate >= state.targetDate) {
        state.isError = true;
        state.showResults = false;
      } else {
        state.isError = false;
        state.ageResult = calculateAge(state.birthDate, state.targetDate);
        state.showResults = true;
      }
      renderApp();
    });
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', () => {
      state.targetDate = getDefaultTargetDate();
      state.ageResult = null;
      state.showResults = false;
      state.isError = false;
      renderApp();
    });
    
    // Calendar buttons (we're not implementing the calendar picker in this basic version)
    const birthCalendarBtn = document.getElementById('birth-calendar-btn');
    const targetCalendarBtn = document.getElementById('target-calendar-btn');
    
    birthCalendarBtn.addEventListener('click', () => {
      alert('Calendar functionality would open here. For simplicity in this static version, please use the dropdown and input fields.');
    });
    
    targetCalendarBtn.addEventListener('click', () => {
      alert('Calendar functionality would open here. For simplicity in this static version, please use the dropdown and input fields.');
    });
  }
  
  // Render the initial app
  renderApp();
});