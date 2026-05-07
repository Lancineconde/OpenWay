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
