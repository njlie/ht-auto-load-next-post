! function(a) {
	function h(b, d, e, f) {
		var g = a();
		return a.each(c, function(a, c) {
			var h = c.offset().top,
				i = c.offset().left,
				j = i + c.width(),
				k = h + c.height(),
				l = !(i > d || j < f || h > e || k < b);
			l && g.push(c)
		}), g
	}

	function i() {
		++f;
		var c = b.scrollTop(),
			e = b.scrollLeft(),
			i = e + b.width(),
			j = c + b.height(),
			k = h(c + g.top, i + g.right, j + g.bottom, e + g.left);
		a.each(k, function(a, b) {
			var c = b.data("scrollSpy:ticks");
			"number" != typeof c && b.triggerHandler("scrollSpy:enter"), b.data("scrollSpy:ticks", f)
		}), a.each(d, function(a, b) {
			var c = b.data("scrollSpy:ticks");
			"number" == typeof c && c !== f && (b.triggerHandler("scrollSpy:exit"), b.data("scrollSpy:ticks", null))
		}), d = k
	}

	function j() {
		b.trigger("scrollSpy:winSize")
	}

	function l(a, b, c) {
		var d, e, f, g = null,
			h = 0;
		c || (c = {});
		var i = function() {
			h = c.leading === !1 ? 0 : k(), g = null, f = a.apply(d, e), d = e = null
		};
		return function() {
			var j = k();
			h || c.leading !== !1 || (h = j);
			var l = b - (j - h);
			return d = this, e = arguments, l <= 0 ? (clearTimeout(g), g = null, h = j, f = a.apply(d, e), d = e = null) : g || c.trailing === !1 || (g = setTimeout(i, l)), f
		}
	}
	var b = a(window),
		c = [],
		d = [],
		e = !1,
		f = 0,
		g = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		},
		k = Date.now || function() {
			return (new Date).getTime()
		};
	a.scrollSpy = function(d, f) {
		d = a(d), d.each(function(b, d) {
			c.push(a(d))
		}), f = f || {
			throttle: 100
		}, g.top = f.offsetTop || 0, g.right = f.offsetRight || 0, g.bottom = f.offsetBottom || 0, g.left = f.offsetLeft || 0;
		var h = l(i, f.throttle || 100),
			j = function() {
				a(document).ready(h)
			};
		return e || (b.on("scroll", j), b.on("resize", j), e = !0), setTimeout(j, 0), d
	}, a.winSizeSpy = function(c) {
		return a.winSizeSpy = function() {
			return b
		}, c = c || {
			throttle: 100
		}, b.on("resize", l(j, c.throttle || 100))
	}, a.fn.scrollSpy = function(b) {
		return a.scrollSpy(a(this), b)
	}
}(jQuery);