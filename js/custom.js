/* Navbar — scroll behaviour + mobile menu */
(function () {
	var navbar = document.getElementById('ow-navbar');
	var toggle = document.getElementById('ow-menu-toggle');
	var mobileMenu = document.getElementById('ow-mobile-menu');
	if (!navbar) return;

	var transparent = !navbar.classList.contains('ow-navbar-solid');

	function onScroll() {
		if (!transparent) return;
		navbar.classList.toggle('scrolled', window.scrollY > 40);
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	/* Auto-highlight active link */
	var page = window.location.pathname.split('/').pop() || 'index.html';
	document.querySelectorAll('.ow-nav-link, .ow-mobile-link').forEach(function (a) {
		if (a.getAttribute('href') === page) a.classList.add('active');
	});

	if (toggle && mobileMenu) {
		toggle.addEventListener('click', function () {
			var open = mobileMenu.classList.toggle('open');
			toggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
			document.body.style.overflow = open ? 'hidden' : '';
		});
	}
}());

/* Universities page — live search & filter */
(function () {
	var searchInput  = document.getElementById('uniSearch');
	if (!searchInput) return;

	var filterBtn    = document.getElementById('uniFilterBtn');
	var filtersPanel = document.getElementById('uniFiltersPanel');
	var courseSelect = document.getElementById('uniCourseFilter');
	var citySelect   = document.getElementById('uniCityFilter');
	var typeSelect   = document.getElementById('uniTypeFilter');
	var budgetRange  = document.getElementById('uniBudgetRange');
	var budgetLabel  = document.getElementById('uniBudgetLabel');
	var countEl      = document.getElementById('uni-count');
	var cards        = document.querySelectorAll('.uni-card-wrap');

	function filterCards() {
		var search = searchInput.value.toLowerCase();
		var course = courseSelect ? courseSelect.value : 'All';
		var city   = citySelect   ? citySelect.value   : 'All';
		var type   = typeSelect   ? typeSelect.value   : 'All';
		var budget = budgetRange  ? parseInt(budgetRange.value) : 20000;
		var visible = 0;

		cards.forEach(function (wrap) {
			var name  = wrap.dataset.name;
			var loc   = wrap.dataset.location;
			var progs = wrap.dataset.programs;
			var ok    = true;

			if (search && !name.includes(search) && !loc.includes(search)) ok = false;
			if (course !== 'All' && !progs.includes(course.toLowerCase()))  ok = false;
			if (city   !== 'All' && wrap.dataset.city !== city)              ok = false;
			if (type   !== 'All' && wrap.dataset.type !== type)              ok = false;
			if (parseInt(wrap.dataset.tuitionMin) > budget)                  ok = false;

			wrap.style.display = ok ? '' : 'none';
			if (ok) visible++;
		});

		if (countEl) countEl.textContent = visible + ' universit' + (visible === 1 ? 'y' : 'ies') + ' found';
	}

	if (filterBtn && filtersPanel) {
		filterBtn.addEventListener('click', function () {
			var isHidden = filtersPanel.classList.toggle('hidden');
			filterBtn.classList.toggle('active', !isHidden);
		});
	}

	if (budgetRange && budgetLabel) {
		budgetRange.addEventListener('input', function () {
			budgetLabel.textContent = '$' + parseInt(this.value).toLocaleString();
			filterCards();
		});
	}

	[searchInput, courseSelect, citySelect, typeSelect].forEach(function (el) {
		if (el) el.addEventListener('input', filterCards);
	});
}());

/* Blog page — search & category filter */
(function () {
	var blogSearch = document.getElementById('blogSearch');
	if (!blogSearch) return;

	var featuredSection = document.getElementById('blogFeaturedSection');
	var catBtns = document.querySelectorAll('.blog-cat-btn');
	var cards = document.querySelectorAll('.blog-card-wrap');
	var noResults = document.getElementById('blogNoResults');
	var activeCat = 'All';

	function filterBlog() {
		var search = blogSearch.value.toLowerCase().trim();
		var isFiltering = search || activeCat !== 'All';

		if (featuredSection) featuredSection.style.display = isFiltering ? 'none' : '';

		var visible = 0;
		cards.forEach(function (wrap) {
			var isFeatured = wrap.dataset.featured === 'true';
			var matchSearch = !search || wrap.dataset.title.includes(search) || wrap.dataset.excerpt.includes(search);
			var matchCat = activeCat === 'All' || wrap.dataset.category === activeCat;
			var show = matchSearch && matchCat && (!isFeatured || isFiltering);
			wrap.style.display = show ? '' : 'none';
			if (show) visible++;
		});

		if (noResults) noResults.style.display = visible === 0 ? '' : 'none';
	}

	catBtns.forEach(function (btn) {
		btn.addEventListener('click', function () {
			catBtns.forEach(function (b) { b.classList.remove('active'); });
			btn.classList.add('active');
			activeCat = btn.dataset.cat;
			filterBlog();
		});
	});

	blogSearch.addEventListener('input', filterBlog);
}());

/* Scroll Reveal — auto-animate elements as they enter the viewport */
(function () {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// Elements that animate individually (fade up)
	var singles = [
		'.section-eyebrow', '.section-title', '.section-subtitle',
		'.section-lead', '.lead-text', '.cta-title', '.cta-text',
		'.about-checks', '.about-mini-points', '.hero-buttons',
		'.about-image-wrap', '.about-home-image',
		'.comparison-table-wrap', '.visa-steps-track',
		'.uni-search-section'
	];

	// Elements that stagger within their row
	var staggered = [
		'.feature-card', '.stat-box', '.hero-trust-item',
		'.blog-card', '.blog-featured-card',
		'.uni-card', '.university-option-card',
		'.study-field-card', '.student-life-card',
		'.visa-support-card', '.process-card',
		'.visa-step-item', '.mv-box', '.service-feature'
	];

	// Hero/above-fold containers to skip
	var skipSelectors = [
		'.homepage-hero', '.about-hero', '.visa-hero',
		'.blog-hero-section', '.study-options-hero',
		'.universities-hero-section', '.ow-navbar',
		'.ow-mobile-menu'
	];

	function isInHero(el) {
		return skipSelectors.some(function (s) { return el.closest(s); });
	}

	function prepare(el, delayMs, type) {
		if (isInHero(el)) return;
		if (el.classList.contains('sr-item')) return;
		el.classList.add('sr-item');
		if (type === 'left')  el.classList.add('sr-left');
		if (type === 'scale') el.classList.add('sr-scale');
		if (delayMs) el.style.transitionDelay = delayMs + 'ms';
	}

	// Prepare singles
	singles.forEach(function (sel) {
		document.querySelectorAll(sel).forEach(function (el) {
			prepare(el, 0);
		});
	});

	// Prepare staggered — delay based on position within closest .row
	staggered.forEach(function (sel) {
		document.querySelectorAll(sel).forEach(function (el) {
			if (isInHero(el)) return;
			var row = el.closest('.row') || el.parentElement;
			var siblings = row ? Array.from(row.querySelectorAll(sel)) : [el];
			var idx = siblings.indexOf(el);
			prepare(el, idx * 90);
		});
	});

	// Left-slide for images in two-column layouts
	document.querySelectorAll('.about-image-wrap img, .about-home-image img').forEach(function (el) {
		if (isInHero(el)) return;
		prepare(el.closest('.col-lg-5, .col-lg-6') || el, 0, 'left');
	});

	// Observe everything
	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('sr-visible');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

	document.querySelectorAll('.sr-item').forEach(function (el) {
		observer.observe(el);
	});
}());

/* Journey Timeline — scroll animations */
(function () {
	var header = document.querySelector('.journey-header');
	var steps  = document.querySelectorAll('.journey-step');

	if (!header && !steps.length) return;

	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('jt-visible');
				io.unobserve(entry.target);
			}
		});
	}, { threshold: 0.15 });

	if (header) io.observe(header);

	steps.forEach(function (step, i) {
		step.classList.add(i % 2 === 0 ? 'from-left' : 'from-right');
		var stepIo = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					setTimeout(function () {
						entry.target.classList.add('jt-visible');
					}, i * 80);
					stepIo.unobserve(entry.target);
				}
			});
		}, { threshold: 0.1 });
		stepIo.observe(step);
	});
}());
