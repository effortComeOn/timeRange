
(function ($, window, document, OpenUICore) {
	'use strict';

	var jRange = function () {
		return this.init.apply(this, arguments);
	};
	var otherFunc = {
		formatFunc: function (value) {
			var hours = Math.floor(value / 60);
			var mins = (value - hours * 60);
			return (hours < 10 ? "0" + hours : hours) + ":" + (mins == 0 ? "00" : mins);
		},
		resetFunc: function (value) {
			var arr = value.split(':');
			return parseInt(arr[0])
		},
		deleteFunc: function (id, idshow) {
			$('#single-slider' + id).remove();
			$('#slider-wrapper' + id).remove();
			$('#'+idshow).val("");
		},
		initVal: function (id, obj) {
			var inputid = 'single-slider' + id,
				wrapperid = 'slider-wrapper' + id
			var input = $('<input class="single-slider" id=' + inputid + ' type="hidden"   value=0 />')

			var wrapper = $('<div class="slider-wrapper" id='+ wrapperid + '><span class="slider-location"></span></div>')
			var objs = {
				from: 0,
				to: 1440,
				step: 60,
				format: '%s',
				width: 240,
				showLabels: true,
				isSnap: true,
				snap: 1, // 间隔一小时
				isRange: true,
				showScale: false,
				option: ['00:00', '24:00'],
				start: 0,
				end: 1440
			}
			objs.start = obj.start ? obj.start * objs.step : objs.start
			objs.end = obj.end ? obj.end * objs.step : objs.end
			if ($('.slider-wrapper').length < 1) {
				if ($('#' +inputid).length < 1) {
					$('#' + id).append(wrapper)
					$('#' + id).append(input)
				} else {
					var value = $('#' +inputid).val()
					$('#' +inputid).remove()
					$('#' + id).append(wrapper)
					$('#' + id).append(input)
					var arr = value.split(',')
					objs.start = parseInt(arr[0])
					objs.end = parseInt(arr[1])
				}

				$('#' +inputid).jRange(objs);

			} else {
				var sliderArr = $('.slider-wrapper')
				for (var i = 0, len = sliderArr.length; i < len; i++) {
					var ids = sliderArr[i].id
					if (ids !== wrapperid) {
						$('#' +ids).remove()
						$.otherFunc.initVal(id, obj)
						return
					}
				}

			}
		},
		onEvent: function (id, idshow, obj) {
			var text = '', objstart="",objend="", start = '', end = ""
			if (obj && obj.start && obj.end) {
				// console.log(obj, 'obj')
				objstart = this.formatFunc(obj.start * 60)
				objend = this.formatFunc(obj.end * 60)
			}
			start = $('#single-slider'+id).data('low')
			end = $('#single-slider'+id).data('high')
			// console.log(objstart, objend, '===' ,start, end)
			text = start && end ? start + '-' + end : objstart&&objend ? objstart+'-'+objend : ''
			$('#' + idshow).val(text)
			$('#' + idshow).attr('value', text)
		},
		initObj: function (idshow) {
			var valStart = $('#' + idshow).val()
			var obj = {}
			if (valStart) {
				var arr = valStart.split('-')
				obj = {
					start: parseInt(arr[0].split(':')[0]),
					end: parseInt(arr[1].split(':')[0])
				}
			}
			else {
				valStart = $('#' + idshow).val()
			}

			return obj
		},
		addEvent: function (id, idshow, str) {
			var obj = this.initObj(idshow)

			if (obj.end <= obj.start) return
			this.initVal(id, obj)
			this.onEvent(id, idshow, obj)
			this.onBubble()

			$('.slider-wrapper .slider-location').html(str)
			$('.slider-wrapper').show()
			if (window.attachEvent) {    
				document.attachEvent('mouseup', function () {
					obj = $.otherFunc.initObj(idshow)
					$.otherFunc.onEvent(id, idshow, obj)
				})
				document.attachEvent('mousemove', function () {
					obj = $.otherFunc.initObj(idshow)
					$.otherFunc.onEvent(id, idshow, obj)
				})
				document.attachEvent('touchend', function () {
					obj = $.otherFunc.initObj(idshow)
					$.otherFunc.onEvent(id, idshow, obj)
				})
				document.attachEvent('touchcancel', function () {
					obj = $.otherFunc.initObj(idshow)
					$.otherFunc.onEvent(id, idshow, obj)
				})    
			} else if (window.addEventListener) {    
				document.addEventListener('mouseup', function () {
					obj = $.otherFunc.initObj(idshow)
					$.otherFunc.onEvent(id, idshow, obj)
				})
				document.addEventListener('mousemove', function () {
					obj = $.otherFunc.initObj(idshow)
					$.otherFunc.onEvent(id, idshow, obj)
				})
				document.addEventListener('touchend', function () {
					obj = $.otherFunc.initObj(idshow)
					$.otherFunc.onEvent(id, idshow, obj)
				})
				document.addEventListener('touchcancel', function () {
					obj = $.otherFunc.initObj(idshow)
					$.otherFunc.onEvent(id, idshow, obj)
				})    
			}
		},

		onBubble: function (id) {
			$(".timebtn").click(function (e) {
				$('.slider-wrapper').show()
				$('.slider-wrapper').on('')
				var e = window.event || e;
				if (document.all) {
					e.cancelBubble = true;
				} else {
					e.stopPropagation();
				}
			})

			$(document).on('mouseup', function () {
				$('.slider-wrapper').hide()
			})
		}
	}
	$.otherFunc = otherFunc
	jRange.prototype = {
		defaults: {
			onstatechange: function () { },
			isRange: false,
			showLabels: true,
			showScale: true,
			step: 1,
			format: '%s',
			snap: 0,
			theme: 'theme-green',
			width: 300,
			disable: false,
			isSnap: false, // 是否有间隔
		},
		template: '<div class="slider-container">\
			<div class="back-bar">\
                <div class="selected-bar"></div>\
                <div class="pointer low"></div><div class="pointer-label start">123456</div>\
                <div class="pointer high"></div><div class="pointer-label end">456789</div>\
                <div class="clickable-dummy"></div>\
            </div>\
            <div class="scale"></div>\
			</div>',
		init: function (node, options) {
			this.options = $.extend({}, this.defaults, options);
			this.inputNode = $(node);
			this.options.value = (this.options.isRange ? this.options.start + ',' + this.options.end : this.options.from);

			this.domNode = $(this.template);
			this.domNode.addClass(this.options.theme);
			// this.inputNode.parent().append(this.domNode);
			this.inputNode.siblings('.slider-wrapper').append(this.domNode)
			this.domNode.on('change', this.onChange);
			this.pointers = $('.pointer', this.domNode);
			this.lowPointer = this.pointers.first();
			this.highPointer = this.pointers.last();
			this.labels = $('.pointer-label', this.domNode);
			this.lowLabel = this.labels.first();
			this.highLabel = this.labels.last();
			this.scale = $('.scale', this.domNode);
			this.bar = $('.selected-bar', this.domNode);
			this.clickableBar = this.domNode.find('.clickable-dummy');
			this.interval = this.options.to - this.options.from;
			this.snap = this.options.isSnap ? Math.floor((this.options.snap * this.options.width) / 24) : 0;
			this.render();
		},
		render: function () {
			// Check if inputNode is visible, and have some width, so that we can set slider width accordingly.
			if (this.inputNode.width() === 0 && !this.options.width) {
				console.log('jRange : no width found, returning');
				return;
			} else {
				this.domNode.width(this.options.width || this.inputNode.width());
				this.inputNode.hide();
			}

			if (this.isSingle()) {
				this.lowPointer.hide();
				this.lowLabel.hide();
			}
			if (!this.options.showLabels) {
				this.labels.hide();
			}
			this.attachEvents();
			if (this.options.showScale) {
				this.renderScale();
			}
			this.setValue(this.options.value);
			console.log(this.options.value, this.options.from, this.options.to)
		},
		isSingle: function () {
			if (typeof (this.options.value) === 'number') {
				return true;
			}
			return (this.options.value.indexOf(',') !== -1 || this.options.isRange) ?
				false : true;
		},
		attachEvents: function () {
			this.clickableBar.click($.proxy(this.barClicked, this));
			this.pointers.on('mousedown touchstart', $.proxy(this.onDragStart, this));
			this.pointers.bind('dragstart', function (event) {
				event.preventDefault();
			});
		},
		onDragStart: function (e) {
			if (this.options.disable || (e.type === 'mousedown' && e.which !== 1)) {
				return;
			}
			e.stopPropagation();
			e.preventDefault();
			var pointer = $(e.target);
			this.pointers.removeClass('last-active');
			pointer.addClass('focused last-active');
			this[(pointer.hasClass('low') ? 'low' : 'high') + 'Label'].addClass('focused');
			$(document).on('mousemove.slider touchmove.slider', $.proxy(this.onDrag, this, pointer));
			$(document).on('mouseup.slider touchend.slider touchcancel.slider', $.proxy(this.onDragEnd, this));
		},
		onDrag: function (pointer, e) {
			e.stopPropagation();
			e.preventDefault();

			if (e.originalEvent.touches && e.originalEvent.touches.length) {
				e = e.originalEvent.touches[0];
			} else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				e = e.originalEvent.changedTouches[0];
			}
			var position = e.clientX - this.domNode.offset().left;
			this.domNode.trigger('change', [this, pointer, position]);
		},
		onDragEnd: function (e) {
			this.pointers.removeClass('focused');
			this.labels.removeClass('focused');
			$(document).off('.slider');
		},
		barClicked: function (e) {
			if (this.options.disable) return;
			var x = e.pageX - this.clickableBar.offset().left;
			if (this.isSingle())
				this.setPosition(this.pointers.last(), x, true, true);
			else {
				// var circleWidth = this.pointers.first().width() / 2
				// var pointer = Math.abs(parseInt(this.pointers.first().css('left'), 10) - x + circleWidth) < Math.abs(parseInt(this.pointers.last().css('left'), 10) - x + circleWidth) ?
				// 	this.pointers.first() : this.pointers.last();
				// x = this.lowPointer.position().left
				// this.setPosition(pointer, x, true, true);
			}
		},
		onChange: function (e, self, pointer, position) {
			var min, max;
			if (self.isSingle()) {
				min = 0;
				max = self.domNode.width();
			} else {
				min = pointer.hasClass('high') ? self.lowPointer.position().left + self.lowPointer.width() / 2 + self.snap : 0;
				max = pointer.hasClass('low') ? self.highPointer.position().left + self.highPointer.width() / 2 - self.snap : self.domNode.width();
			}
			var value = Math.min(Math.max(position, min), max);
			self.setPosition(pointer, value, true);
		},
		setPosition: function (pointer, position, isPx, animate) {
			var leftPos,
				lowPos = this.lowPointer.position().left,
				highPos = this.highPointer.position().left,
				circleWidth = this.highPointer.width() / 2;
			if (!isPx) {
				position = this.prcToPx(position);
			}
			if (pointer[0] === this.highPointer[0]) {
				highPos = Math.round(position - circleWidth);
			} else {
				lowPos = Math.round(position - circleWidth);
			}

			pointer[animate ? 'animate' : 'css']({
				'left': Math.round(position - circleWidth)
			});
			if (this.isSingle()) {
				leftPos = 0;
			} else {
				leftPos = lowPos + circleWidth;
			}
			// console.log('highPos:', highPos, 'leftPos:', leftPos, 'lowPos:', lowPos, 'position:', position)
			this.bar[animate ? 'animate' : 'css']({
				'width': Math.round(highPos + circleWidth - leftPos),
				'left': leftPos
			});
			this.showPointerValue(pointer, position, animate);
			this.isReadonly();
		},
		// will be called from outside
		setValue: function (value) {
			var values = value.toString().split(',');
			// console.log(values, 'setValue=========')
			this.options.value = value;
			var prc = this.valuesToPrc(values.length === 2 ? values : [0, values[0]]);
			if (this.isSingle()) {
				this.setPosition(this.highPointer, prc[1]);
			} else {
				this.setPosition(this.lowPointer, prc[0]);
				this.setPosition(this.highPointer, prc[1]);
			}
		},
		renderScale: function () {
			var s = this.options.scale || [this.options.from, this.options.to];
			var prc = Math.round((100 / (s.length - 1)) * 10) / 10;
			var str = '';
			for (var i = 0; i < s.length; i++) {
				str += '<span style="left: ' + i * prc + '%">' + (s[i] != '|' ? '<ins>' + s[i] + '</ins>' : '') + '</span>';
			}
			this.scale.html(str);

			$('ins', this.scale).each(function () {
				$(this).css({
					marginLeft: -$(this).outerWidth() / 2
				});
			});
		},
		getBarWidth: function () {
			var values = this.options.value.split(',');
			if (values.length > 1) {
				return parseInt(values[1], 10) - parseInt(values[0], 10);
			} else {
				return parseInt(values[0], 10);
			}
		},
		showPointerValue: function (pointer, position, animate) {
			var label = $('.pointer-label', this.domNode)[pointer.hasClass('low') ? 'first' : 'last']();
			var text;
			var value = this.positionToValue(position);

			var val2 = this.formatFunc(value);
			if ($.isFunction(this.options.format)) {
				var type = this.isSingle() ? undefined : (pointer.hasClass('low') ? 'low' : 'high');
				text = this.options.format(val2, type);
			} else {
				text = this.options.format.replace('%s', val2);
			}
			// console.log(text, '===text')
			var width = label.html(text).width(),
				left = position - width / 2;
			left = Math.min(Math.max(left, 0), this.options.width - width);
			label[animate ? 'animate' : 'css']({
				left: left
			});
			this.setInputValue(pointer, value);
		},
		valuesToPrc: function (values) {
			// console.log(values, 'valuesToPrc=========')
			var lowPrc = ((values[0] - this.options.from) * 100 / this.interval),
				highPrc = ((values[1] - this.options.from) * 100 / this.interval);
			return [lowPrc, highPrc];
		},
		prcToPx: function (prc) {
			return (this.domNode.width() * prc) / 100;
		},
		positionToValue: function (pos) {
			var value = (pos / this.domNode.width()) * this.interval;
			value = value + this.options.from;
			return Math.round(value / this.options.step) * this.options.step;
		},
		formatFunc: function (value) {
			var hours = Math.floor(value / 60);
			var mins = (value - hours * 60);
			return (hours < 10 ? "0" + hours : hours) + ":" + (mins == 0 ? "00" : mins);
		},
		setInputValue: function (pointer, v) {
			// if(!isChanged) return;
			if (this.isSingle()) {
				this.options.value = v.toString();
			} else {
				var values = this.options.value.split(',');
				if (pointer.hasClass('low')) {
					this.options.value = v + ',' + values[1];
					this.inputNode.data('low', this.formatFunc(v))
				} else {
					this.options.value = values[0] + ',' + v;
					this.inputNode.data('high', this.formatFunc(v))
				}
			}
			if (this.inputNode.val() !== this.options.value) {
				this.inputNode.val(this.options.value);
				// console.log(this.options.value, 'this.options.value')
				this.options.onstatechange.call(this, this.options.value);
			}
		},
		getValue: function () {
			return this.options.value;
		},
		isReadonly: function () {
			this.domNode.toggleClass('slider-readonly', this.options.disable);
		},
		disable: function () {
			this.options.disable = true;
			this.isReadonly();
		},
		enable: function () {
			this.options.disable = false;
			this.isReadonly();
		},
		toggleDisable: function () {
			this.options.disable = !this.options.disable;
			this.isReadonly();
		}
	};

	var pluginName = 'jRange';
	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (option) {
		var args = arguments,
			result;

		this.each(function () {
			var $this = $(this),
				data = $.data(this, 'plugin_' + pluginName),
				options = typeof option === 'object' && option;
			if (!data) {
				$this.data('plugin_' + pluginName, (data = new jRange(this, options)));
				$(window).resize(function () {
					data.setValue(data.getValue());
				}); // Update slider position when window is resized to keep it in sync with scale
			}

			if (typeof option === 'string') {
				result = data[option].apply(data, Array.prototype.slice.call(args, 1));
			}
		});

		// To enable plugin returns values
		return result || this;
	};

})(jQuery, window, document, window.OpenUICore);

