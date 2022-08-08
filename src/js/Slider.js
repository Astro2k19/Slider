export default class Slider {
    /**
     * Instantiate a new slider
     * @param {Options} options - Component configuration options
     * 1. attr - data attribute for defining slider
     * 2. sliderContainer - slider container class
     * 3. slider - slider class
     */
    constructor(options) {

        /**
         * Slider component configuration
         * @type {{slider: string, sliderContainer: string, attr: string} & Options}
         *
         */

        this.config = Object.assign({
            attr: 'data-slider',
            sliderContainer: '.slider',
            slider: '.slides',
        }, options);

        this.init();
    }

    /**
     * Initialize component
     * @return {void}
     */

    init() {

        /**
         * Component state
         * @type {State}
         */

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
     * Update slider state
     * @return {void}
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
     * Navigate slider forwards of backwards
     * @param {HTMLElement} el - Element from which to begin traversal
     * @param {boolean} forward - Navigate forward?
     */

    navigate(el, forward = true) {

        this.loadState(el);

        forward ? this.state.index++ : this.state.index--;

        this.setState();
    }

    /**
     * Set slider width based on child count
     * @param {HTMLElement} slider - Slider element
     * @return {void}
     */

    setSliderWidth(slider) {
        slider.style.width = `${slider.childElementCount * 100}%`
    }


    /**
     * Load slider state from given child Element
     * @param {HTMLElement} el - Element from which to begin traversal to find slider state
     * @return {void}
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
     *  Get current slider slide index
     * @return {number}
     */

    getCurrentIndex() {
        let left = this.state.slider.style.left || '0%';
        left = parseInt(left.replace(/[-%]/, ''));

        return Math.round(left / 100);
    }

    /**
     * Click listener
     * @param {HTMLElement} target - Click target
     */

    click({target}) {
        const prev = target.matches(`[${this.config.attr}-prev]`, `[${this.config.attr}-prev] *`);
        const next = !prev && target.matches(`[${this.config.attr}-next]`, `[${this.config.attr}-next] *`);

        if (!prev && !next) return;

        this.navigate(target, next);
    }

    /**
     * Touchstart listener
     * @param {HTMLElement} target - Touch target
     * @param {TouchList} touchesStart - Touchstart event list
     */

    touchStart({target, changedTouches: touchesStart}) {

        console.log(touchesStart)

        if (!target.closest(`[${this.config.attr}]`)) return;

        if (touchesStart.length !== 1) return;

        this.loadState(target);

        this.state.start = touchesStart[0].screenX;
        this.state.isSwiping = true;
    }

    /**
     * Touchmove listener
     * @param {TouchList} touchesMove - Touchmove event list
     */

    touchMove({changedTouches: touchesMove}) {

        if (!this.state.isSwiping) return;

        this.state.swipingDistance = touchesMove[0].screenX - this.state.start;

        this.setState();
    }

    /**
     * Touchend listener
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
     * Get swiping distance in percents
     * @return {number}
     */

    caclPercetageDistance() {
        return (this.state.swipingDistance / this.state.width) * 100;
    }
}
