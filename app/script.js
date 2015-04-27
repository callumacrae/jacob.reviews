fetch('/api')
	.then(function (res) {
		return res.json();
	})
	.then(writeQuote);

function writeQuote(data) {
	document.querySelector('.js-quote').textContent = data.review;
	document.querySelector('.js-cite').textContent = '—' + data.name;
}
