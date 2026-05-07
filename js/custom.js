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
