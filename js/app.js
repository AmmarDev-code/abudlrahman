/**
 * Main Application Logic
 * Portfolio of Eng. Abdulrahman Abdulhakeem
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. STATE INITIALIZATION & PREFERENCES
  // ------------------------------------------------------------------------
  let currentLang = localStorage.getItem('abdulrahman_lang') || 'ar';
  // Default to light (white) mode as requested by user
  let currentTheme = localStorage.getItem('abdulrahman_theme_v2') || 'light';

  // ------------------------------------------------------------------------
  // 2. THEME ENGINE
  // ------------------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('abdulrahman_theme_v2', theme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
      } else {
        themeIcon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
      }
    }
  }

  function toggleTheme() {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  // ------------------------------------------------------------------------
  // 3. I18N ENGINE (ARABIC <-> ENGLISH)
  // ------------------------------------------------------------------------
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('abdulrahman_lang', lang);

    const isRtl = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    // Update Language Toggle Button Text
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
      langToggleBtn.querySelector('.lang-label').textContent = isRtl ? 'English' : 'العربية';
    }

    // Translate all elements with data-i18n
    const trans = translations[lang];
    if (!trans) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (trans[key]) {
        el.textContent = trans[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (trans[key]) {
        el.placeholder = trans[key];
      }
    });

    // Update WhatsApp links with language-specific prefilled message
    updateWhatsAppLinks();
    
    // Refresh calculator outputs with appropriate numerals/formats
    updateSimulator();
  }

  function toggleLanguage() {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLanguage(nextLang);
  }

  function updateWhatsAppLinks() {
    const phoneNumber = '967737387018';
    const message = encodeURIComponent(translations[currentLang].whatsapp_msg_prefill);
    const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    document.querySelectorAll('.whatsapp-link').forEach(link => {
      link.href = waUrl;
    });
  }

  // ------------------------------------------------------------------------
  // 4. EVENT LISTENERS: THEME & LANG SWITCHERS
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLanguage);
  }

  // Apply initial theme and language
  applyTheme(currentTheme);
  applyLanguage(currentLang);

  // ------------------------------------------------------------------------
  // 5. NAVBAR SCROLL EFFECT & SCROLLSPY
  // ------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-bottom-item');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header Blur and Shadow
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Spy
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });
  }

  if (drawerCloseBtn && mobileDrawer) {
    drawerCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  }

  // Close drawer on link click
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    });
  });

  // ------------------------------------------------------------------------
  // 6. BUSINESS ROI / EFFICIENCY CALCULATOR
  // ------------------------------------------------------------------------
  const simRange = document.getElementById('simOrdersRange');
  const simValDisplay = document.getElementById('simOrdersValue');
  const simHoursDisplay = document.getElementById('simHoursSaved');
  const simCostDisplay = document.getElementById('simCostSaved');

  function updateSimulator() {
    if (!simRange) return;
    const orders = parseInt(simRange.value, 10);
    if (simValDisplay) {
      simValDisplay.textContent = orders.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
    }

    // Approx 5 mins (0.083 hours) manual typing & bookkeeping saved per order
    const hoursSaved = Math.round(orders * 0.08);
    // Approx $0.40 - $0.60 saved per transaction in labor, invoice checks, and dispute avoidance
    const costSaved = Math.round(orders * 0.55);

    if (simHoursDisplay) {
      simHoursDisplay.textContent = hoursSaved.toLocaleString() + (currentLang === 'ar' ? ' ساعة' : ' hrs');
    }
    if (simCostDisplay) {
      simCostDisplay.textContent = '$' + costSaved.toLocaleString();
    }
  }

  if (simRange) {
    simRange.addEventListener('input', updateSimulator);
    updateSimulator();
  }

  // ------------------------------------------------------------------------
  // 7. SKILLS MATRIX FILTERING
  // ------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 8. INTERACTIVE SPOTLIGHT DEMO (LIVE ACCOUNTING & POS SIMULATOR)
  // ------------------------------------------------------------------------
  let demoStock = 24;
  let demoSalesCount = 0;
  let demoRevenue = 0;
  const initialStock = 24;

  const demoStockEl = document.getElementById('demoStockCount');
  const demoSalesEl = document.getElementById('demoTotalSales');
  const demoLogContainer = document.getElementById('demoLedgerLog');
  const demoBuyBtn = document.getElementById('demoBuyBtn');
  const demoResetBtn = document.getElementById('demoResetBtn');

  function renderDemo() {
    if (demoStockEl) demoStockEl.textContent = demoStock;
    if (demoSalesEl) demoSalesEl.textContent = '$' + demoRevenue;
  }

  if (demoBuyBtn) {
    demoBuyBtn.addEventListener('click', () => {
      if (demoStock <= 0) {
        alert(currentLang === 'ar' ? 'نفذ المخزون! يرجى إعادة ضبط المحاكاة.' : 'Out of stock! Please reset simulation.');
        return;
      }

      demoStock--;
      demoSalesCount++;
      demoRevenue += 150;
      renderDemo();

      // Generate simulated double-entry journal entry
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const invNum = 1000 + demoSalesCount;

      const logEntry = document.createElement('div');
      logEntry.className = 'ledger-entry';
      logEntry.style.cssText = `
        background: var(--bg-surface-elevated);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        margin-bottom: 0.6rem;
        font-family: monospace;
        font-size: 0.82rem;
        animation: fadeIn 0.3s ease;
      `;

      logEntry.innerHTML = `
        <div style="display:flex; justify-content:space-between; color:var(--primary-500); font-weight:700; margin-bottom:4px;">
          <span>⚡ ${currentLang === 'ar' ? 'فاتورة بيع رقم' : 'INVOICE'} #${invNum}</span>
          <span>${timeStr}</span>
        </div>
        <div style="color:var(--emerald-500)">+ DR: ${currentLang === 'ar' ? 'حساب الصندوق / النقدية' : 'Cash Account (Debit)'}: <strong>+$150.00</strong></div>
        <div style="color:var(--text-muted); margin-inline-start:12px;">↳ CR: ${currentLang === 'ar' ? 'حساب إيرادات المبيعات' : 'Sales Revenue (Credit)'}: <strong>+$150.00</strong></div>
        <div style="color:#f59e0b; margin-top:3px;">+ DR: ${currentLang === 'ar' ? 'حساب تكلفة البضاعة المباعة (COGS)' : 'COGS Expense (Debit)'}: <strong>+$90.00</strong></div>
        <div style="color:var(--text-muted); margin-inline-start:12px;">↳ CR: ${currentLang === 'ar' ? 'حساب الأصول المخزنية' : 'Inventory Asset (Credit)'}: <strong>-$90.00</strong></div>
        <div style="font-size:0.75rem; color:var(--text-dim); margin-top:4px;">✔ ${currentLang === 'ar' ? 'تم حجز القطعة آلياً وتحديث ميزان المراجعة' : 'Stock auto-deducted & Trial Balance updated in real-time'}</div>
      `;

      if (demoLogContainer) {
        demoLogContainer.prepend(logEntry);
        // keep at most 6 entries
        while (demoLogContainer.children.length > 6) {
          demoLogContainer.removeChild(demoLogContainer.lastChild);
        }
      }
    });
  }

  if (demoResetBtn) {
    demoResetBtn.addEventListener('click', () => {
      demoStock = initialStock;
      demoSalesCount = 0;
      demoRevenue = 0;
      renderDemo();
      if (demoLogContainer) {
        demoLogContainer.innerHTML = `
          <div style="color:var(--text-dim); font-size:0.85rem; text-align:center; padding:1rem;">
            ${currentLang === 'ar' ? 'جاهز للمحاكاة... انقر فوق زر الشراء لتوليد القيود المحاسبية' : 'Ready... Click the purchase button to trigger real-time ledger entries'}
          </div>
        `;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 9. MODALS MANAGER (DEMO, PRD, CV, CV DOWNLOAD LEAD)
  // ------------------------------------------------------------------------
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // If CV Download Lead Modal, automatically focus on the contact input field!
      if (modalId === 'cvDownloadModal') {
        const contactInput = document.getElementById('cvLeadContact');
        if (contactInput) {
          setTimeout(() => contactInput.focus(), 250);
        }
      }
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-open-modal');
      openModal(targetId);
    });
  });

  document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal when clicking on overlay background
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // Print CV button
  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ------------------------------------------------------------------------
  // 10. CONTACT FORM HANDLING & VALIDATION
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const type = document.getElementById('formType').value;
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message || !type) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = translations[currentLang].form_err_required;
          formStatus.style.display = 'block';
        }
        return;
      }

      // Submit feedback simulation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = translations[currentLang].form_submitting;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.textContent = translations[currentLang].form_success_msg;
          formStatus.style.display = 'block';
        }

        // Also offer option to send directly via WhatsApp
        const waText = encodeURIComponent(
          `*طلب مشروع جديد من الموقع:*\n` +
          `• الاسم: ${name}\n` +
          `• البريد: ${email}\n` +
          `• الهاتف: ${phone || 'غير محدد'}\n` +
          `• نوع المشروع: ${type}\n` +
          `• التفاصيل: ${message}`
        );

        const sendWaPrompt = confirm(
          currentLang === 'ar'
            ? 'تم حفظ رسالتك بنجاح! هل تود أيضاً فتح محادثة واتساب المباشرة مع م. عبدالرحمن لإرسال التفاصيل فوراً؟'
            : 'Your message has been captured! Would you also like to launch WhatsApp to chat directly with Eng. Abdulrahman?'
        );

        if (sendWaPrompt) {
          window.open(`https://wa.me/967737387018?text=${waText}`, '_blank');
        }

        contactForm.reset();
      }, 900);
    });
  }

  // ------------------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // ------------------------------------------------------------------------
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }

  // ------------------------------------------------------------------------
  // DIRECT CV DOWNLOAD LOGIC
  // ------------------------------------------------------------------------
  function triggerCvDownload() {
    // 1. Direct real PDF file download
    const downloadLink = document.createElement('a');
    downloadLink.href = 'assets/CV_Eng_Abdulrahman_Abdulhakeem.pdf';
    downloadLink.download = 'CV_Eng_Abdulrahman_Abdulhakeem.pdf';
    downloadLink.target = '_blank';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 2. Show instant feedback toast
    showToast(
      currentLang === 'ar'
        ? '✔ تم بدء تنزيل السيرة الذاتية (PDF) بنجاح!'
        : '✔ Eng. Abdulrahman\'s CV (PDF) download started successfully!'
    );
  }

  // Connect native CV Download Links across Header, Hero, Drawer & Modals
  function bindCvTrigger(id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        showToast(
          currentLang === 'ar'
            ? '✔ تم بدء تنزيل السيرة الذاتية (PDF) بنجاح!'
            : '✔ Eng. Abdulrahman\'s CV (PDF) download started successfully!'
        );
      });
    }
  }

  bindCvTrigger('heroDownloadCvBtn');
  bindCvTrigger('navCvDownloadBtn');
  bindCvTrigger('drawerCvDownloadBtn');
  bindCvTrigger('modalDirectDownloadBtn');

  const drawerCvBtn = document.getElementById('drawerCvDownloadBtn');
  if (drawerCvBtn && mobileDrawer) {
    drawerCvBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  }

  const modalDirectBtn = document.getElementById('modalDirectDownloadBtn');
  if (modalDirectBtn) {
    modalDirectBtn.addEventListener('click', () => {
      setTimeout(() => closeModal('cvDownloadModal'), 300);
    });
  }

  // Optional Email capture inside modal
  const cvLeadSubmitBtn = document.getElementById('cvLeadSubmitBtn');
  const cvLeadContactInput = document.getElementById('cvLeadContact');
  const cvLeadStatus = document.getElementById('cvLeadStatus');

  if (cvLeadSubmitBtn) {
    cvLeadSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactVal = cvLeadContactInput ? cvLeadContactInput.value.trim() : '';

      if (cvLeadStatus) {
        cvLeadStatus.className = 'form-status success';
        cvLeadStatus.textContent = currentLang === 'ar'
          ? '✔ تم تأكيد طلبك وتنزيل ملف السيرة الذاتية فوراً!'
          : '✔ Confirmed! Downloading CV file immediately!';
        cvLeadStatus.style.display = 'block';
      }

      triggerCvDownload();

      if (contactVal) {
        const waText = encodeURIComponent(
          `*طلب سيرة ذاتية من الموقع:*\n• وسيلة التواصل: ${contactVal}\n• تم تحميل السيرة الذاتية.`
        );
        setTimeout(() => {
          window.open(`https://wa.me/967737387018?text=${waText}`, '_blank');
        }, 1200);
      }
    });
  }

  const cvDirectViewBtn = document.getElementById('cvDirectViewBtn');
  if (cvDirectViewBtn) {
    cvDirectViewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal('cvDownloadModal');
      setTimeout(() => openModal('cvModal'), 150);
    });
  }

  // Pre-fill form when clicking "Request Service" on service cards
  document.querySelectorAll('[data-service-request]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-request');
      const typeSelect = document.getElementById('formType');
      if (typeSelect) {
        for (let i = 0; i < typeSelect.options.length; i++) {
          if (typeSelect.options[i].text.includes(serviceName) || typeSelect.options[i].value === serviceName) {
            typeSelect.selectedIndex = i;
            break;
          }
        }
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
