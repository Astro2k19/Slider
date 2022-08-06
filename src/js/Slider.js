export default class Slider {
    /**
     *
     * @param options
     */
    constructor(options) {
        this.config = Object.assign({
            attr: 'data-slider',
            sliderContainer: '.slider',
            slider: '.slides',
        }, options);

        this.init();
    }

    /**
     *
     */

    init() {

        this.state = {
            index: 0,
            length: 0,
            slider: null,
            sliderContainer: null,
            start: null,
            isSwiping: false,
            swipingDistance: 0,
            threshold: 20
        };

        document.addEventListener('click', this.click.bind(this));
        document.addEventListener('touchstart', this.touchStart.bind(this));
        document.addEventListener('touchmove', this.touchMove.bind(this));
        document.addEventListener('touchend', this.touchEnd.bind(this));

        document.querySelectorAll(`[${this.config.attr}]`).forEach(slide => {
            this.setSliderWidth(slide);
        });

    }

    /**
     *
     */

    setState() {
        if (!this.state.slider) return;

        if (this.state.index < 0) {
            this.state.index = 0;
        } else if (this.state.index >= this.state.length) {
            this.state.index = this.state.length - 1;
        }

        this.state.slider.classList[this.state.isSwiping ? 'add' : 'remove']('swiping');

        this.state.slider.style.left = `${(this.state.index * -100) + this.caclPercetageDistance()}%`;
    }

    /**
     *
     * @param forward
     */

    navigate(el, forward = true) {

        this.loadState(el);

        forward ? this.state.index++ : this.state.index--;

        this.setState();
    }

    /**
     *
     * @param slider
     */

    setSliderWidth(slider) {
        slider.style.width = `${slider.childElementCount * 100}%`
    }


    /**
     *
     * @param el
     */

    loadState(el) {
        this.state.sliderContainer = el.closest(this.config.sliderContainer);
        if (!this.state.sliderContainer) throw new Error('The slider container doesnt exist');

        this.state.slider = this.state.sliderContainer.querySelector(this.config.slider);
        if (!this.state.slider) throw new Error('The slider element doesnt exist');

        this.state.length = this.state.slider.childElementCount;

        this.state.width = this.state.sliderContainer.getBoundingClientRect().width;

        this.state.index = this.getCurrentIndex();
    }

    /**
     *
     * @return {number}
     */

    getCurrentIndex() {
        let left = this.state.slider.style.left || '0%';
        left = parseInt(left.replace(/[-%]/, ''));

        return Math.round(left / 100);
    }

    /**
     *
     * @param target
     */

    click({target}) {
        const prev = target.matches(`[${this.config.attr}-prev]`, `[${this.config.attr}-prev] *`);
        const next = !prev && target.matches(`[${this.config.attr}-next]`, `[${this.config.attr}-next] *`);

        if (!prev && !next) return;

        this.navigate(target, next);
    }

    /**
     *
     * @param target
     * @param touchesStart
     */

    touchStart({target, changedTouches: touchesStart}) {

        if (!target.closest(`[${this.config.attr}]`)) return;

        if (touchesStart.length !== 1) return;

        this.loadState(target);

        this.state.start = touchesStart[0].screenX;
        this.state.isSwiping = true;
    }

    /**
     *
     * @param touchesMove
     */

    touchMove({changedTouches: touchesMove}) {

        if (!this.state.isSwiping) return;

        this.state.swipingDistance = touchesMove[0].screenX - this.state.start;

        this.setState();
    }

    /**
     *
     */

    touchEnd() {

        const distance = this.caclPercetageDistance();

        if (distance <= -this.state.threshold) {
            this.navigate(this.state.sliderContainer, true);
        } else if (distance >= this.state.threshold) {
            this.navigate(this.state.sliderContainer, false);
        }

        this.state.swipingDistance = 0;
        this.state.isSwiping = false;

        this.setState();
    }

    /**
     *
     * @return {number}
     */

    caclPercetageDistance() {
        return (this.state.swipingDistance / this.state.width) * 100;
    }
}
