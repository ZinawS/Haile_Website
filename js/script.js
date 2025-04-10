document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Fixes
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    if (hamburger && navLinks) {
      // Initialize aria-expanded if not present
      if (!hamburger.hasAttribute('aria-expanded')) {
        hamburger.setAttribute('aria-expanded', 'false');
      }
  
      const toggleMenu = (forceClose = false) => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        const shouldExpand = forceClose ? false : !isExpanded;
        
        console.log('Toggling menu:', shouldExpand); // Debugging
        
        hamburger.setAttribute('aria-expanded', shouldExpand);
        hamburger.classList.toggle('active', shouldExpand);
        navLinks.classList.toggle('active', shouldExpand);
  
        // Toggle body overflow
        document.body.style.overflow = shouldExpand ? 'hidden' : '';
      };
  
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click handler from immediately closing
        toggleMenu();
      });
  
      // Close menu handlers
      const closeMenu = () => toggleMenu(true);
      
      document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
          closeMenu();
        }
      });
  
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
          closeMenu();
        }
      });
    }
  

  // Form Handling
  const formTrigger = document.querySelector('.form-trigger');
  const formContainer = document.querySelector('.form-container');
  const inquiryForm = document.getElementById('inquiry-form');

  if(formContainer && formTrigger) {
      formTrigger.addEventListener('click', (e) => {
          e.preventDefault();
          formContainer.style.display = 'block';
          formTrigger.classList.add('hidden');
          formContainer.scrollIntoView({ behavior: 'smooth' });
      });

      document.addEventListener('click', (e) => {
          if(!formContainer.contains(e.target) && !formTrigger.contains(e.target)) {
              formContainer.style.display = 'none';
              formTrigger.classList.remove('hidden');
          }
      });
  }

  // Form Validation and Submission
  if(inquiryForm) {
      const showValidationError = (field, message) => {
          const errorElement = field.parentNode.querySelector('.validation-error');
          errorElement.textContent = message;
          errorElement.classList.add('visible');
          field.classList.add('error');
      };

      inquiryForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const submitButton = inquiryForm.querySelector('button[type="submit"]');
          const formData = new FormData(inquiryForm);
          
          // Clear previous errors
          inquiryForm.querySelectorAll('.validation-error').forEach(el => {
              el.classList.remove('visible');
          });
          inquiryForm.querySelectorAll('.error').forEach(el => {
              el.classList.remove('error');
          });

          // Validate inputs
          let isValid = true;
          const name = formData.get('name');
          const email = formData.get('email');
          const message = formData.get('message');

          if(!name) {
              showValidationError(inquiryForm.querySelector('[type="text"]'), 'Please enter your name');
              isValid = false;
          }

          if(!email || !/^\S+@\S+\.\S+$/.test(email)) {
              showValidationError(inquiryForm.querySelector('[type="email"]'), 'Please enter a valid email');
              isValid = false;
          }

          if(!message) {
              showValidationError(inquiryForm.querySelector('textarea'), 'Please enter your message');
              isValid = false;
          }

          if(!isValid) return;

          // Submit form
          submitButton.disabled = true;
          try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              // Show success message
              const success = document.createElement('div');
              success.className = 'success-message';
              success.innerHTML = `
                  <i class="fas fa-check-circle"></i>
                  <p>Thank you! Your inquiry has been submitted.</p>
              `;
              inquiryForm.parentNode.insertBefore(success, inquiryForm.nextSibling);
              inquiryForm.reset();
              
              setTimeout(() => success.remove(), 5000);
          } catch(error) {
              alert('Submission failed. Please try again.');
          } finally {
              submitButton.disabled = false;
          }
      });
  }

  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if(entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
  });
});