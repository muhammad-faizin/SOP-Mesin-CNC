document.addEventListener('DOMContentLoaded', () => {
    // 1. Set System Date
    const dateDisplay = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateDisplay.innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${today.toLocaleDateString('id-ID', options)}`;

    // Set Copyright Year
    document.getElementById('year').textContent = today.getFullYear();

    // 2. Accordion Functionality
    const accordions = document.querySelectorAll('.accordion-btn');
    
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    // 3. ScrollSpy Functionality (Highlight active menu based on scroll)
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.toc a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust Offset due to sticky header
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // 4. Fade In Animation on Scroll (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // Pre-open the first accordion
    if(accordions.length > 0) {
        accordions[0].click();
    }

    // 5. Cycle Time Calculator Logic
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const distance = parseFloat(document.getElementById('cutting-distance').value);
            const feedRate = parseFloat(document.getElementById('feed-rate').value);
            const passes = parseInt(document.getElementById('num-passes').value) || 1;
            
            const resultBox = document.getElementById('calculator-result');
            const outputText = document.getElementById('time-output');

            if (!distance || !feedRate || distance <= 0 || feedRate <= 0) {
                alert("Harap masukkan Jarak Potong dan Feed Rate dengan angka yang valid!");
                return;
            }

            // Formula: Waktu (menit) = (Jarak * Jumlah Pass) / Feed Rate
            const totalDistance = distance * passes;
            const timeInMinutes = totalDistance / feedRate;
            
            const minutes = Math.floor(timeInMinutes);
            const seconds = Math.round((timeInMinutes - minutes) * 60);

            outputText.textContent = `${minutes} Menit ${seconds} Detik`;
            
            // Show result
            resultBox.classList.remove('hidden');
        });
    }

    // 6. Interactive Checklist Logic
    const checkboxes = document.querySelectorAll('.pra-cb');
    const verifyBtn = document.getElementById('verify-checklist-btn');
    const statusBadge = document.getElementById('checklist-status');

    if (checkboxes.length > 0 && verifyBtn) {
        // Function to check if all are checked
        const checkAllTicked = () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            if (allChecked) {
                verifyBtn.disabled = false;
                verifyBtn.classList.remove('locked-btn');
                verifyBtn.innerHTML = `<i class="fa-solid fa-lock-open"></i> Verifikasi Kesiapan`;
            } else {
                verifyBtn.disabled = true;
                verifyBtn.classList.add('locked-btn');
                verifyBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Verifikasi Kesiapan`;
                statusBadge.classList.add('hidden');
                statusBadge.style.display = 'none';
            }
        };

        // Add event listener to each checkbox
        checkboxes.forEach(cb => {
            cb.addEventListener('change', checkAllTicked);
        });

        // Add event listener to verify button
        verifyBtn.addEventListener('click', () => {
            statusBadge.classList.remove('hidden');
            statusBadge.style.display = 'flex';
        });
    }

    // 7. Statistic Counters Animation
    const stats = document.querySelectorAll('.stat-value');
    const statsSection = document.getElementById('statistik');
    
    if (statsSection && stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            stat.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = target;
                        }
                    };
                    updateCounter();
                });
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
});
